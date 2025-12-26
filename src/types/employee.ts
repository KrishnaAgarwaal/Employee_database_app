export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  address: string;
  fatherName: string;
  motherName: string;
  parentAddress: string;
  parentMobileNumber: string;
  hometown: string;
  salary: string;
  joiningDate: string;
  aadhaarNumber: string;
  aadhaarImage: string;
  panCard: string;
  panCardImage: string;
  ayushmanCard: string;
  ayushmanCardImage: string;
  drivingLicence: string;
  drivingLicenceImage: string;
  policeVerification: string;
  policeVerificationImage: string;
  notes: string;
  profilePhoto: string;
}

export interface BankDetails {
  bankName: string;
  bankAddress: string;
  ifscCode: string;
  accountNumber: string;
}

export interface EducationDetails {
  degree: string;
  allQualifications: string; // Comma-separated: "10th, 12th, BSc, MSc"
  tenthMarksheet: string;
  twelfthMarksheet: string;
}

export interface Employee {
  id: string;
  username?: string; // Used to identify employee's form across sessions
  personalInfo: PersonalInfo;
  bankDetails: BankDetails;
  educationDetails: EducationDetails;
  isCompleted: boolean;
  isFinalized: boolean;
  leaveDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const initialPersonalInfo: PersonalInfo = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  contactNumber: '',
  address: '',
  fatherName: '',
  motherName: '',
  parentAddress: '',
  parentMobileNumber: '',
  hometown: '',
  salary: '',
  joiningDate: '',
  aadhaarNumber: '',
  aadhaarImage: '',
  panCard: '',
  panCardImage: '',
  ayushmanCard: '',
  ayushmanCardImage: '',
  drivingLicence: '',
  drivingLicenceImage: '',
  policeVerification: '',
  policeVerificationImage: '',
  notes: '',
  profilePhoto: '',
};

export const initialBankDetails: BankDetails = {
  bankName: '',
  bankAddress: '',
  ifscCode: '',
  accountNumber: '',
};

export const initialEducationDetails: EducationDetails = {
  degree: '',
  allQualifications: '',
  tenthMarksheet: '',
  twelfthMarksheet: '',
};
