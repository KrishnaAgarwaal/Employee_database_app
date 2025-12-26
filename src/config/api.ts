// API Configuration
// Change this URL to point to your local backend server when running locally

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  employees: `${API_BASE_URL}/api/employees`,
  employeeById: (id: string) => `${API_BASE_URL}/api/employees/${id}`,
  employeeByUsername: (username: string) => `${API_BASE_URL}/api/employees/by-username/${username}`,
  employeesCompleted: `${API_BASE_URL}/api/employees/completed`,
  employeesWorking: `${API_BASE_URL}/api/employees/working`,
  employeesStats: `${API_BASE_URL}/api/employees/stats`,
  employeesNextId: `${API_BASE_URL}/api/employees/next-id`,
  employeeComplete: (id: string) => `${API_BASE_URL}/api/employees/${id}/complete`,
  employeeFinalize: (id: string) => `${API_BASE_URL}/api/employees/${id}/finalize`,
  employeeLeaveDate: (id: string) => `${API_BASE_URL}/api/employees/${id}/leave-date`,
  upload: `${API_BASE_URL}/api/upload`,
};
