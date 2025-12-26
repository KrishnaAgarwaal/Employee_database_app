import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { Employee } from '@/types/employee';

export const generateEmployeePDF = async (employee: Employee): Promise<Blob> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  const addNewPageIfNeeded = (requiredHeight: number = 10) => {
    if (yPos + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }
  };

  const addSection = (title: string, shortenLine: boolean = false) => {
    addNewPageIfNeeded(12);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(33, 97, 201);
    pdf.text(title, margin, yPos);
    yPos += 2;
    pdf.setDrawColor(33, 97, 201);
    if (shortenLine) {
      const titleWidth = pdf.getTextWidth(title);
      pdf.line(margin, yPos, margin + titleWidth, yPos);
    } else {
      pdf.line(margin, yPos, pageWidth - margin, yPos);
    }
    yPos += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
  };

  const addField = (label: string, value: string, required: boolean = false) => {
    if (!required && !value) return;
    addNewPageIfNeeded(8);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}:`, margin, yPos);
    pdf.setFont('helvetica', 'normal');
    const textWidth = pdf.getTextWidth(`${label}: `);
    const displayValue = value || (required ? '_______________' : '');
    if (displayValue) {
      const maxWidth = pageWidth - margin * 2 - textWidth - 5;
      const splitText = pdf.splitTextToSize(displayValue, maxWidth);
      if (Array.isArray(splitText) && splitText.length > 0) {
        splitText.forEach((line, index) => {
          pdf.text(line, margin + textWidth + 2, yPos + (index * 4));
        });
        yPos += splitText.length * 4 + 2;
      } else {
        pdf.text(displayValue, margin + textWidth + 2, yPos);
        yPos += 6;
      }
    } else {
      yPos += 6;
    }
  };

  const addImage = async (label: string, dataUrl: string) => {
    if (!dataUrl) return;
    
    try {
      if (dataUrl.startsWith('data:image') || dataUrl.startsWith('http')) {
        // Add a new page for full-size image
        pdf.addPage();
        yPos = margin;
        
        // Add label at top
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(33, 97, 201);
        pdf.text(label, pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        
        // Calculate image dimensions to fit page while maintaining aspect ratio
        const maxWidth = pageWidth - (margin * 2);
        const maxHeight = pageHeight - yPos - margin;
        
        // Add image at full page size
        pdf.addImage(dataUrl, 'JPEG', margin, yPos, maxWidth, maxHeight);
        
        // Reset font for next content
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
      } else {
        // For non-image files, show as text
        addNewPageIfNeeded(8);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${label}:`, margin, yPos);
        yPos += 4;
        pdf.setFont('helvetica', 'normal');
        pdf.text('Document uploaded (see original file)', margin, yPos);
        yPos += 6;
      }
    } catch (error) {
      console.error('Error adding image:', error);
      yPos += 4;
    }
  };

  // Header
  pdf.setFillColor(33, 97, 201);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Employee Profile', pageWidth / 2, 15, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`ID: ${employee.id}`, pageWidth / 2, 25, { align: 'center' });
  pdf.text(employee.personalInfo.fullName || 'Employee', pageWidth / 2, 33, { align: 'center' });
  
  yPos = 50;

  if (employee.personalInfo.profilePhoto) {
    try {
      pdf.addImage(employee.personalInfo.profilePhoto, 'JPEG', pageWidth - margin - 35, 45, 35, 35);
    } catch (error) {
      console.error('Error adding profile photo:', error);
    }
  }

  addSection('Personal Information', true);
  addField('Employee ID', employee.id, true);
  addField('Full Name', employee.personalInfo.fullName, true);
  addField('Date of Birth', employee.personalInfo.dateOfBirth, true);
  addField('Gender', employee.personalInfo.gender, true);
  addField('Contact Number', employee.personalInfo.contactNumber, true);
  addField('Address', employee.personalInfo.address, true);
  addField("Father's Name", employee.personalInfo.fatherName, true);
  addField("Mother's Name", employee.personalInfo.motherName, true);
  addField("Parent's Address", employee.personalInfo.parentAddress);
  addField("Parent's Mobile", employee.personalInfo.parentMobileNumber);
  addField('Hometown', employee.personalInfo.hometown);
  addField('Joining Date', employee.personalInfo.joiningDate, true);
  addField('Salary', employee.personalInfo.salary ? `Rs. ${employee.personalInfo.salary}` : '', true);
  addField('Notes', employee.personalInfo.notes);

  yPos += 1;
  addSection('Document Details');
  addField('Aadhaar Number', employee.personalInfo.aadhaarNumber, true);
  addField('PAN Card', employee.personalInfo.panCard, true);
  addField('Ayushman Card', employee.personalInfo.ayushmanCard);
  addField('Driving Licence', employee.personalInfo.drivingLicence);
  addField('Police Verification', employee.personalInfo.policeVerification);

  yPos += 1;
  addSection('Bank Details');
  addField('Bank Name', employee.bankDetails.bankName, true);
  addField('Bank Address', employee.bankDetails.bankAddress);
  addField('IFSC Code', employee.bankDetails.ifscCode, true);
  addField('Account Number', employee.bankDetails.accountNumber, true);

  yPos += 1;
  addSection('Education Details');
  addField('All Qualifications', employee.educationDetails.allQualifications, true);

  yPos += 1;
  addSection('Uploaded Documents');
  
  // Only show images, skip PDFs as they will be merged later
  const imageFields = [
    { label: 'Aadhaar Card', data: employee.personalInfo.aadhaarImage },
    { label: 'PAN Card', data: employee.personalInfo.panCardImage },
    { label: 'Ayushman Card', data: employee.personalInfo.ayushmanCardImage },
    { label: 'Driving Licence', data: employee.personalInfo.drivingLicenceImage },
    { label: 'Police Verification', data: employee.personalInfo.policeVerificationImage },
    { label: '10th Marksheet', data: employee.educationDetails.tenthMarksheet },
    { label: '12th Marksheet', data: employee.educationDetails.twelfthMarksheet }
  ];
  
  for (const field of imageFields) {
    // Only show if it's an image (not PDF) and has data
    if (field.data && (field.data.startsWith('data:image') || (field.data.startsWith('http') && !field.data.endsWith('.pdf')))) {
      await addImage(field.label, field.data);
    }
  }

  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages} | Developed by Krishna Agarwaal`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Get the main PDF bytes
  const mainPdfBytes = pdf.output('arraybuffer');
  
  // Collect all PDF documents to merge
  const pdfDocuments = [];
  
  // Check for PDF documents in uploaded files
  const pdfFields = [
    { label: 'Degree Certificate', data: employee.educationDetails.degree },
    { label: '10th Marksheet', data: employee.educationDetails.tenthMarksheet },
    { label: '12th Marksheet', data: employee.educationDetails.twelfthMarksheet },
    { label: 'Aadhaar Card', data: employee.personalInfo.aadhaarImage },
    { label: 'PAN Card', data: employee.personalInfo.panCardImage },
    { label: 'Ayushman Card', data: employee.personalInfo.ayushmanCardImage },
    { label: 'Driving Licence', data: employee.personalInfo.drivingLicenceImage },
    { label: 'Police Verification', data: employee.personalInfo.policeVerificationImage }
  ];

  for (const field of pdfFields) {
    if (!field.data) continue;
    
    try {
      let pdfBytes;
      
      if (field.data.startsWith('data:application/pdf')) {
        // Handle base64 data URLs
        const base64Data = field.data.split(',')[1];
        pdfBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      } else if (field.data.endsWith('.pdf')) {
        // Handle URL-based PDFs
        const response = await fetch(field.data);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          pdfBytes = new Uint8Array(arrayBuffer);
        }
      }
      
      if (pdfBytes) {
        pdfDocuments.push({ label: field.label, bytes: pdfBytes });
      }
    } catch (error) {
      console.error(`Error processing PDF ${field.label}:`, error);
    }
  }

  // If no PDFs to merge, return the main PDF
  if (pdfDocuments.length === 0) {
    return new Blob([mainPdfBytes], { type: 'application/pdf' });
  }

  // Merge PDFs using pdf-lib
  try {
    const mergedPdf = await PDFDocument.create();
    
    // Add main PDF pages
    const mainPdf = await PDFDocument.load(mainPdfBytes);
    const mainPages = await mergedPdf.copyPages(mainPdf, mainPdf.getPageIndices());
    mainPages.forEach((page) => mergedPdf.addPage(page));

    // Add uploaded PDF pages
    for (const doc of pdfDocuments) {
      try {
        const uploadedPdf = await PDFDocument.load(doc.bytes);
        const pages = await mergedPdf.copyPages(uploadedPdf, uploadedPdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      } catch (error) {
        console.error(`Error merging PDF ${doc.label}:`, error);
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    return new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    return new Blob([mainPdfBytes], { type: 'application/pdf' });
  }
};

export const downloadEmployeePDF = async (employee: Employee): Promise<void> => {
  const blob = await generateEmployeePDF(employee);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${employee.id}_${employee.personalInfo.fullName || 'employee'}_profile.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};