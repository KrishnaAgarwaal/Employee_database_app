import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Badge } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isLeft = !!employee.leaveDate;

  return (
    <Card
      onClick={onClick}
      className={`group cursor-pointer border-border/50 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${isLeft ? 'opacity-60' : ''}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Employee ID Badge */}
          <div className="mb-3 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <Badge className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">ID: {employee.id}</span>
          </div>

          {/* Profile Photo */}
          <div className="relative mb-4">
            {employee.personalInfo.profilePhoto ? (
              <img
                src={employee.personalInfo.profilePhoto}
                alt={employee.personalInfo.fullName}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10 transition-all group-hover:ring-primary/30"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary ring-4 ring-border transition-all group-hover:ring-primary/30">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full ring-2 ring-card ${isLeft ? 'bg-muted' : 'bg-success'}`} />
          </div>

          {/* Employee Name */}
          <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {employee.personalInfo.fullName || 'Unnamed Employee'}
          </h3>

          {/* Contact */}
          {employee.personalInfo.contactNumber && (
            <p className="mb-2 text-sm text-muted-foreground">
              {employee.personalInfo.contactNumber}
            </p>
          )}

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Joined {formatDate(employee.createdAt)}</span>
          </div>

          {/* Leave Date */}
          {employee.leaveDate && (
            <div className="mt-2 text-xs text-destructive">
              Left: {formatDate(employee.leaveDate)}
            </div>
          )}

          {/* Salary Badge */}
          {employee.personalInfo.salary && (
            <div className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              ₹{parseInt(employee.personalInfo.salary).toLocaleString('en-IN')}/month
            </div>
          )}

          {/* Status Badges */}
          <div className="mt-2 flex gap-1">
            {employee.isFinalized && (
              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">Finalized</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
