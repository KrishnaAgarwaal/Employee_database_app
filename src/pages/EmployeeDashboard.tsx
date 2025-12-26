import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Employee, PersonalInfo, BankDetails, EducationDetails, initialPersonalInfo, initialBankDetails, initialEducationDetails } from '@/types/employee';
import { employeeApi } from '@/services/employeeApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PersonalInfoTab } from '@/components/employee/PersonalInfoTab';
import { BankDetailsTab } from '@/components/employee/BankDetailsTab';
import { EducationTab } from '@/components/employee/EducationTab';
import { DetailsMasterTab } from '@/components/employee/DetailsMasterTab';
import { LogOut, User, Building2, GraduationCap, Badge, Layers } from 'lucide-react';
import { toast } from 'sonner';

const EmployeeDashboard: React.FC = () => {
  const { logout, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);

  // Use a fixed username for employee login (in real app, this would come from auth)
  const EMPLOYEE_USERNAME = 'default_employee';

  useEffect(() => {
    if (!isAuthenticated || role !== 'employee') {
      navigate('/');
      return;
    }
    initializeEmployee();
  }, [isAuthenticated, role, navigate]);

  const initializeEmployee = async () => {
    setIsLoading(true);
    
    // Check if backend is available
    const isHealthy = await employeeApi.checkHealth();
    setBackendAvailable(isHealthy);
    
    if (isHealthy) {
      try {
        // CRITICAL FIX: Always try to get existing employee first by username
        // This ensures the SAME form reopens, not a new one
        const existingEmployee = await employeeApi.getEmployeeByUsername(EMPLOYEE_USERNAME);
        
        if (existingEmployee) {
          console.log('Found existing employee:', existingEmployee.id);
          setEmployee(existingEmployee);
          setIsLoading(false);
          return;
        }
        
        // No existing employee found - create a new one with username
        console.log('Creating new employee for username:', EMPLOYEE_USERNAME);
        const newEmployee = await employeeApi.createEmployee({
          username: EMPLOYEE_USERNAME,
          personalInfo: initialPersonalInfo,
          bankDetails: initialBankDetails,
          educationDetails: initialEducationDetails,
        });
        setEmployee(newEmployee);
      } catch (error) {
        console.error('Error initializing employee:', error);
        toast.error('Failed to connect to server. Please ensure backend is running.');
      }
    } else {
      toast.error('Backend server not available. Please start the backend server.');
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (!backendAvailable) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Backend Not Available</h2>
            <p className="text-muted-foreground mb-4">
              Please start the backend server to continue. Run the following commands:
            </p>
            <code className="block bg-secondary p-3 rounded text-sm text-left mb-4">
              cd backend<br />
              npm install<br />
              npm start
            </code>
            <Button onClick={initializeEmployee} className="w-full">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const updatePersonalInfo = (data: PersonalInfo) => {
    setEmployee(prev => prev ? { ...prev, personalInfo: data } : null);
  };

  const updateBankDetails = (data: BankDetails) => {
    setEmployee(prev => prev ? { ...prev, bankDetails: data } : null);
  };

  const updateEducationDetails = (data: EducationDetails) => {
    setEmployee(prev => prev ? { ...prev, educationDetails: data } : null);
  };

  const handleSave = async () => {
    if (!employee) return;
    
    setIsSaving(true);
    try {
      await employeeApi.updateEmployee(employee.id, {
        personalInfo: employee.personalInfo,
        bankDetails: employee.bankDetails,
        educationDetails: employee.educationDetails,
      });
      toast.success('Progress saved successfully');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    // Save current data before logout
    if (employee) {
      try {
        await employeeApi.updateEmployee(employee.id, {
          personalInfo: employee.personalInfo,
          bankDetails: employee.bankDetails,
          educationDetails: employee.educationDetails,
        });
        console.log('Saved employee data on logout');
      } catch (error) {
        console.error('Error saving on logout:', error);
      }
    }
    // Don't clear anything - the employee data persists on backend
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Employee Form</h1>
              <p className="text-xs text-muted-foreground">Complete your profile</p>
            </div>
          </div>
          
          {/* Employee ID Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
              <Badge className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">ID: {employee.id}</span>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Card className="shadow-card border-border/50">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-border bg-secondary/30 px-4 sm:px-6">
                <TabsList className="h-auto bg-transparent p-0">
                  <TabsTrigger
                    value="details"
                    className="relative rounded-none border-b-2 border-transparent px-4 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">All Details</span>
                    <span className="sm:hidden">Details</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="personal"
                    className="relative rounded-none border-b-2 border-transparent px-4 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Personal Info</span>
                    <span className="sm:hidden">Personal</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bank"
                    className="relative rounded-none border-b-2 border-transparent px-4 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Bank Details</span>
                    <span className="sm:hidden">Bank</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="relative rounded-none border-b-2 border-transparent px-4 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Education</span>
                    <span className="sm:hidden">Edu</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <TabsContent value="details" className="mt-0">
                  <DetailsMasterTab
                    personalInfo={employee.personalInfo}
                    bankDetails={employee.bankDetails}
                    educationDetails={employee.educationDetails}
                    onPersonalInfoChange={updatePersonalInfo}
                    onBankDetailsChange={updateBankDetails}
                    onEducationDetailsChange={updateEducationDetails}
                    onSave={handleSave}
                  />
                </TabsContent>
                <TabsContent value="personal" className="mt-0">
                  <PersonalInfoTab
                    data={employee.personalInfo}
                    onChange={updatePersonalInfo}
                    onSave={handleSave}
                  />
                </TabsContent>
                <TabsContent value="bank" className="mt-0">
                  <BankDetailsTab
                    data={employee.bankDetails}
                    onChange={updateBankDetails}
                    onSave={handleSave}
                  />
                </TabsContent>
                <TabsContent value="education" className="mt-0">
                  <EducationTab
                    data={employee.educationDetails}
                    onChange={updateEducationDetails}
                    onSave={handleSave}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info Card - No Submit Button for Employees */}
        <Card className="mt-6 border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Badge className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Your Employee ID: {employee.id}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your data is automatically saved. The admin will finalize your record once reviewed.
                </p>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                variant="outline"
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  'Save Progress'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Trademark */}
      <div className="fixed bottom-4 right-4 z-40">
        <p className="text-xs text-muted-foreground/60 bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          Developed by Krishna Agarwaal
        </p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
