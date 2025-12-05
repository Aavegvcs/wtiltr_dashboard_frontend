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

// const CvdBulkUploadModal = ({ open, onClose, refreshData }: any) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const [failedRecords, setFailedRecords] = useState<
//     { index: number; driverId: string; reason: string }[]
//   >([]);

//   // ------------------- DOWNLOAD SAMPLE FILE --------------------
//   const handleDownloadSample = () => {
//     const headers = ['corporateId', 'branchId', 'vehicleId', 'driverId'];

//     const sampleRows = [
//       ['1', '3', '5', '10'], // sample mapping row
//     ];

//     const csvContent = [headers.join(','), ...sampleRows.map(r => r.join(','))].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');

//     link.href = url;
//     link.setAttribute('download', 'cvd_mapping_template.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // ------------------- FILE CHANGE --------------------
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) setFile(e.target.files[0]);
//   };

//   // ------------------- UPLOAD FUNCTION --------------------
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

//     const failed: any[] = [];
//     const batchSize = 30;

//     for (let i = 0; i < jsonData.length; i += batchSize) {
//       const batch = jsonData.slice(i, i + batchSize);

//       for (let j = 0; j < batch.length; j++) {
//         const record = batch[j];

//         try {
//           await axiosInstance.post('/cvd-mapping/create', {
//             corporateId: Number(record.corporateId),
//             branchId: Number(record.branchId),
//             vehicleId: Number(record.vehicleId),
//             driverId: Number(record.driverId),
//           });
//         } catch (err: any) {
//           failed.push({
//             index: i + j + 1,
//             driverId: record.driverId,
//             reason: err.response?.data?.message || 'Mapping failed',
//           });
//         }
//       }

//       setProgress(Math.round(((i + batchSize) / jsonData.length) * 100));
//     }

//     setFailedRecords(failed);
//     setLoading(false);

//     if (failed.length === 0) {
//       toast.success('Bulk mapping completed!');
//       refreshData();
//       onClose();
//     } else {
//       toast.error('Some items failed. Download report.');
//     }
//   };

//   // ------------------- DOWNLOAD FAILED RECORDS --------------------
//   const downloadFailedCsv = () => {
//     if (!failedRecords.length) return;

//     const csvRows = [
//       ['Index', 'Driver ID', 'Reason'].join(','),
//       ...failedRecords.map(rec => [rec.index, rec.driverId, rec.reason].join(',')),
//     ];

//     const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'cvd_mapping_failed_records.csv');
//     link.click();
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           p: 3,
//           bgcolor: 'white',
//           borderRadius: 2,
//           maxWidth: 650,
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
//         <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
//           <CloseIcon />
//         </IconButton>

//         <Typography variant="h6" textAlign="center" fontWeight="bold" mb={2}>
//           CVD Bulk Upload
//         </Typography>

//         <Paper
//           variant="outlined"
//           sx={{
//             p: 2,
//             textAlign: 'center',
//             borderStyle: 'dashed',
//             cursor: 'pointer',
//           }}
//           onClick={() => document.getElementById('cvdFileInput')?.click()}
//         >
//           <UploadFileIcon sx={{ fontSize: 35, color: 'primary.main' }} />
//           <Typography mt={1}>{file ? file.name : 'Click to select file'}</Typography>

//           <input
//             id="cvdFileInput"
//             type="file"
//             hidden
//             accept=".csv, .xlsx, .xls"
//             onChange={handleFileChange}
//           />
//         </Paper>

//         <Stack direction="row" spacing={2} mt={2}>
//           <Button variant="outlined" fullWidth onClick={handleDownloadSample}>
//             Download Sample
//           </Button>
//           <Button variant="contained" fullWidth disabled={!file || loading} onClick={handleUpload}>
//             {loading ? 'Uploading…' : 'Upload'}
//           </Button>
//         </Stack>

//         {loading && (
//           <>
//             <LinearProgress sx={{ mt: 2 }} variant="determinate" value={progress} />
//             <Typography textAlign="center">{progress}% completed</Typography>
//           </>
//         )}

//         {failedRecords.length > 0 && (
//           <Box mt={3}>
//             <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
//               <Typography fontWeight="bold">Failed Records</Typography>
//               <Button size="small" onClick={downloadFailedCsv} variant="contained">
//                 Download CSV
//               </Button>
//             </Stack>

//             <Scrollbar sx={{ maxHeight: 180 }}>
//               <TableContainer>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Index</TableCell>
//                       <TableCell>Driver ID</TableCell>
//                       <TableCell>Reason</TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {failedRecords.map((row, i) => (
//                       <TableRow key={i}>
//                         <TableCell>{row.index}</TableCell>
//                         <TableCell>{row.driverId}</TableCell>
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

// export default CvdBulkUploadModal;
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
  TableContainer,
} from '@mui/material';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';

import axiosInstance from 'src/config-global';
import toast from 'react-hot-toast';
import { Scrollbar } from 'src/components/scrollbar';


type FailedRecord = {
  index: number;
  driverId: string;
  reason: string;
};


const CvdBulkUploadModal = ({ open, onClose, refreshData }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [failedRecords, setFailedRecords] = useState<FailedRecord[]>([]);


  // ------------------- DOWNLOAD SAMPLE FILE --------------------
  const handleDownloadSample = () => {
    const headers = ['corporateId', 'branchId', 'vehicleId', 'driverId'];

    const sampleRows = [
      ['1', '3', '5', '10'],
    ];

    const csvContent = [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'cvd_mapping_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // ------------------- FILE SELECT --------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };


  // ------------------- UPLOAD HANDLER --------------------
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

      const failed: FailedRecord[] = [];
      const batchSize = 30;

      for (let i = 0; i < jsonData.length; i += batchSize) {
        const batch = jsonData.slice(i, i + batchSize);

        for (let j = 0; j < batch.length; j++) {
          const record = batch[j];

          // Basic CSV row validation
          if (!record.corporateId || !record.branchId || !record.vehicleId || !record.driverId) {
            failed.push({
              index: i + j + 1,
              driverId: record.driverId || '-',
              reason: 'Missing required fields',
            });
            continue;
          }

          try {
            await axiosInstance.post('/cvd-mapping/create', {
              corporateId: Number(record.corporateId),
              branchId: Number(record.branchId),
              vehicleId: Number(record.vehicleId),
              driverId: Number(record.driverId),
            });
          } catch (err: any) {
            failed.push({
              index: i + j + 1,
              driverId: record.driverId,
              reason: err?.response?.data?.message || 'Mapping failed',
            });
          }
        }

        setProgress(Math.round(((i + batchSize) / jsonData.length) * 100));
      }

      setFailedRecords(failed);

      if (failed.length === 0) {
        toast.success('Bulk upload successful!');
        refreshData?.();
        onClose();
      } else {
        toast.error('Some mappings failed. Download report.');
      }
    } catch (err) {
      toast.error('File processing failed');
    } finally {
      setLoading(false);
    }
  };


  // ------------------- DOWNLOAD FAILED CSV --------------------
  const downloadFailedCsv = () => {
    if (!failedRecords.length) return;

    const csv = [
      ['Index', 'Driver ID', 'Reason'].join(','),
      ...failedRecords.map((r) => [r.index, r.driverId, r.reason].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cvd_failed_records.csv');
    link.click();
  };


  // ------------------- UI --------------------
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          bgcolor: 'white',
          borderRadius: 2,
          maxWidth: 650,
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
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" textAlign="center" fontWeight="bold" mb={2}>
          CVD Bulk Upload
        </Typography>

        {/* FILE SELECT */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            textAlign: 'center',
            borderStyle: 'dashed',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('cvdFileChoose')?.click()}
        >
          <UploadFileIcon sx={{ fontSize: 35, color: 'primary.main' }} />
          <Typography mt={1}>{file ? file.name : 'Click to choose file'}</Typography>

          <input
            id="cvdFileChoose"
            type="file"
            hidden
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
          />
        </Paper>

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" fullWidth onClick={handleDownloadSample}>
            Sample File
          </Button>
          <Button variant="contained" fullWidth disabled={!file || loading} onClick={handleUpload}>
            {loading ? 'Uploading…' : 'Upload'}
          </Button>
        </Stack>

        {/* PROGRESS BAR */}
        {loading && (
          <>
            <LinearProgress sx={{ mt: 2 }} variant="determinate" value={progress} />
            <Typography textAlign="center" mt={1}>
              {progress}% completed
            </Typography>
          </>
        )}

        {/* FAILED RECORDS */}
        {failedRecords.length > 0 && (
          <Box mt={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontWeight="bold">Failed Records</Typography>

              <Button size="small" onClick={downloadFailedCsv} variant="contained">
                Download CSV
              </Button>
            </Stack>

            <Scrollbar sx={{ maxHeight: 200 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Driver ID</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {failedRecords.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.index}</TableCell>
                        <TableCell>{row.driverId}</TableCell>
                        <TableCell>{row.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CvdBulkUploadModal;
