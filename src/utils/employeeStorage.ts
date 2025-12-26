import { Employee, initialPersonalInfo, initialBankDetails, initialEducationDetails } from '@/types/employee';

const EMPLOYEES_KEY = 'employees';
const CURRENT_EMPLOYEE_KEY = 'currentEmployeeId';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getEmployees = (): Employee[] => {
  const data = localStorage.getItem(EMPLOYEES_KEY);
  return data ? JSON.parse(data) : [];
};

export const getEmployee = (id: string): Employee | undefined => {
  const employees = getEmployees();
  return employees.find(emp => emp.id === id);
};

export const saveEmployee = (employee: Employee): void => {
  const employees = getEmployees();
  const index = employees.findIndex(emp => emp.id === employee.id);
  
  if (index >= 0) {
    employees[index] = { ...employee, updatedAt: new Date().toISOString() };
  } else {
    employees.push(employee);
  }
  
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
};

export const deleteEmployee = (id: string): void => {
  const employees = getEmployees().filter(emp => emp.id !== id);
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
};

export const getCurrentEmployeeId = (): string | null => {
  return localStorage.getItem(CURRENT_EMPLOYEE_KEY);
};

export const setCurrentEmployeeId = (id: string): void => {
  localStorage.setItem(CURRENT_EMPLOYEE_KEY, id);
};

export const clearCurrentEmployeeId = (): void => {
  localStorage.removeItem(CURRENT_EMPLOYEE_KEY);
};

export const getOrCreateCurrentEmployee = (): Employee => {
  let employeeId = getCurrentEmployeeId();
  
  if (employeeId) {
    const employee = getEmployee(employeeId);
    if (employee && !employee.isCompleted) {
      return employee;
    }
  }
  
  const newEmployee: Employee = {
    id: generateId(),
    personalInfo: { ...initialPersonalInfo },
    bankDetails: { ...initialBankDetails },
    educationDetails: { ...initialEducationDetails },
    isCompleted: false,
    isFinalized: false,
    leaveDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  saveEmployee(newEmployee);
  setCurrentEmployeeId(newEmployee.id);
  
  return newEmployee;
};

export const getCompletedEmployees = (): Employee[] => {
  return getEmployees().filter(emp => emp.isCompleted);
};
