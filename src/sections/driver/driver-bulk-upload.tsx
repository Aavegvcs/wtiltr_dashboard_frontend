// import * as XLSX from 'xlsx';
// import { useState } from 'react';
// import {
//   Modal,
//   Box,
//   Typography,
//   Button,
//   LinearProgress,
//   Table,
//   TableBody,
//   TableRow,
//   TableCell,
//   IconButton,
//   Paper,
//   Stack,
//   TableHead,
//   TableContainer,
// } from '@mui/material';

// import UploadFileIcon from '@mui/icons-material/UploadFile';
// import CloseIcon from '@mui/icons-material/Close';

// import axiosInstance from 'src/config-global';
// import toast from 'react-hot-toast';
// import { Scrollbar } from 'src/components/scrollbar';

// const DriverBulkUploadModal = ({ open, onClose, refreshData }: any) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [failedRecords, setFailedRecords] = useState<
//     { index: number; mobileNumber: string; reason: string }[]
//   >([]);

//   // ------------------- DOWNLOAD SAMPLE --------------------
//   const handleDownloadSample = () => {
//     const headers = [
//       'Name',
//       'Mobile Number',
//       'PAN Number',
//       'Cancel Cheque URL',
//       'IsActive',
//     ];

//     const sampleRows = [
//       ['Rohit Sharma', '9876543210', 'ABCDE1234F', 'https://sample.com/cheque.jpg', 'true'],
//     ];

//     const csvContent = [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'driver_sample_template.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // ------------------- DOWNLOAD FAILED RECORDS --------------------
//   const handleDownloadFailed = () => {
//     if (!failedRecords.length) return;

//     const csvRows = [
//       ['Index', 'Mobile Number', 'Reason'].join(','),
//       ...failedRecords.map((rec) => [rec.index, rec.mobileNumber, rec.reason].join(',')),
//     ];

//     const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'failed_driver_records.csv');
//     link.click();
//   };

//   // ------------------- FILE CHANGE --------------------
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) setFile(e.target.files[0]);
//   };

//   // ------------------- UPLOAD --------------------
//   const handleUpload = async () => {
//     if (!file) {
//       toast.error('Please select a file');
//       return;
//     }

//     setLoading(true);
//     setProgress(0);

//     const buffer = await file.arrayBuffer();
//     const workbook = XLSX.read(buffer);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

//     const batchSize = 50;
//     const failed: any[] = [];

//     for (let i = 0; i < jsonData.length; i += batchSize) {
//       const batch = jsonData.slice(i, i + batchSize);

//       try {
//         await axiosInstance.post('/driver/bulkUpload', {
//           data: batch,
//           startIndex: i + 1,
//         });
//       } catch (err) {
//         failed.push({
//           index: i + 1,
//           mobileNumber: batch[0]?.MobileNumber,
//           reason: 'Server Error',
//         });
//       }

//       setProgress(Math.round(((i + batchSize) / jsonData.length) * 100));
//     }

//     setFailedRecords(failed);
//     setLoading(false);

//     if (failed.length === 0) {
//       toast.success('Bulk upload successful!');
//       refreshData();
//       onClose();
//     } else {
//       toast.error('Some records failed. Download error report.');
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           p: 3,
//           bgcolor: 'white',
//           borderRadius: 2,
//           maxWidth: 700,
//           width: '90%',
//           mx: 'auto',
//           mt: 5,
//           boxShadow: 3,
//           position: 'relative',
//           maxHeight: '90vh',
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         {/* Close Button */}
//         <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
//           <CloseIcon />
//         </IconButton>

//         {/* Heading */}
//         <Typography variant="h6" textAlign="center" fontWeight="bold" mb={2}>
//           Driver Bulk Upload
//         </Typography>

//         {/* File Upload Box */}
//         <Paper
//           variant="outlined"
//           sx={{
//             p: 2,
//             borderStyle: 'dashed',
//             textAlign: 'center',
//             cursor: 'pointer',
//             '&:hover': { bgcolor: '#f9f9f9' },
//           }}
//           onClick={() => document.getElementById('fileInputDriver')?.click()}
//         >
//           <UploadFileIcon sx={{ fontSize: 35, color: '#1976d2' }} />
//           <Typography mt={1}>
//             {file ? file.name : 'Click or drag CSV/XLSX file to upload'}
//           </Typography>

//           <input
//             id="fileInputDriver"
//             type="file"
//             accept=".csv,.xlsx,.xls"
//             hidden
//             onChange={handleFileChange}
//           />
//         </Paper>

//         {/* Buttons */}
//         <Stack direction="row" spacing={2} mt={2}>
//           <Button variant="outlined" fullWidth onClick={handleDownloadSample}>
//             Download Sample
//           </Button>

//           <Button variant="contained" fullWidth disabled={!file || loading} onClick={handleUpload}>
//             {loading ? 'Uploading...' : 'Upload'}
//           </Button>
//         </Stack>

//         {/* Progress Bar */}
//         {loading && (
//           <>
//             <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
//             <Typography textAlign="center">{progress}% completed</Typography>
//           </>
//         )}

//         {/* Failed Records Table */}
//         {failedRecords.length > 0 && (
//           <Box mt={3} flex={1}>
//             <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
//               <Typography fontWeight="bold">Failed Records</Typography>

//               <Button variant="contained" size="small" onClick={handleDownloadFailed}>
//                 Download CSV
//               </Button>
//             </Stack>

//             <Scrollbar sx={{ maxHeight: 180 }}>
//               <TableContainer>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Index</TableCell>
//                       <TableCell>Mobile Number</TableCell>
//                       <TableCell>Reason</TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {failedRecords.map((row, idx) => (
//                       <TableRow key={idx}>
//                         <TableCell>{row.index}</TableCell>
//                         <TableCell>{row.mobileNumber}</TableCell>
//                         <TableCell>{row.reason}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Scrollbar>
//           </Box>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// export default DriverBulkUploadModal;
import * as XLSX from 'xlsx';
import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Paper,
  Stack,
  TableHead,
} from '@mui/material';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';

import axiosInstance from 'src/config-global';
import toast from 'react-hot-toast';
import { Scrollbar } from 'src/components/scrollbar';

const DriverBulkUploadModal = ({ open, onClose, refreshData }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failedRecords, setFailedRecords] = useState<
    { index: number; name: string; reason: string }[]
  >([]);

  // ------------------- DOWNLOAD SAMPLE --------------------
  const handleDownloadSample = () => {
    const headers = ['name', 'mobileNumber', 'panNumber','isActive'];

    const sampleRow = [
      'Rohit Sharma',
      '9800112255',
      'ABCDE1234F',
      'true'
      
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
    const wb = XLSX.utils.book_new();

    ws['!cols'] = headers.map(() => ({ wch: 20 }));
    XLSX.utils.book_append_sheet(wb, ws, 'sample_driver_template');

    XLSX.writeFile(wb, 'driver_bulk_upload_template.xlsx');
  };

  // ------------------- DOWNLOAD FAILED RECORDS --------------------
  const handleDownloadFailed = () => {
    if (!failedRecords.length) return;

    const headers = ['Index', 'Mobile Number', 'Reason'];
    const rows = failedRecords.map((r) => [r.index, r.name, r.reason]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();

    ws['!cols'] = [{ wch: 10 }, { wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'FailedRecords');

    XLSX.writeFile(wb, 'driver_failed_records.xlsx');
  };

  // ------------------- FILE CHANGE --------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  // ------------------- UPLOAD --------------------
  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file');

    setLoading(true);
    setProgress(0);
    setFailedRecords([]);

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

    const batchSize = 50;
    let failed: any[] = [];
    let statusFlag = null;
    let statusMessage = null;

    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize);

      try {
        const response = await axiosInstance.post('/driver/bulkUpload', {
          data: batch,
          startIndex: i + 1,
        });

        const res = response.data.data;

        statusFlag = res?.status;
        statusMessage = res?.message;

        const result = res.result;

        if (result.failed && result.failed.length > 0) {
          failed = [...failed, ...result.failed];
        }
      } catch (err) {
        failed.push({
          index: i + 1,
          name: batch[0]?.mobileNumber || 'Unknown',
          reason: 'Server Error',
        });
      }

      setProgress(Math.round(((i + batchSize) / jsonData.length) * 100));
    }

    setFailedRecords(failed);
    setLoading(false);

    // SUCCESS CASE
    if (failed.length === 0) {
      toast.success('Driver bulk upload successful!');
      refreshData();
      onClose();
    }
    // PARTIAL SUCCESS
    else if (statusFlag) {
      toast.success(statusMessage || 'Some records failed');
    }
    // COMPLETE FAILURE
    else {
      toast.error(statusMessage || 'Upload failed');
    }
  };

  // ------------------- UI --------------------
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          bgcolor: 'white',
          borderRadius: 2,
          maxWidth: 700,
          width: '90%',
          mx: 'auto',
          mt: 5,
          boxShadow: 3,
          position: 'relative',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close Button */}
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" textAlign="center" fontWeight="bold" mb={2}>
          Driver Bulk Upload
        </Typography>

        {/* Upload Box */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderStyle: 'dashed',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('driverFile')?.click()}
        >
          <UploadFileIcon sx={{ fontSize: 35, color: '#1976d2' }} />
          <Typography mt={1}>{file ? file.name : 'Click or upload Excel / CSV file'}</Typography>

          <input
            id="driverFile"
            type="file"
            accept=".csv,.xlsx,.xls"
            hidden
            onChange={handleFileChange}
          />
        </Paper>

        {/* Buttons */}
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" fullWidth onClick={handleDownloadSample}>
            Download Template
          </Button>

          <Button variant="contained" fullWidth disabled={!file || loading} onClick={handleUpload}>
            Upload
          </Button>
        </Stack>

        {/* Progress Bar */}
        {loading && (
          <>
            <LinearProgress sx={{ mt: 2 }} value={progress} />
            <Typography textAlign="center">{progress}% completed</Typography>
          </>
        )}

        {/* Failed Records */}
        {failedRecords.length > 0 && (
          <Box mt={3} flex={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontWeight="bold" color="error">
                Failed Records
              </Typography>

              <Button variant="contained" size="small" onClick={handleDownloadFailed}>
                Download CSV
              </Button>
            </Stack>

            <Scrollbar sx={{ maxHeight: 200 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Mobile Number</TableCell>
                    <TableCell>Reason</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {failedRecords.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.index}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default DriverBulkUploadModal;
