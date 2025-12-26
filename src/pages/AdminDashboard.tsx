import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Employee } from '@/types/employee';
import { employeeApi } from '@/services/employeeApi';
import { generateEmployeePDF, downloadEmployeePDF } from '@/utils/pdfGenerator';
import { EmployeeCard } from '@/components/admin/EmployeeCard';
import { PersonalInfoTab } from '@/components/employee/PersonalInfoTab';
import { BankDetailsTab } from '@/components/employee/BankDetailsTab';
import { EducationTab } from '@/components/employee/EducationTab';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LogOut, Users, UserCheck, FileDown, Save, User, Building2, GraduationCap,
  Search, Eye, X, CheckCircle, Calendar, Trash2, Maximize2
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { logout, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState({ total: 0, working: 0, left: 0 });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [showWorkingOnly, setShowWorkingOnly] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      navigate('/');
      return;
    }
    loadEmployees();
  }, [isAuthenticated, role, navigate]);

  const loadEmployees = async () => {
    const isHealthy = await employeeApi.checkHealth();
    setBackendAvailable(isHealthy);
    
    if (isHealthy) {
      try {
        const [emps, statsData] = await Promise.all([
          employeeApi.getCompletedEmployees(),
          employeeApi.getStats()
        ]);
        setEmployees(emps);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading employees:', error);
        toast.error('Failed to load employees');
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.personalInfo.contactNumber.includes(searchQuery) ||
      emp.id.includes(searchQuery);
    const matchesFilter = showWorkingOnly ? !emp.leaveDate : true;
    return matchesSearch && matchesFilter;
  });

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditedEmployee({ ...employee });
    setIsEditing(false);
    setActiveTab('personal');
    setIsFullscreen(true);
  };

  const handleCloseDetail = () => {
    setSelectedEmployee(null);
    setEditedEmployee(null);
    setIsEditing(false);
    setIsFullscreen(false);
    setPdfPreviewUrl(null);
  };

  const handleSaveChanges = async () => {
    if (editedEmployee) {
      try {
        await employeeApi.updateEmployee(editedEmployee.id, editedEmployee, true);
        setSelectedEmployee(editedEmployee);
        setIsEditing(false);
        loadEmployees();
        toast.success('Employee details updated');
      } catch (error) {
        toast.error('Failed to save changes');
      }
    }
  };

  const handleFinalize = async () => {
    if (editedEmployee) {
      try {
        await employeeApi.finalizeEmployee(editedEmployee.id);
        toast.success('Employee finalized - they can no longer edit their data, but you can still make changes');
        loadEmployees();
      } catch (error) {
        toast.error('Failed to finalize employee');
      }
    }
  };

  const handleSetLeaveDate = async (date: string) => {
    if (editedEmployee) {
      try {
        const updated = await employeeApi.setLeaveDate(editedEmployee.id, date || null);
        setEditedEmployee(updated);
        setSelectedEmployee(updated);
        loadEmployees();
        toast.success(date ? 'Leave date set' : 'Leave date cleared');
      } catch (error) {
        toast.error('Failed to set leave date');
      }
    }
  };

  const handleDelete = async () => {
    if (editedEmployee && confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeApi.deleteEmployee(editedEmployee.id);
        toast.success('Employee deleted');
        loadEmployees();
        handleCloseDetail();
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const handlePreviewPDF = async () => {
    if (editedEmployee) {
      try {
        const blob = await generateEmployeePDF(editedEmployee);
        const url = URL.createObjectURL(blob);
        setPdfPreviewUrl(url);
      } catch (error) {
        toast.error('Error generating PDF preview');
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (editedEmployee) {
      try {
        await downloadEmployeePDF(editedEmployee);
        toast.success('PDF downloaded');
      } catch (error) {
        toast.error('Error generating PDF');
      }
    }
  };

  if (!backendAvailable) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Backend Not Available</h2>
            <p className="text-muted-foreground mb-4">Start the backend server:</p>
            <code className="block bg-secondary p-3 rounded text-sm mb-4">cd backend && npm start</code>
            <Button onClick={loadEmployees}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage employees</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => { logout(); navigate('/'); }} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/50 shadow-card cursor-pointer" onClick={() => setShowWorkingOnly(false)}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
            </CardContent>
          </Card>
          <Card 
            className={`border-border/50 shadow-card cursor-pointer ${showWorkingOnly ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setShowWorkingOnly(true)}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.working}</p>
                <p className="text-sm text-muted-foreground">Currently Working</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {showWorkingOnly && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing only currently working employees</span>
            <Button variant="ghost" size="sm" onClick={() => setShowWorkingOnly(false)}>Clear filter</Button>
          </div>
        )}

        {filteredEmployees.length === 0 ? (
          <Card className="border-border/50 shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No Employees Found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No employees match your search' : 'Employee submissions will appear here'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} onClick={() => handleSelectEmployee(employee)} />
            ))}
          </div>
        )}
      </main>
      
      {/* Trademark */}
      <div className="fixed bottom-4 right-4 z-40">
        <p className="text-xs text-muted-foreground/60 bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          Developed by Krishna Agarwaal
        </p>
      </div>

      {/* Fullscreen Employee Modal */}
      <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && handleCloseDetail()}>
        <DialogContent className={`${isFullscreen ? 'max-w-full h-full m-0 rounded-none' : 'max-w-4xl max-h-[90vh]'} overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>Employee: {editedEmployee?.id} - {editedEmployee?.personalInfo.fullName}</span>
            </DialogTitle>
          </DialogHeader>

          {editedEmployee && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {isEditing ? (
                  <Button onClick={handleSaveChanges} className="gap-2 gradient-primary"><Save className="h-4 w-4" />Save</Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline">Edit</Button>
                )}
                <Button onClick={handlePreviewPDF} variant="outline" className="gap-2"><Eye className="h-4 w-4" />Preview PDF</Button>
                <Button onClick={handleDownloadPDF} variant="outline" className="gap-2"><FileDown className="h-4 w-4" />Download PDF</Button>
                <Button onClick={handleFinalize} variant="default" className="gap-2 bg-success hover:bg-success/90">
                  <CheckCircle className="h-4 w-4" />Finalize
                </Button>
                <Button onClick={handleDelete} variant="destructive" className="gap-2"><Trash2 className="h-4 w-4" />Delete</Button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
                <Label>Leave Date:</Label>
                <Input
                  type="date"
                  value={editedEmployee.leaveDate || ''}
                  onChange={(e) => handleSetLeaveDate(e.target.value)}
                  className="w-auto"
                />
                {editedEmployee.leaveDate && (
                  <Button variant="ghost" size="sm" onClick={() => handleSetLeaveDate('')}>Clear</Button>
                )}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal" className="gap-2"><User className="h-4 w-4" /><span className="hidden sm:inline">Personal</span></TabsTrigger>
                  <TabsTrigger value="bank" className="gap-2"><Building2 className="h-4 w-4" /><span className="hidden sm:inline">Bank</span></TabsTrigger>
                  <TabsTrigger value="education" className="gap-2"><GraduationCap className="h-4 w-4" /><span className="hidden sm:inline">Education</span></TabsTrigger>
                </TabsList>
                <div className="mt-6">
                  <TabsContent value="personal">
                    <PersonalInfoTab data={editedEmployee.personalInfo} onChange={(data) => setEditedEmployee({ ...editedEmployee, personalInfo: data })} onSave={() => {}} disabled={!isEditing} hideSaveButton={true} />
                  </TabsContent>
                  <TabsContent value="bank">
                    <BankDetailsTab data={editedEmployee.bankDetails} onChange={(data) => setEditedEmployee({ ...editedEmployee, bankDetails: data })} onSave={() => {}} disabled={!isEditing} hideSaveButton={true} />
                  </TabsContent>
                  <TabsContent value="education">
                    <EducationTab data={editedEmployee.educationDetails} onChange={(data) => setEditedEmployee({ ...editedEmployee, educationDetails: data })} onSave={() => {}} disabled={!isEditing} hideSaveButton={true} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Preview Modal */}
      <Dialog open={!!pdfPreviewUrl} onOpenChange={() => { if(pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl); setPdfPreviewUrl(null); }}>
        <DialogContent className="max-w-full h-screen m-0 rounded-none p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>PDF Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {pdfPreviewUrl && <iframe src={pdfPreviewUrl} className="w-full h-full border-0" />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
