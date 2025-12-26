import React from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { capitalizeFirstLetter } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'date' | 'tel' | 'number' | 'email' | 'textarea' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  required?: boolean;
  autoCapitalize?: boolean;
  maxLength?: number;
  formatFn?: (value: string) => string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  options = [],
  disabled = false,
  required = false,
  autoCapitalize = false,
  maxLength,
  formatFn,
}) => {
  const baseInputClass = "bg-card border-border focus:border-primary focus:ring-primary/20";

  const handleChange = (inputValue: string) => {
    // Apply maxLength if specified
    let finalValue = maxLength ? inputValue.slice(0, maxLength) : inputValue;
    
    // Apply format function if specified
    if (formatFn) {
      finalValue = formatFn(finalValue);
    } else if (autoCapitalize) {
      finalValue = capitalizeFirstLetter(finalValue);
    }
    
    onChange(finalValue);
  };

  if (type === 'textarea') {
    return (
      <div className="space-y-2">
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`min-h-[100px] resize-none ${baseInputClass}`}
        />
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="space-y-2">
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className={baseInputClass}>
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={baseInputClass}
      />
    </div>
  );
};
