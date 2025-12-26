import React from 'react';
import { PersonalInfo, BankDetails, EducationDetails } from '@/types/employee';
import { FormField } from '@/components/ui/form-field';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Save, User, Building2, GraduationCap, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { formatIFSCCode } from '@/lib/utils';

interface DetailsMasterTabProps {
  personalInfo: PersonalInfo;
  bankDetails: BankDetails;
  educationDetails: EducationDetails;
  onPersonalInfoChange: (data: PersonalInfo) => void;
  onBankDetailsChange: (data: BankDetails) => void;
  onEducationDetailsChange: (data: EducationDetails) => void;
  onSave: () => void;
  disabled?: boolean;
}

export const DetailsMasterTab: React.FC<DetailsMasterTabProps> = ({
  personalInfo,
  bankDetails,
  educationDetails,
  onPersonalInfoChange,
  onBankDetailsChange,
  onEducationDetailsChange,
  onSave,
  disabled = false,
}) => {
  const [ifscError, setIfscError] = React.useState<string>('');

  const updatePersonalField = (field: keyof PersonalInfo, value: string) => {
    onPersonalInfoChange({ ...personalInfo, [field]: value });
  };

  const updateBankField = (field: keyof BankDetails, value: string) => {
    onBankDetailsChange({ ...bankDetails, [field]: value });
    if (field === 'ifscCode') {
      setIfscError('');
    }
  };

  const updateEducationField = (field: keyof EducationDetails, value: string) => {
    onEducationDetailsChange({ ...educationDetails, [field]: value });
  };

  const validateAndSave = () => {
    // Validate IFSC code: must be exactly 11 characters
    if (bankDetails.ifscCode.length !== 11) {
      setIfscError('IFSC Code must be exactly 11 characters (including letters and numbers)');
      toast.error('IFSC Code must be exactly 11 characters');
      return;
    }

    // All validations passed, save the data
    onSave();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalField('profilePhoto', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* PERSONAL INFORMATION SECTION */}
      <div className="rounded-xl bg-secondary/30 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
            <p className="text-sm text-muted-foreground">Your basic details</p>
          </div>
        </div>

        {/* Profile Photo Section */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            {personalInfo.profilePhoto ? (
              <img
                src={personalInfo.profilePhoto}
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
            {personalInfo.profilePhoto ? 'Click camera icon to change photo' : 'Upload your profile photo'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            label="Full Name"
            name="fullName"
            value={personalInfo.fullName}
            onChange={(v) => updatePersonalField('fullName', v)}
            placeholder="Enter full name"
            disabled={disabled}
            autoCapitalize
            required
          />
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(v) => updatePersonalField('dateOfBirth', v)}
            disabled={disabled}
            required
          />
          <FormField
            label="Gender"
            name="gender"
            type="select"
            value={personalInfo.gender}
            onChange={(v) => updatePersonalField('gender', v)}
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
            value={personalInfo.contactNumber}
            onChange={(v) => updatePersonalField('contactNumber', v)}
            placeholder="Enter contact number"
            disabled={disabled}
            required
          />
          <div className="md:col-span-2">
            <FormField
              label="Address"
              name="address"
              type="textarea"
              value={personalInfo.address}
              onChange={(v) => updatePersonalField('address', v)}
              placeholder="Enter address"
              disabled={disabled}
              autoCapitalize
              required
            />
          </div>
          <FormField
            label="Father's Name"
            name="fatherName"
            value={personalInfo.fatherName}
            onChange={(v) => updatePersonalField('fatherName', v)}
            placeholder="Enter father's name"
            disabled={disabled}
            autoCapitalize
          />
          <FormField
            label="Mother's Name"
            name="motherName"
            value={personalInfo.motherName}
            onChange={(v) => updatePersonalField('motherName', v)}
            placeholder="Enter mother's name"
            disabled={disabled}
            autoCapitalize
          />
          <div className="md:col-span-2">
            <FormField
              label="Parent Address"
              name="parentAddress"
              type="textarea"
              value={personalInfo.parentAddress}
              onChange={(v) => updatePersonalField('parentAddress', v)}
              placeholder="Enter parent address"
              disabled={disabled}
              autoCapitalize
            />
          </div>
          <FormField
            label="Parent Mobile Number"
            name="parentMobileNumber"
            type="tel"
            value={personalInfo.parentMobileNumber}
            onChange={(v) => updatePersonalField('parentMobileNumber', v)}
            placeholder="Enter parent mobile number"
            disabled={disabled}
          />
          <FormField
            label="Hometown"
            name="hometown"
            value={personalInfo.hometown}
            onChange={(v) => updatePersonalField('hometown', v)}
            placeholder="Enter hometown"
            disabled={disabled}
            autoCapitalize
          />
          <FormField
            label="Salary"
            name="salary"
            type="number"
            value={personalInfo.salary}
            onChange={(v) => updatePersonalField('salary', v)}
            placeholder="Enter salary"
            disabled={disabled}
          />
          <FormField
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={personalInfo.joiningDate}
            onChange={(v) => updatePersonalField('joiningDate', v)}
            disabled={disabled}
          />
          <FormField
            label="Aadhaar Number"
            name="aadhaarNumber"
            value={personalInfo.aadhaarNumber}
            onChange={(v) => updatePersonalField('aadhaarNumber', v)}
            placeholder="Enter Aadhaar number"
            disabled={disabled}
          />
          <FormField
            label="PAN Card"
            name="panCard"
            value={personalInfo.panCard}
            onChange={(v) => updatePersonalField('panCard', v)}
            placeholder="Enter PAN card number"
            disabled={disabled}
            autoCapitalize
          />
          <FormField
            label="Ayushman Card"
            name="ayushmanCard"
            value={personalInfo.ayushmanCard}
            onChange={(v) => updatePersonalField('ayushmanCard', v)}
            placeholder="Enter Ayushman card number"
            disabled={disabled}
          />
          <FormField
            label="Driving Licence"
            name="drivingLicence"
            value={personalInfo.drivingLicence}
            onChange={(v) => updatePersonalField('drivingLicence', v)}
            placeholder="Enter driving licence number"
            disabled={disabled}
          />
          <FormField
            label="Police Verification"
            name="policeVerification"
            value={personalInfo.policeVerification}
            onChange={(v) => updatePersonalField('policeVerification', v)}
            placeholder="Enter police verification details"
            disabled={disabled}
          />
          <div className="md:col-span-2">
            <FormField
              label="Notes"
              name="notes"
              type="textarea"
              value={personalInfo.notes}
              onChange={(v) => updatePersonalField('notes', v)}
              placeholder="Enter any additional notes"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="mt-8 space-y-4">
          <h4 className="text-md font-semibold text-foreground">Documents</h4>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <FileUpload
                label="Aadhaar Card Image"
                value={personalInfo.aadhaarImage}
                onChange={(v) => updatePersonalField('aadhaarImage', v)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-4">
              <FileUpload
                label="PAN Card Image"
                value={personalInfo.panCardImage}
                onChange={(v) => updatePersonalField('panCardImage', v)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-4">
              <FileUpload
                label="Ayushman Card Image"
                value={personalInfo.ayushmanCardImage}
                onChange={(v) => updatePersonalField('ayushmanCardImage', v)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-4">
              <FileUpload
                label="Driving Licence Image"
                value={personalInfo.drivingLicenceImage}
                onChange={(v) => updatePersonalField('drivingLicenceImage', v)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-4">
              <FileUpload
                label="Police Verification Document"
                value={personalInfo.policeVerificationImage}
                onChange={(v) => updatePersonalField('policeVerificationImage', v)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BANK DETAILS SECTION */}
      <div className="rounded-xl bg-secondary/30 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Bank Information</h3>
            <p className="text-sm text-muted-foreground">Your banking details</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            label="Bank Name"
            name="bankName"
            value={bankDetails.bankName}
            onChange={(v) => updateBankField('bankName', v)}
            placeholder="Enter bank name"
            disabled={disabled}
            autoCapitalize
            required
          />
          <div>
            <FormField
              label="IFSC Code"
              name="ifscCode"
              value={bankDetails.ifscCode}
              onChange={(v) => updateBankField('ifscCode', v)}
              placeholder="Enter IFSC code"
              disabled={disabled}
              maxLength={11}
              formatFn={formatIFSCCode}
              required
            />
            {ifscError && (
              <p className="mt-2 text-sm font-medium text-destructive">{ifscError}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Exactly 11 characters required (e.g., SBIN0001234)
            </p>
          </div>
          <FormField
            label="Account Number"
            name="accountNumber"
            value={bankDetails.accountNumber}
            onChange={(v) => updateBankField('accountNumber', v)}
            placeholder="Enter account number"
            disabled={disabled}
            required
          />
          <div className="md:col-span-2">
            <FormField
              label="Bank Address"
              name="bankAddress"
              type="textarea"
              value={bankDetails.bankAddress}
              onChange={(v) => updateBankField('bankAddress', v)}
              placeholder="Enter bank branch address"
              disabled={disabled}
              autoCapitalize
            />
          </div>
        </div>
      </div>

      {/* EDUCATION DETAILS SECTION */}
      <div className="rounded-xl bg-secondary/30 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Education Information</h3>
            <p className="text-sm text-muted-foreground">Your educational qualifications</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            label="All Qualifications"
            name="allQualifications"
            type="textarea"
            value={educationDetails.allQualifications}
            onChange={(v) => updateEducationField('allQualifications', v)}
            placeholder="Enter qualifications (comma-separated: 10th, 12th, BSc, MSc)"
            disabled={disabled}
            autoCapitalize
          />
        </div>

        {/* Education Document Upload Section */}
        <div className="mt-6 space-y-4">
          <h4 className="text-md font-semibold text-foreground">Certificates</h4>
          <div className="grid gap-6 md:grid-cols-2">
            <FileUpload
              label="10th Marksheet"
              value={educationDetails.tenthMarksheet}
              onChange={(v) => updateEducationField('tenthMarksheet', v)}
              disabled={disabled}
            />
            <FileUpload
              label="12th Marksheet"
              value={educationDetails.twelfthMarksheet}
              onChange={(v) => updateEducationField('twelfthMarksheet', v)}
              disabled={disabled}
            />
          </div>
          <FileUpload
            label="Degree Certificate (PDF/Image)"
            value={educationDetails.degree}
            onChange={(v) => updateEducationField('degree', v)}
            disabled={disabled}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      {/* Save Button */}
      {!disabled && (
        <div className="flex justify-end">
          <Button onClick={validateAndSave} className="gap-2 gradient-primary px-8 py-6 text-base">
            <Save className="h-5 w-5" />
            Save All Details
          </Button>
        </div>
      )}
    </div>
  );
};
