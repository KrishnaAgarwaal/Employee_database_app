# Employee Management Backend Server

A local Node.js/Express backend that stores employee data as JSON files.

## Features

- **JSON File Storage**: All employee data stored in `data/employees.json`
- **Sequential Employee IDs**: Auto-generated 4-digit IDs (0001, 0002, ...)
- **Concurrent Request Handling**: File locking prevents data corruption
- **File Uploads**: Documents stored in `data/uploads/` folder
- **Leave Date Tracking**: Track when employees leave the company
- **Finalization**: Admin can finalize employees to prevent further edits

## Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3001`

## Data Storage

All data is stored in the `backend/data/` folder:
- `employees.json` - All employee records
- `counter.json` - Sequential ID counter
- `uploads/` - Uploaded document files

## Frontend Configuration

Update the frontend to point to this local server by setting:
```
VITE_API_URL=http://localhost:3001
```

Or update `src/config/api.ts` to use `http://localhost:3001` as the base URL.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/stats` | Get employee statistics |
| GET | `/api/employees/completed` | List completed employees |
| GET | `/api/employees/working` | List currently working employees |
| GET | `/api/employees/next-id` | Get next available ID |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| POST | `/api/employees/:id/complete` | Mark as completed |
| POST | `/api/employees/:id/finalize` | Finalize (admin only) |
| POST | `/api/employees/:id/leave-date` | Set leave date |
| DELETE | `/api/employees/:id` | Delete employee |
| POST | `/api/upload` | Upload file |

## Running with Frontend

1. Start the backend: `cd backend && npm start`
2. Start the frontend: `npm run dev` (in the project root)
3. Access the app at `http://localhost:8080`
