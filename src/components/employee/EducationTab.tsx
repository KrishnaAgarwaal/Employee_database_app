import React from 'react';
import { EducationDetails } from '@/types/employee';
import { FormField } from '@/components/ui/form-field';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Save, GraduationCap } from 'lucide-react';

interface EducationTabProps {
  data: EducationDetails;
  onChange: (data: EducationDetails) => void;
  onSave: () => void;
  disabled?: boolean;
  hideSaveButton?: boolean;
}

export const EducationTab: React.FC<EducationTabProps> = ({
  data,
  onChange,
  onSave,
  disabled = false,
  hideSaveButton = false,
}) => {
  const updateField = (field: keyof EducationDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 rounded-xl bg-secondary/30 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <GraduationCap className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Educational Background</h3>
          <p className="text-sm text-muted-foreground">
            Enter your educational qualifications and upload certificates
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <FormField
          label="All Qualifications Completed"
          name="allQualifications"
          type="textarea"
          value={data.allQualifications}
          onChange={(v) => updateField('allQualifications', v)}
          placeholder="Enter all qualifications separated by commas (e.g., 10th, 12th, Diploma, BSc, MSc)"
          disabled={disabled}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FileUpload
            label="10th Marksheet"
            value={data.tenthMarksheet}
            onChange={(v) => updateField('tenthMarksheet', v)}
            disabled={disabled}
          />
          <FileUpload
            label="12th Marksheet"
            value={data.twelfthMarksheet}
            onChange={(v) => updateField('twelfthMarksheet', v)}
            disabled={disabled}
          />
        </div>

        {/* Degree - FILE UPLOAD (not text) */}
        <FileUpload
          label="Degree Certificate (PDF/Image)"
          value={data.degree}
          onChange={(v) => updateField('degree', v)}
          disabled={disabled}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      {/* Save Button */}
      {!disabled && !hideSaveButton && (
        <div className="flex justify-end">
          <Button onClick={onSave} className="gap-2 gradient-primary px-8 py-6 text-base">
            <Save className="h-5 w-5" />
            Save Education Details
          </Button>
        </div>
      )}
    </div>
  );
};
