import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Loader2, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { employeeApi } from '@/services/employeeApi';
import { API_BASE_URL } from '@/config/api';

interface FileUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  value,
  onChange,
  accept = 'image/*,.pdf',
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload to backend and get URL
      const fileUrl = await employeeApi.uploadFile(file);
      onChange(fileUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Fallback to base64 if upload fails
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Check if value is a URL or base64
  const isUrl = value && (value.startsWith('http') || value.startsWith('/uploads'));
  const isBase64 = value && value.startsWith('data:');
  const isImage = (isBase64 && value.startsWith('data:image')) || 
                  (isUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(value));
  const isPdf = (isBase64 && value.startsWith('data:application/pdf')) ||
                (isUrl && /\.pdf$/i.test(value));

  // Get display URL
  const displayUrl = isUrl && !value.startsWith('http') ? `${API_BASE_URL}${value}` : value;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      {isUploading ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary bg-primary/5 py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-primary">Uploading...</span>
        </div>
      ) : value ? (
        <div className="relative rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex items-center gap-3">
            {isImage ? (
              <img
                src={displayUrl}
                alt={label}
                className="h-16 w-16 rounded-md object-cover"
              />
            ) : isPdf ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">File uploaded</p>
              <p className="text-xs text-muted-foreground">
                {isUrl ? 'Stored on server' : 'Click remove to change'}
              </p>
            </div>
            <div className="flex gap-1">
              {isUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(displayUrl, '_blank')}
                  className="text-primary hover:bg-primary/10"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="w-full justify-center gap-2 border-dashed py-6 hover:border-primary hover:bg-primary/5"
        >
          <Upload className="h-5 w-5" />
          <span>Upload {label}</span>
        </Button>
      )}
    </div>
  );
};
