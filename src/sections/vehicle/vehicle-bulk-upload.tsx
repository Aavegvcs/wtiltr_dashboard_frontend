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

// const VehicleBulkUploadModal = ({ open, onClose, refreshData }: any) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [failedRecords, setFailedRecords] = useState<
//     { index: number; vehicleNumber: string; reason: string }[]
//   >([]);

//   // ------------------- DOWNLOAD SAMPLE --------------------
//   const handleDownloadSample = () => {
//     const headers = [
//       'Vehicle Number',
//       'Vehicle Name',
//       'Vehicle Model',
//       'IsActive',
//     ];

//     const sampleRows = [
//       ['MH12AB1234', 'Toyota Innova', '2021', 'true'],
//     ];

//     const csvContent = [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'vehicle_sample_template.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // ------------------- DOWNLOAD FAILED RECORDS --------------------
//   const handleDownloadFailed = () => {
//     if (!failedRecords.length) return;

//     const csvRows = [
//       ['Index', 'Vehicle Number', 'Reason'].join(','),
//       ...failedRecords.map((rec) => [rec.index, rec.vehicleNumber, rec.reason].join(',')),
//     ];

//     const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'failed_vehicle_records.csv');
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
//         await axiosInstance.post('vehicle/bulkUpload', {
//           data: batch,
//           startIndex: i + 1,
//         });
//       } catch (err) {
//         failed.push({
//           index: i + 1,
//           vehicleNumber: batch[0]?.VehicleNumber,
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
//           Vehicle Bulk Upload
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
//           onClick={() => document.getElementById('fileInputVehicle')?.click()}
//         >
//           <UploadFileIcon sx={{ fontSize: 35, color: '#1976d2' }} />
//           <Typography mt={1}>
//             {file ? file.name : 'Click or drag CSV/XLSX file to upload'}
//           </Typography>

//           <input
//             id="fileInputVehicle"
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
//                       <TableCell>Vehicle Number</TableCell>
//                       <TableCell>Reason</TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {failedRecords.map((row, idx) => (
//                       <TableRow key={idx}>
//                         <TableCell>{row.index}</TableCell>
//                         <TableCell>{row.vehicleNumber}</TableCell>
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

// export default VehicleBulkUploadModal;
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

const VehicleBulkUploadModal = ({ open, onClose, refreshData }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failedRecords, setFailedRecords] = useState<
    { index: number; name: string; reason: string }[]
  >([]);

  // ------------------- DOWNLOAD SAMPLE --------------------
  const handleDownloadSample = () => {
    const headers = ['vehicleNumber', 'vehicleName', 'vehicleModel', 'isActive'];

    const sampleRow = ['MH12AB1234', 'Toyota Innova', '2021', 'true'];

    const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
    const wb = XLSX.utils.book_new();

    ws['!cols'] = headers.map(() => ({ wch: 20 }));
    XLSX.utils.book_append_sheet(wb, ws, 'sample_vehicle_template');

    XLSX.writeFile(wb, 'vehicle_bulk_upload_template.xlsx');
  };

  // ------------------- DOWNLOAD FAILED RECORDS --------------------
  const handleDownloadFailed = () => {
    if (!failedRecords.length) return;

    const headers = ['Index', 'Vehicle Number', 'Reason'];
    const rows = failedRecords.map((rec) => [rec.index, rec.name, rec.reason]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();

    ws['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'FailedRecords');

    XLSX.writeFile(wb, 'vehicle_failed_records.xlsx');
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
    let statusMsg = null;
    let statusFlag = null;

    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize);

      try {
        const response = await axiosInstance.post('vehicle/bulkUpload', {
          data: batch,
          startIndex: i + 1,
        });

        const res = response.data.data;
        console.log('response data is after uplaod', res);
        statusMsg = res?.message;
        statusFlag = res?.status;
        const result = res.result;
         
        if (result.failed && result.failed.length > 0) {
            failed = [...failed, ...result.failed];
          }
       
      } catch (err) {
        failed.push({
          index: i + 1,
          name: batch?.[0]?.vehicleNumber ?? 'Unknown',
          reason: 'Server Error',
        });
      }

      setProgress(Math.round(((i + batchSize) / jsonData.length) * 100));
    }

    setFailedRecords(failed);
    setLoading(false);

    // SUCCESS CASE
    if (failed.length === 0) {
      toast.success('Vehicle bulk upload successful!');
      refreshData();
      onClose();
    }
    // PARTIAL SUCCESS
    else if (statusFlag) {
      toast.success(statusMsg || 'Some records failed');
    }
    // FAILURE
    else {
      toast.error(statusMsg || 'Upload failed with errors');
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
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" textAlign="center" fontWeight="bold" mb={2}>
          Vehicle Bulk Upload
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
          onClick={() => document.getElementById('vehicleFile')?.click()}
        >
          <UploadFileIcon sx={{ fontSize: 35, color: '#1976d2' }} />
          <Typography mt={1}>{file ? file.name : 'Click or upload Excel / CSV file'}</Typography>

          <input
            id="vehicleFile"
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

        {/* Progress */}
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

              <Button size="small" variant="contained" onClick={handleDownloadFailed}>
                Download CSV
              </Button>
            </Stack>

            <Scrollbar sx={{ maxHeight: 200 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Vehicle Number</TableCell>
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

export default VehicleBulkUploadModal;
