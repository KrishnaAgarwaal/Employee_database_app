import { Employee, PersonalInfo, BankDetails, EducationDetails } from '@/types/employee';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';

// API Service for Employee Management
export const employeeApi = {
  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(API_ENDPOINTS.health);
      return response.ok;
    } catch {
      return false;
    }
  },

  // Get next available employee ID
  async getNextId(): Promise<string> {
    const response = await fetch(API_ENDPOINTS.employeesNextId);
    if (!response.ok) throw new Error('Failed to get next ID');
    const data = await response.json();
    return data.nextId;
  },

  // Get employee by username (returns existing non-finalized employee or null)
  async getEmployeeByUsername(username: string): Promise<Employee | null> {
    try {
      const response = await fetch(API_ENDPOINTS.employeeByUsername(username));
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) throw new Error('Failed to fetch employee');
      return response.json();
    } catch {
      return null;
    }
  },

  // Create new employee OR get existing one for username
  async createEmployee(data?: Partial<Employee> & { username?: string }): Promise<Employee> {
    const response = await fetch(API_ENDPOINTS.employees, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  },

  // Get all employees
  async getEmployees(): Promise<Employee[]> {
    const response = await fetch(API_ENDPOINTS.employees);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  // Get completed employees
  async getCompletedEmployees(): Promise<Employee[]> {
    const response = await fetch(API_ENDPOINTS.employeesCompleted);
    if (!response.ok) throw new Error('Failed to fetch completed employees');
    return response.json();
  },

  // Get currently working employees
  async getWorkingEmployees(): Promise<Employee[]> {
    const response = await fetch(API_ENDPOINTS.employeesWorking);
    if (!response.ok) throw new Error('Failed to fetch working employees');
    return response.json();
  },

  // Get employee stats
  async getStats(): Promise<{ total: number; working: number; left: number }> {
    const response = await fetch(API_ENDPOINTS.employeesStats);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Get single employee
  async getEmployee(id: string): Promise<Employee> {
    const response = await fetch(API_ENDPOINTS.employeeById(id));
    if (!response.ok) throw new Error('Failed to fetch employee');
    return response.json();
  },

  // Update employee
  async updateEmployee(id: string, data: Partial<Employee>, adminAction = false): Promise<Employee> {
    const response = await fetch(API_ENDPOINTS.employeeById(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, adminAction }),
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  },

  // Mark employee as completed
  async completeEmployee(id: string): Promise<Employee> {
    const response = await fetch(API_ENDPOINTS.employeeComplete(id), {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to complete employee');
    return response.json();
  },

  // Finalize employee (admin only)
  async finalizeEmployee(id: string): Promise<Employee> {
    const response = await fetch(API_ENDPOINTS.employeeFinalize(id), {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to finalize employee');
    return response.json();
  },

  // Set leave date
  async setLeaveDate(id: string, leaveDate: string | null): Promise<Employee> {
    const response = await fetch(API_ENDPOINTS.employeeLeaveDate(id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leaveDate }),
    });
    if (!response.ok) throw new Error('Failed to set leave date');
    return response.json();
  },

  // Delete employee
  async deleteEmployee(id: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.employeeById(id), {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
  },

  // Upload file and get URL
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(API_ENDPOINTS.upload, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Failed to upload file');
    const data = await response.json();
    return `${API_BASE_URL}${data.url}`;
  },
};
