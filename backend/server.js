const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data directories
const DATA_DIR = path.join(__dirname, 'data');
const EMPLOYEES_FILE = path.join(DATA_DIR, 'employees.json');
const COUNTER_FILE = path.join(DATA_DIR, 'counter.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(EMPLOYEES_FILE)) {
  fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(COUNTER_FILE)) {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ lastId: 0 }, null, 2));
}

// File locking mechanism for concurrent access
const locks = new Map();

const acquireLock = async (resource) => {
  while (locks.get(resource)) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  locks.set(resource, true);
};

const releaseLock = (resource) => {
  locks.delete(resource);
};

// Helper functions
const readEmployees = () => {
  try {
    const data = fs.readFileSync(EMPLOYEES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading employees:', error);
    return [];
  }
};

const writeEmployees = (employees) => {
  fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(employees, null, 2));
};

const readCounter = () => {
  try {
    const data = fs.readFileSync(COUNTER_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading counter:', error);
    return { lastId: 0 };
  }
};

const writeCounter = (counter) => {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(counter, null, 2));
};

const generateEmployeeId = async () => {
  await acquireLock('counter');
  try {
    const counter = readCounter();
    counter.lastId += 1;
    writeCounter(counter);
    return String(counter.lastId).padStart(4, '0');
  } finally {
    releaseLock('counter');
  }
};

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// ===================== API ROUTES =====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get next employee ID (for display during form filling)
app.get('/api/employees/next-id', async (req, res) => {
  try {
    const counter = readCounter();
    const nextId = String(counter.lastId + 1).padStart(4, '0');
    res.json({ nextId });
  } catch (error) {
    console.error('Error getting next ID:', error);
    res.status(500).json({ error: 'Failed to get next ID' });
  }
});

// Get employee by username (for login - returns existing non-finalized employee)
app.get('/api/employees/by-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const employees = readEmployees();
    
    // Find existing non-finalized employee for this username
    const employee = employees.find(emp => emp.username === username && !emp.isFinalized);
    
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'No active employee found for this username' });
    }
  } catch (error) {
    console.error('Error fetching employee by username:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create new employee OR return existing one for username
app.post('/api/employees', async (req, res) => {
  try {
    await acquireLock('employees');
    
    const { username } = req.body;
    const employees = readEmployees();
    
    // CRITICAL: Check if there's already an active (non-finalized) employee for this username
    if (username) {
      const existingEmployee = employees.find(emp => emp.username === username && !emp.isFinalized);
      if (existingEmployee) {
        console.log(`Returning existing employee for username: ${username}, ID: ${existingEmployee.id}`);
        releaseLock('employees');
        return res.json(existingEmployee);
      }
    }
    
    const employeeId = await generateEmployeeId();
    
    const newEmployee = {
      id: employeeId,
      username: username || `employee_${employeeId}`,
      personalInfo: req.body.personalInfo || {},
      bankDetails: req.body.bankDetails || {},
      educationDetails: req.body.educationDetails || {},
      isCompleted: false,
      isFinalized: false,
      leaveDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    employees.push(newEmployee);
    writeEmployees(employees);
    
    console.log(`Created NEW employee with ID: ${employeeId} for username: ${newEmployee.username}`);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  } finally {
    releaseLock('employees');
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = readEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get all employees with data (for admin - shows all who have saved data)
app.get('/api/employees/completed', async (req, res) => {
  try {
    const employees = readEmployees();
    // Show ALL employees who have any data (not just completed/finalized)
    // This ensures admin sees employees immediately when they save
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get currently working employees (no leave date)
app.get('/api/employees/working', async (req, res) => {
  try {
    const employees = readEmployees();
    const working = employees.filter(emp => (emp.isCompleted || emp.isFinalized) && !emp.leaveDate);
    res.json(working);
  } catch (error) {
    console.error('Error fetching working employees:', error);
    res.status(500).json({ error: 'Failed to fetch working employees' });
  }
});

// Get employee stats
app.get('/api/employees/stats', async (req, res) => {
  try {
    const employees = readEmployees();
    const completed = employees.filter(emp => emp.isCompleted || emp.isFinalized);
    const working = completed.filter(emp => !emp.leaveDate);
    
    res.json({
      total: completed.length,
      working: working.length,
      left: completed.length - working.length
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get single employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employees = readEmployees();
    const employee = employees.find(emp => emp.id === req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    await acquireLock('employees');
    
    const employees = readEmployees();
    const index = employees.findIndex(emp => emp.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Check if employee is finalized (only admin can edit finalized employees)
    if (employees[index].isFinalized && !req.body.adminAction) {
      return res.status(403).json({ error: 'Employee is finalized and cannot be edited' });
    }
    
    employees[index] = {
      ...employees[index],
      ...req.body,
      id: employees[index].id, // Preserve ID
      createdAt: employees[index].createdAt, // Preserve created date
      updatedAt: new Date().toISOString()
    };
    
    writeEmployees(employees);
    console.log(`Updated employee: ${req.params.id}`);
    res.json(employees[index]);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  } finally {
    releaseLock('employees');
  }
});

// Mark employee as completed (employee submits form)
app.post('/api/employees/:id/complete', async (req, res) => {
  try {
    await acquireLock('employees');
    
    const employees = readEmployees();
    const index = employees.findIndex(emp => emp.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    employees[index].isCompleted = true;
    employees[index].updatedAt = new Date().toISOString();
    
    writeEmployees(employees);
    console.log(`Employee completed: ${req.params.id}`);
    res.json(employees[index]);
  } catch (error) {
    console.error('Error completing employee:', error);
    res.status(500).json({ error: 'Failed to complete employee' });
  } finally {
    releaseLock('employees');
  }
});

// Finalize employee (admin only - removes from employee access)
app.post('/api/employees/:id/finalize', async (req, res) => {
  try {
    await acquireLock('employees');
    
    const employees = readEmployees();
    const index = employees.findIndex(emp => emp.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    employees[index].isFinalized = true;
    employees[index].updatedAt = new Date().toISOString();
    
    writeEmployees(employees);
    console.log(`Employee finalized by admin: ${req.params.id}`);
    res.json(employees[index]);
  } catch (error) {
    console.error('Error finalizing employee:', error);
    res.status(500).json({ error: 'Failed to finalize employee' });
  } finally {
    releaseLock('employees');
  }
});

// Set leave date (admin only)
app.post('/api/employees/:id/leave-date', async (req, res) => {
  try {
    await acquireLock('employees');
    
    const employees = readEmployees();
    const index = employees.findIndex(emp => emp.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    employees[index].leaveDate = req.body.leaveDate || null;
    employees[index].updatedAt = new Date().toISOString();
    
    writeEmployees(employees);
    console.log(`Leave date set for employee: ${req.params.id}`);
    res.json(employees[index]);
  } catch (error) {
    console.error('Error setting leave date:', error);
    res.status(500).json({ error: 'Failed to set leave date' });
  } finally {
    releaseLock('employees');
  }
});

// Delete employee (admin only - soft delete by moving to archive)
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await acquireLock('employees');
    
    const employees = readEmployees();
    const index = employees.findIndex(emp => emp.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const deleted = employees.splice(index, 1)[0];
    writeEmployees(employees);
    
    console.log(`Employee deleted: ${req.params.id}`);
    res.json({ message: 'Employee deleted', employee: deleted });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  } finally {
    releaseLock('employees');
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log(`File uploaded: ${fileUrl}`);
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   Employee Management Backend Server                          ║
║   ─────────────────────────────────────────────────────────   ║
║                                                               ║
║   Server running on: http://localhost:${PORT}                   ║
║   Data directory:    ${DATA_DIR}
║                                                               ║
║   API Endpoints:                                              ║
║   • GET  /api/health              - Health check              ║
║   • GET  /api/employees           - List all employees        ║
║   • GET  /api/employees/stats     - Get employee stats        ║
║   • GET  /api/employees/completed - List completed employees  ║
║   • GET  /api/employees/working   - List working employees    ║
║   • GET  /api/employees/next-id   - Get next employee ID      ║
║   • GET  /api/employees/:id       - Get single employee       ║
║   • POST /api/employees           - Create new employee       ║
║   • PUT  /api/employees/:id       - Update employee           ║
║   • POST /api/employees/:id/complete  - Mark as completed     ║
║   • POST /api/employees/:id/finalize  - Finalize (admin)      ║
║   • POST /api/employees/:id/leave-date - Set leave date       ║
║   • DELETE /api/employees/:id     - Delete employee           ║
║   • POST /api/upload              - Upload file               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
