import React, { useState } from 'react';
import { BankDetails } from '@/types/employee';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Save, Building2 } from 'lucide-react';
import { formatIFSCCode } from '@/lib/utils';
import { toast } from 'sonner';

interface BankDetailsTabProps {
  data: BankDetails;
  onChange: (data: BankDetails) => void;
  onSave: () => void;
  disabled?: boolean;
  hideSaveButton?: boolean;
}

export const BankDetailsTab: React.FC<BankDetailsTabProps> = ({
  data,
  onChange,
  onSave,
  disabled = false,
  hideSaveButton = false,
}) => {
  const [ifscError, setIfscError] = useState<string>('');

  const updateField = (field: keyof BankDetails, value: string) => {
    onChange({ ...data, [field]: value });
    // Clear error when user starts editing
    if (field === 'ifscCode') {
      setIfscError('');
    }
  };

  const validateAndSave = () => {
    // Validate IFSC code: must be exactly 11 characters
    if (data.ifscCode.length !== 11) {
      setIfscError('IFSC Code must be exactly 11 characters (including letters and numbers)');
      toast.error('IFSC Code must be exactly 11 characters');
      return;
    }

    // All validations passed, save the data
    onSave();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 rounded-xl bg-secondary/30 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Bank Account Information</h3>
          <p className="text-sm text-muted-foreground">
            Provide your banking details for salary deposits
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          label="Bank Name"
          name="bankName"
          value={data.bankName}
          onChange={(v) => updateField('bankName', v)}
          placeholder="Enter bank name"
          disabled={disabled}
          autoCapitalize
          required
        />
        <div>
          <FormField
            label="IFSC Code"
            name="ifscCode"
            value={data.ifscCode}
            onChange={(v) => updateField('ifscCode', v)}
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
          value={data.accountNumber}
          onChange={(v) => updateField('accountNumber', v)}
          placeholder="Enter account number"
          disabled={disabled}
          required
        />
        <div className="md:col-span-2">
          <FormField
            label="Bank Address"
            name="bankAddress"
            type="textarea"
            value={data.bankAddress}
            onChange={(v) => updateField('bankAddress', v)}
            placeholder="Enter bank branch address"
            disabled={disabled}
            autoCapitalize
          />
        </div>
      </div>

      {/* Save Button */}
      {!disabled && !hideSaveButton && (
        <div className="flex justify-end">
          <Button onClick={validateAndSave} className="gap-2 gradient-primary px-8 py-6 text-base">
            <Save className="h-5 w-5" />
            Save Bank Details
          </Button>
        </div>
      )}
    </div>
  );
};
