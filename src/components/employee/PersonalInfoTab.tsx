import React from 'react';
import { PersonalInfo } from '@/types/employee';
import { FormField } from '@/components/ui/form-field';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { User, Save, Camera } from 'lucide-react';

interface PersonalInfoTabProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  onSave: () => void;
  disabled?: boolean;
  hideSaveButton?: boolean;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  data,
  onChange,
  onSave,
  disabled = false,
  hideSaveButton = false,
}) => {
  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('profilePhoto', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center gap-4 rounded-xl bg-secondary/30 p-6">
        <div className="relative">
          {data.profilePhoto ? (
            <img
              src={data.profilePhoto}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted ring-4 ring-border">
              <User className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          {!disabled && (
            <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
              <Camera className="h-5 w-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {data.profilePhoto ? 'Click camera icon to change photo' : 'Upload your profile photo'}
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          label="Full Name"
          name="fullName"
          value={data.fullName}
          onChange={(v) => updateField('fullName', v)}
          placeholder="Enter full name"
          disabled={disabled}
          autoCapitalize
          required
        />
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={data.dateOfBirth}
          onChange={(v) => updateField('dateOfBirth', v)}
          disabled={disabled}
          required
        />
        <FormField
          label="Gender"
          name="gender"
          type="select"
          value={data.gender}
          onChange={(v) => updateField('gender', v)}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          disabled={disabled}
          required
        />
        <FormField
          label="Contact Number"
          name="contactNumber"
          type="tel"
          value={data.contactNumber}
          onChange={(v) => updateField('contactNumber', v)}
          placeholder="Enter contact number"
          disabled={disabled}
          required
        />
        <div className="md:col-span-2">
          <FormField
            label="Address"
            name="address"
            type="textarea"
            value={data.address}
            onChange={(v) => updateField('address', v)}
            placeholder="Enter full address"
            disabled={disabled}
            autoCapitalize
          />
        </div>
        <FormField
          label="Father's Name"
          name="fatherName"
          value={data.fatherName}
          onChange={(v) => updateField('fatherName', v)}
          placeholder="Enter father's name"
          disabled={disabled}
          autoCapitalize
        />
        <FormField
          label="Mother's Name"
          name="motherName"
          value={data.motherName}
          onChange={(v) => updateField('motherName', v)}
          placeholder="Enter mother's name"
          disabled={disabled}
          autoCapitalize
        />
        <div className="md:col-span-2">
          <FormField
            label="Parent's Address"
            name="parentAddress"
            type="textarea"
            value={data.parentAddress}
            onChange={(v) => updateField('parentAddress', v)}
            placeholder="Enter parent's address"
            disabled={disabled}
          />
        </div>
        <FormField
          label="Parent's Mobile Number"
          name="parentMobileNumber"
          type="tel"
          value={data.parentMobileNumber}
          onChange={(v) => updateField('parentMobileNumber', v)}
          placeholder="Enter parent's mobile"
          disabled={disabled}
        />
        <FormField
          label="Hometown"
          name="hometown"
          value={data.hometown}
          onChange={(v) => updateField('hometown', v)}
          placeholder="Enter hometown"
          disabled={disabled}
          autoCapitalize
        />
        <FormField
          label="Salary"
          name="salary"
          type="number"
          value={data.salary}
          onChange={(v) => updateField('salary', v)}
          placeholder="Enter salary amount"
          disabled={disabled}
        />
        <FormField
          label="Joining Date"
          name="joiningDate"
          type="date"
          value={data.joiningDate}
          onChange={(v) => updateField('joiningDate', v)}
          disabled={disabled}
        />
      </div>

      {/* Document Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Documents</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              label="Aadhaar Card Number"
              name="aadhaarNumber"
              value={data.aadhaarNumber}
              onChange={(v) => updateField('aadhaarNumber', v)}
              placeholder="Enter Aadhaar number"
              disabled={disabled}
            />
            <FileUpload
              label="Aadhaar Card Image"
              value={data.aadhaarImage}
              onChange={(v) => updateField('aadhaarImage', v)}
              disabled={disabled}
            />
          </div>
          <div className="space-y-4">
            <FormField
              label="PAN Card"
              name="panCard"
              value={data.panCard}
              onChange={(v) => updateField('panCard', v)}
              placeholder="Enter PAN number"
              disabled={disabled}
            />
            <FileUpload
              label="PAN Card Image"
              value={data.panCardImage}
              onChange={(v) => updateField('panCardImage', v)}
              disabled={disabled}
            />
          </div>
          <div className="space-y-4">
            <FormField
              label="Ayushman Card"
              name="ayushmanCard"
              value={data.ayushmanCard}
              onChange={(v) => updateField('ayushmanCard', v)}
              placeholder="Enter Ayushman card number"
              disabled={disabled}
            />
            <FileUpload
              label="Ayushman Card Image"
              value={data.ayushmanCardImage}
              onChange={(v) => updateField('ayushmanCardImage', v)}
              disabled={disabled}
            />
          </div>
          <div className="space-y-4">
            <FormField
              label="Driving Licence"
              name="drivingLicence"
              value={data.drivingLicence}
              onChange={(v) => updateField('drivingLicence', v)}
              placeholder="Enter licence number"
              disabled={disabled}
            />
            <FileUpload
              label="Driving Licence Image"
              value={data.drivingLicenceImage}
              onChange={(v) => updateField('drivingLicenceImage', v)}
              disabled={disabled}
            />
          </div>
          <div className="space-y-4">
            <FormField
              label="Police Verification"
              name="policeVerification"
              value={data.policeVerification}
              onChange={(v) => updateField('policeVerification', v)}
              placeholder="Enter verification details"
              disabled={disabled}
            />
            <FileUpload
              label="Police Verification Document"
              value={data.policeVerificationImage}
              onChange={(v) => updateField('policeVerificationImage', v)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div>
        <FormField
          label="Notes"
          name="notes"
          type="textarea"
          value={data.notes}
          onChange={(v) => updateField('notes', v)}
          placeholder="Additional notes..."
          disabled={disabled}
        />
      </div>

      {/* Save Button */}
      {!disabled && !hideSaveButton && (
        <div className="flex justify-end">
          <Button onClick={onSave} className="gap-2 gradient-primary px-8 py-6 text-base">
            <Save className="h-5 w-5" />
            Save Personal Info
          </Button>
        </div>
      )}
    </div>
  );
};
