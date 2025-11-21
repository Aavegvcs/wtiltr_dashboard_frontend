


// import React from 'react';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// // Dummy data based on the provided PDF content
// const dummyQuotationData = {
//   ticketNumber: 'AI-20250801-0001',
//   insuranceType: 'Health',
//   proposer: {
//     name: 'Saroj',
//     mobile: '7070887377',
//     email: 'aa384aa@gmail.com',
//     pin: 'N/A',
//     dob: '01-08-2009',
//     gender: 'Female',
//     height: '150.00 cm',
//     weight: '50.00 kg',
//     ped: 'None',
//   },
//   dependents: [
//     { name: 'Rahul', dob: '01-08-2025', gender: 'Male', height: '140.00 cm', weight: '40.00 kg' },
//     { name: 'Sahu Kumar', dob: '01-08-2016', gender: 'Male', height: '90.00 cm', weight: '25.00 kg' },
//   ],
//   contact: { name: 'null', phone: '1111111111' },
//   companies: [
//     { company: 'ICICI Lombard', product: 'Icici Health', coverage: '2000000.00', premium: '3000000.00' },
//     { company: 'IndusInd (Reliance)', product: 'Insuslnd Health', coverage: '2000000.00', premium: '350000.00' },
//     { company: 'Manipal Cigna', product: 'Manipal Health', coverage: '2000000.00', premium: '500000.00' },
//   ],
//   basicFeatures: {
//     headers: ['', 'ICICI Lombard', 'IndusInd (Reliance)', 'Manipal Cigna'],
//     rows: [
//       ['Single Standard A/c Room', '✅', '❌', '✅'],
//       ['ICU Benefit', '✓', '×', '×'],
//       ['AYUSH', '✓', '×', '×'],
//       ['Day Care Procedure', '×', '✓', '×'],
//       ['Pre Hospitalization', '×', '✓', '×'],
//       ['Unlimited Sum Insured', '×', '×', '×'],
//     ],
//   },
//   addonFeatures: {
//     headers: ['', 'ICICI Lombard', 'IndusInd (Reliance)', 'Manipal Cigna'],
//     rows: [
//       ['Any Room Option', '×', '×', '×'],
//       ['Coverage', '✓', '×', '✓'],
//       ['Infinite Cover', '×', '✓', '×'],
//       ['International Cover', '×', '×', '✓'],
//       ['Consumable Cover', '×', '×', '✓'],
//       ['Maternity Cover', '×', '×', '×'],
//     ],
//   },
//   additionalDetails: {
//     headers: ['', 'ICICI Lombard', 'IndusInd (Reliance)', 'Manipal Cigna'],
//     rows: [
//       ['Features', 'Cashless hospitals, No claim bonus, Pre/post hospitalization cover', 'Zero depreciation, Cashless garages', 'High sum assured, Critical illness cover'],
//       ['Benefits', 'Peace of mind, Emergency support, Health protection', 'Vehicle protection, Legal coverage', 'Life coverage, Tax savings'],
//       ['Advantages', 'Family floater, Tax benefits, Large network of hospitals', 'Quick claim process, Roadside support', 'Low cost, Financial support for family'],
//       ['Remarks', 'no', 'yes', 'no'],
//     ],
//   },
//   validity: '2025-09-29',
// };

// const PdfQuotationGenerator: React.FC = () => {
//   const generatePDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;
//     const margin = 10;
//     let yPos = margin;

//     // Header with improved styling
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(15);
//     doc.setTextColor(0, 51, 102); // Dark blue
//     doc.text('Acumen', margin, yPos);
//     yPos += 5;

//     doc.setFontSize(12);
//     doc.setTextColor(0, 0, 0);
//     doc.text(`Ticket Number: ${dummyQuotationData.ticketNumber}`, margin, yPos);
//     yPos += 6;
//     doc.text(`Insurance Type: ${dummyQuotationData.insuranceType}`, margin, yPos);
//     yPos += 15;

//     // Greeting
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(12);
//     doc.text(`Dear ${dummyQuotationData.proposer.name},`, margin, yPos);
//     yPos += 8;
//     doc.text('Thank you for choosing Acumen. Below is your personalized insurance quotation:', margin, yPos);
//     yPos += 15;

//     // Proposer Details
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(14);
//     doc.text('Proposer Details', margin, yPos);
//     yPos += 10;

//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(11);
//     const proposerFields = [
//       `Name: ${dummyQuotationData.proposer.name}`,
//       `Mobile No: ${dummyQuotationData.proposer.mobile}`,
//       `Email ID: ${dummyQuotationData.proposer.email}`,
//       `PIN Code: ${dummyQuotationData.proposer.pin}`,
//       `DOB: ${dummyQuotationData.proposer.dob}`,
//       `Gender: ${dummyQuotationData.proposer.gender}`,
//       `Height: ${dummyQuotationData.proposer.height}`,
//       `Weight: ${dummyQuotationData.proposer.weight}`,
//       `PED Declared: ${dummyQuotationData.proposer.ped}`,
//     ];
//     proposerFields.forEach((field) => {
//       doc.text(field, margin, yPos);
//       yPos += 6;
//     });
//     yPos += 10;

//     // Dependent Details Table
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(14);
//     doc.text('Dependent Details', margin, yPos);
//     yPos += 10;

//     autoTable(doc, {
//       startY: yPos,
//       head: [['Name', 'DOB', 'Gender', 'Height', 'Weight']],
//       body: dummyQuotationData.dependents.map((dep) => [dep.name, dep.dob, dep.gender, dep.height, dep.weight]),
//       styles: { font: 'helvetica', fontSize: 10, cellPadding: 4, overflow: 'linebreak' },
//       headStyles: { fillColor: [0, 51, 102], textColor: 255 },
//       alternateRowStyles: { fillColor: [240, 248, 255] }, // Light blue alternate rows
//       margin: { left: margin, right: margin },
//     });
//     yPos = (doc as any).lastAutoTable.finalY + 10;

//     // Contact Message
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(11);
//     doc.text('We have customized product list suiting your requirements. Still if you feel the need for clarity, please contact', margin, yPos);
//     yPos += 6;
//     doc.text(`${dummyQuotationData.contact.name} at ${dummyQuotationData.contact.phone}`, margin, yPos);
//     yPos += 15;

//     // Company Details Table (Transposed for better readability)
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(14);
//     doc.text('Details', margin, yPos);
//     yPos += 10;

//     const companyDetailsBody = [
//       ['Company', ...dummyQuotationData.companies.map(c => c.company)],
//       ['Product', ...dummyQuotationData.companies.map(c => c.product)],
//       ['Coverage', ...dummyQuotationData.companies.map(c => c.coverage)],
//       ['Premium', ...dummyQuotationData.companies.map(c => c.premium)],
//     ];

//     autoTable(doc, {
//       startY: yPos,
//       body: companyDetailsBody,
//       styles: { font: 'helvetica', fontSize: 10, cellPadding: 4, overflow: 'linebreak' },
//       headStyles: { fillColor: [0, 51, 102], textColor: 255 },
//       alternateRowStyles: { fillColor: [240, 248, 255] },
//       margin: { left: margin, right: margin },
//     });
//     yPos = (doc as any).lastAutoTable.finalY + 15;

//     // Check if we need to add a new page
//     if (yPos > doc.internal.pageSize.height - 50) {
//       doc.addPage();
//       yPos = margin;
//     }

//     // Basic Features Table
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(14);
//     doc.text('Basic Features', margin, yPos);
//     yPos += 10;

//     autoTable(doc, {
//       startY: yPos,
//       head: [dummyQuotationData.basicFeatures.headers],
//       body: dummyQuotationData.basicFeatures.rows,
//       styles: { font: 'helvetica', fontSize: 10, cellPadding: 4, overflow: 'linebreak', halign: 'center' },
//       headStyles: { fillColor: [0, 51, 102], textColor: 255 },
//       alternateRowStyles: { fillColor: [240, 248, 255] },
//       columnStyles: { 0: { halign: 'left' } },
//       margin: { left: margin, right: margin },
//     });
//     yPos = (doc as any).lastAutoTable.finalY + 15;

//     if (yPos > doc.internal.pageSize.height - 50) {
//       doc.addPage();
//       yPos = margin;
//     }

//     // Add-on Features Table
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(14);
//     doc.text('Add-on Features', margin, yPos);
//     yPos += 10;

//     autoTable(doc, {
//       startY: yPos,
//       head: [dummyQuotationData.addonFeatures.headers],
//       body: dummyQuotationData.addonFeatures.rows,
//       styles: { font: 'helvetica', fontSize: 10, cellPadding: 4, overflow: 'linebreak', halign: 'center' },
//       headStyles: { fillColor: [0, 51, 102], textColor: 255 },
//       alternateRowStyles: { fillColor: [240, 248, 255] },
//       columnStyles: { 0: { halign: 'left' } },
//       margin: { left: margin, right: margin },
//     });
//     yPos = (doc as any).lastAutoTable.finalY + 15;

//     if (yPos > doc.internal.pageSize.height - 50) {
//       doc.addPage();
//       yPos = margin;
//     }

//     // Additional Details Table
//     autoTable(doc, {
//       startY: yPos,
//       head: [dummyQuotationData.additionalDetails.headers],
//       body: dummyQuotationData.additionalDetails.rows,
//       styles: { font: 'helvetica', fontSize: 10, cellPadding: 4, overflow: 'linebreak' },
//       headStyles: { fillColor: [0, 51, 102], textColor: 255 },
//       alternateRowStyles: { fillColor: [240, 248, 255] },
//       columnStyles: { 0: { halign: 'left' } },
//       margin: { left: margin, right: margin },
//     });
//     yPos = (doc as any).lastAutoTable.finalY + 15;

//     if (yPos > doc.internal.pageSize.height - 50) {
//       doc.addPage();
//       yPos = margin;
//     }

//     // Validity
//     doc.setFont('helvetica', 'italic');
//     doc.setFontSize(11);
//     doc.text(`The Above generated quote will be valid till: ${dummyQuotationData.validity}`, margin, yPos);
//     yPos += 20;

//     // Footer on every page
//     const pageCount = doc.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(10);
//       doc.setTextColor(150);
//       doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, doc.internal.pageSize.height - 10);
//       doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, doc.internal.pageSize.height - 10);
//     }

//     // Save PDF
//     doc.save('acumen-insurance-quotation.pdf');
//   };

//   // For the React component, display a preview table or button only
//   return (
//     <div style={{ padding: '20px', fontFamily: 'Helvetica, Arial, sans-serif' }}>
//       <h2 style={{ color: '#003366' }}>Acumen Insurance Quotation Generator</h2>
//       <p>This component generates a beautifully designed PDF quotation based on dummy data. Click below to download.</p>
//       <button
//         onClick={generatePDF}
//         style={{
//           padding: '12px 24px',
//           backgroundColor: '#003366',
//           color: 'white',
//           border: 'none',
//           borderRadius: '6px',
//           cursor: 'pointer',
//           fontSize: '16px',
//         }}
//       >
//         Download Quotation PDF
//       </button>
//     </div>
//   );
// };

// export default PdfQuotationGenerator;

import React from 'react';
import html2pdf from 'html2pdf.js';

// Dummy data based on the provided PDF content
const dummyQuotationData = {
  ticketNumber: 'AI-20250801-0001',
  insuranceType: 'Health',
  proposer: {
    name: 'Saroj',
    mobile: '7070887377',
    email: 'aa384aa@gmail.com',
    pin: 'N/A',
    dob: '01-08-2009',
    gender: 'Female',
    height: '150.00 cm',
    weight: '50.00 kg',
    ped: 'None',
  },
  dependents: [
    { name: 'Rahul', dob: '01-08-2025', gender: 'Male', height: '140.00 cm', weight: '40.00 kg' },
    { name: 'Sahu Kumar', dob: '01-08-2016', gender: 'Male', height: '90.00 cm', weight: '25.00 kg' },
  ],
  contact: { name: 'null', phone: '1111111111' },
  companies: [
    { company: 'ICICI Lombard', product: 'Icici Health', coverage: '2000000.00', premium: '3000000.00' },
    { company: 'Industrial (Reliance)', product: 'Industrial Health', coverage: '2000000.00', premium: '350000.00' },
    { company: 'Manipal Cigna', product: 'Manipal Health', coverage: '2000000.00', premium: '500000.00' },
  ],
  basicFeatures: {
    headers: ['Features', 'ICICI Lombard', 'Industrial (Reliance)', 'Manipal Cigna'],
    rows: [
      ['Single Standard A/c Room', '✅', '❌', '❌'],
      ['ICU Benefit', '✅', '❌', '❌'],
      ['AYUSH', '✅', '❌', '❌'],
      ['Day Care Procedure', '❌', '✅', '❌'],
      ['Pre Hospitalization', '❌', '✅', '❌'],
      ['Unlimited Sum Insured', '❌', '❌', '❌'],
    ],
  },
  addonFeatures: {
    headers: ['Add-on Features', 'ICICI Lombard', 'Industrial (Reliance)', 'Manipal Cigna'],
    rows: [
      ['Any Room Option', '❌', '❌', '❌'],
      ['Coverage', '✅', '❌', '✅'],
      ['Infinite Cover', '❌', '✅', '❌'],
      ['International Cover', '❌', '❌', '✅'],
      ['Consumable Cover', '❌', '❌', '✅'],
      ['Maternity Cover', '❌', '❌', '❌'],
    ],
  },
  additionalDetails: {
    headers: ['Details', 'ICICI Lombard', 'Industrial (Reliance)', 'Manipal Cigna'],
    rows: [
      ['Features', 'Cashless hospitals, No claim bonus, Pre/post hospitalization cover', 'Zero depreciation, Cashless garages', 'High sum assured, Critical illness cover'],
      ['Benefits', 'Peace of mind, Emergency support, Health protection', 'Vehicle protection, Legal coverage', 'Life coverage, Tax savings'],
      ['Advantages', 'Family floater, Tax benefits, Large network of hospitals', 'Quick claim process, Roadside support', 'Low cost, Financial support for family'],
      ['Remarks', 'no', 'yes', 'no'],
    ],
  },
  validity: '2025-09-29',
};

const PdfQuotationGenerator: React.FC = () => {
  const generatePDF = () => {
    const element = document.getElementById('quotation-content');
    
    if (!element) {
      console.error('Element not found');
      return;
    }

    const options = {
      margin: 10,
      filename: 'acumen-insurance-quotation.pdf',
      image: { 
        type: 'jpeg' as const, // Use const assertion for type safety
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm' as const, 
        format: 'a4' as const, 
        orientation: 'portrait' as const 
      }
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#003366', textAlign: 'center' }}>Acumen Insurance Quotation Generator</h2>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>
        Preview your quotation below and download as PDF.
      </p>
      
      <button
        onClick={generatePDF}
        style={{
          padding: '12px 24px',
          backgroundColor: '#003366',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          margin: '20px auto',
          display: 'block'
        }}
      >
        Download Quotation PDF
      </button>

      {/* PDF Content - This will be converted to PDF */}
      <div id="quotation-content" style={{ 
        padding: '20px', 
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        {/* Header */}
        <div style={{ borderBottom: '2px solid #003366', paddingBottom: '10px', marginBottom: '20px' }}>
          <h1 style={{ color: '#003366', margin: 0, fontSize: '24px' }}>Acumen</h1>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
            Ticket Number: <strong>{dummyQuotationData.ticketNumber}</strong>
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
            Insurance Type: <strong>{dummyQuotationData.insuranceType}</strong>
          </p>
        </div>

        {/* Greeting */}
        <div style={{ marginBottom: '25px' }}>
          <p>Dear <strong>{dummyQuotationData.proposer.name}</strong>,</p>
          <p>Thank you for choosing Acumen. Below is your personalized insurance quotation:</p>
        </div>

        {/* Proposer Details */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#003366', borderBottom: '1px solid #003366', paddingBottom: '5px' }}>
            Proposer Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '14px' }}>
            <div><strong>Name:</strong> {dummyQuotationData.proposer.name}</div>
            <div><strong>Mobile No:</strong> {dummyQuotationData.proposer.mobile}</div>
            <div><strong>Email ID:</strong> {dummyQuotationData.proposer.email}</div>
            <div><strong>PIN Code:</strong> {dummyQuotationData.proposer.pin}</div>
            <div><strong>DOB:</strong> {dummyQuotationData.proposer.dob}</div>
            <div><strong>Gender:</strong> {dummyQuotationData.proposer.gender}</div>
            <div><strong>Height:</strong> {dummyQuotationData.proposer.height}</div>
            <div><strong>Weight:</strong> {dummyQuotationData.proposer.weight}</div>
            <div><strong>PED Declared:</strong> {dummyQuotationData.proposer.ped}</div>
          </div>
        </div>

        {/* Dependent Details */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#003366', borderBottom: '1px solid #003366', paddingBottom: '5px' }}>
            Dependent Details
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#003366', color: 'white' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>DOB</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Gender</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Height</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Weight</th>
              </tr>
            </thead>
            <tbody>
              {dummyQuotationData.dependents.map((dependent, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{dependent.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{dependent.dob}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{dependent.gender}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{dependent.height}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{dependent.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contact Information */}
        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            We have customized product list suiting your requirements. Still if you feel the need for clarity, please contact{' '}
            <strong>{dummyQuotationData.contact.name}</strong> at <strong>{dummyQuotationData.contact.phone}</strong>
          </p>
        </div>

        {/* Company Details */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#003366', borderBottom: '1px solid #003366', paddingBottom: '5px' }}>
            Company Details
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#003366', color: 'white' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Company</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Product</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Coverage</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              {dummyQuotationData.companies.map((company, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{company.company}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{company.product}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{company.coverage}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{company.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Basic Features */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#003366', borderBottom: '1px solid #003366', paddingBottom: '5px' }}>
            Basic Features
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#003366', color: 'white' }}>
                {dummyQuotationData.basicFeatures.headers.map((header, index) => (
                  <th key={index} style={{ padding: '10px', border: '1px solid #ddd', textAlign: index === 0 ? 'left' : 'center' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dummyQuotationData.basicFeatures.rows.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      style={{ 
                        padding: '10px', 
                        border: '1px solid #ddd',
                        textAlign: cellIndex === 0 ? 'left' : 'center',
                        color: cell === '✅' ? 'green' : cell === '❌' ? 'red' : 'inherit',
                        fontWeight: cell === '✅' || cell === '❌' ? 'bold' : 'normal'
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add-on Features */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#003366', borderBottom: '1px solid #003366', paddingBottom: '5px' }}>
            Add-on Features
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#003366', color: 'white' }}>
                {dummyQuotationData.addonFeatures.headers.map((header, index) => (
                  <th key={index} style={{ padding: '10px', border: '1px solid #ddd', textAlign: index === 0 ? 'left' : 'center' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dummyQuotationData.addonFeatures.rows.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      style={{ 
                        padding: '10px', 
                        border: '1px solid #ddd',
                        textAlign: cellIndex === 0 ? 'left' : 'center',
                        color: cell === '✅' ? 'green' : cell === '❌' ? 'red' : 'inherit',
                        fontWeight: cell === '✅' || cell === '❌' ? 'bold' : 'normal'
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Details */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#003366', borderBottom: '1px solid #003366', paddingBottom: '5px' }}>
            Additional Details
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#003366', color: 'white' }}>
                {dummyQuotationData.additionalDetails.headers.map((header, index) => (
                  <th key={index} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dummyQuotationData.additionalDetails.rows.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Validity */}
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontStyle: 'italic', fontSize: '14px' }}>
            <strong>Validity:</strong> The above generated quote will be valid till: {dummyQuotationData.validity}
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '20px', 
          paddingTop: '10px', 
          borderTop: '1px solid #ddd',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          <p>Generated on: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PdfQuotationGenerator;