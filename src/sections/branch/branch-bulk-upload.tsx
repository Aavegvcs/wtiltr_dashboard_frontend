// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import {
//   Modal,
//   Box,
//   Typography,
//   Button,
//   LinearProgress,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from '@mui/material';
// import UploadFileIcon from '@mui/icons-material/UploadFile';
// import CloseIcon from '@mui/icons-material/Close';
// import toast from 'react-hot-toast';
// import axiosInstance from 'src/config-global';

// export default function BranchBulkUpload({
//   open,
//   onClose,
//   refresh,
// }: {
//   open: boolean;
//   onClose: () => void;
//   refresh: () => void;
// }) {
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [failed, setFailed] = useState<any[]>([]);

//   // ✅ FILE PICK
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) setFile(e.target.files[0]);
//   };

//   // ✅✅✅ SIMPLE EXCEL SAMPLE (NO DROPDOWNS)
//   const downloadSample = () => {
//     const header = [
//       'Code',
//       'Name',
//       'City',
//       'State Name',   // ✅ USER WILL TYPE MANUALLY
//       'Pincode',
//       'Address',
//       'Email',
//       'Mobile',
//       'corporateId',  // ✅ USER WILL TYPE ID
//     ];

//     const sample = [
//       [
//         'B001',
//         'Sample Branch',
//         'Delhi',
//         'Haryana',
//         '110001',
//         'Dwarka Sector 10',
//         'a@a.com',
//         '9876543210',
//         '1',
//       ],
//     ];

//     const ws = XLSX.utils.aoa_to_sheet([header, ...sample]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Branches');
//     XLSX.writeFile(wb, 'branch_bulk_sample.xlsx');
//   };

//   // ✅✅✅ FINAL BULK UPLOAD (SIMPLE PAYLOAD)
//   const handleUpload = async () => {
//     if (!file) return toast.error('Select file');

//     setLoading(true);
//     setProgress(0);
//     setFailed([]);

//     try {
//       const buffer = await file.arrayBuffer();
//       const wb = XLSX.read(buffer);
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

//       if (!json.length) {
//         toast.error('No data found in file');
//         setLoading(false);
//         return;
//       }

//       // ✅✅✅ BACKEND EXPECTS THIS FORMAT
//       const payload = {
//         data: json,
//         startIndex: 1,
//       };

//       console.log('✅ BRANCH BULK PAYLOAD ===>', payload);

//       const res = await axiosInstance.post('branches/branchBulkUpload', payload);

//       const failedRows = res?.data?.data?.failed || [];
//       const successCount = res?.data?.data?.successCount || 0;

//       setFailed(failedRows);

//       if (failedRows.length === 0) {
//         toast.success(`✅ ${successCount} branches uploaded successfully`);
//         refresh();
//         onClose();
//       } else {
//         toast.error(`⚠️ ${failedRows.length} rows failed`);
//       }
//     } catch (err: any) {
//       console.error(err);
//       toast.error('Bulk upload failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           p: 3,
//           bgcolor: 'white',
//           borderRadius: 2,
//           maxWidth: 800,
//           mx: 'auto',
//           mt: 5,
//           position: 'relative',
//         }}
//       >
//         <Button sx={{ position: 'absolute', right: 12, top: 12 }} onClick={onClose}>
//           <CloseIcon />
//         </Button>

//         <Typography variant="h6" textAlign="center" mb={2}>
//           Branch Bulk Upload
//         </Typography>

//         <Paper
//           variant="outlined"
//           sx={{ p: 2, borderStyle: 'dashed', textAlign: 'center', cursor: 'pointer' }}
//           onClick={() => document.getElementById('branchFile')?.click()}
//         >
//           <UploadFileIcon sx={{ fontSize: 40 }} />
//           <Typography mt={1}>
//             {file ? file.name : 'Click to select XLSX/CSV'}
//           </Typography>
//           <input
//             id="branchFile"
//             style={{ display: 'none' }}
//             type="file"
//             accept=".csv,.xlsx,.xls"
//             onChange={handleFileChange}
//           />
//         </Paper>

//         <Box mt={2} display="flex" gap={2}>
//           <Button variant="outlined" fullWidth onClick={downloadSample}>
//             Download Sample
//           </Button>
//           <Button
//             variant="contained"
//             fullWidth
//             onClick={handleUpload}
//             disabled={!file || loading}
//           >
//             {loading ? 'Uploading...' : 'Upload'}
//           </Button>
//         </Box>

//         {loading && <LinearProgress variant="indeterminate" sx={{ mt: 2 }} />}

//         {/* ✅ FAILED TABLE */}
//         {failed.length > 0 && (
//           <>
//             <Typography mt={2}>Failed rows</Typography>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Index</TableCell>
//                   <TableCell>Code</TableCell>
//                   <TableCell>Reason</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {failed.map((f, i) => (
//                   <TableRow key={i}>
//                     <TableCell>{f.index}</TableCell>
//                     <TableCell>{f.name}</TableCell>
//                     <TableCell>{f.reason}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             <Box mt={2}>
//               <Button
//                 variant="outlined"
//                 onClick={() => {
//                   const ws = XLSX.utils.json_to_sheet(failed);
//                   const wb = XLSX.utils.book_new();
//                   XLSX.utils.book_append_sheet(wb, ws, 'failed');
//                   XLSX.writeFile(wb, 'branch_bulk_failed.xlsx');
//                 }}
//               >
//                 Download Failed
//               </Button>
//             </Box>
//           </>
//         )}
//       </Box>
//     </Modal>
//   );
// }
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Modal,
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
} from '@mui/material';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import axiosInstance from 'src/config-global';
import { Scrollbar } from 'src/components/scrollbar';
import { ConnectingAirportsOutlined } from '@mui/icons-material';

export default function BranchBulkUpload({ open, onClose, refresh }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failedRecords, setFailedRecords] = useState<
    { index: number; name: string; reason: string }[]
  >([]);

  // ------------------------------
  // FILE PICKER
  // ------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  // ------------------------------
  // DOWNLOAD SAMPLE FILE
  // ------------------------------
  const handleDownloadSample = () => {
    const headers = [
      'Code',
      'Name',
      'City',
      'State Name',
      'Pincode',
      'Address',
      'Email',
      'Mobile',
      'corporateId',
    ];

    const sample = [
      [
        'B001',
        'Sample Branch',
        'Delhi',
        'Haryana',
        '110001',
        'Dwarka Sec-10',
        'abc@test.com',
        '9876543210',
        '1',
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...sample]);
    const wb = XLSX.utils.book_new();

    ws['!cols'] = headers.map(() => ({ wch: 20 }));
    XLSX.utils.book_append_sheet(wb, ws, 'Branch_Template');

    XLSX.writeFile(wb, 'branch_bulk_upload_template.xlsx');
  };

  // ------------------------------
  // DOWNLOAD FAILED CSV
  // ------------------------------
  const handleDownloadFailed = () => {
    if (!failedRecords.length) return;

    const headers = ['Index', 'Code', 'Reason'];
    const rows = failedRecords.map((rec) => [
      rec.index,
      rec.name ?? 'N/A',
      rec.reason ?? 'Unknown Error',
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    ws['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 60 }];

    XLSX.utils.book_append_sheet(wb, ws, 'FailedRecords');
    XLSX.writeFile(wb, 'branch_failed_records.xlsx');
  };

  // ------------------------------
  // BULK UPLOAD WITH BATCHING (50 rows)
  // ------------------------------
  const handleUpload = async () => {
    if (!file) return toast.error('Please select an Excel file');

    setLoading(true);
    setProgress(0);
    setFailedRecords([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      const batchSize = 50;
      let failed: any[] = [];
      let responseMessage: string | null = null;
      let responseStatus: boolean | null = null;

      for (let i = 0; i < jsonData.length; i += batchSize) {
        const batch = jsonData.slice(i, i + batchSize);

        try {
          const response = await axiosInstance.post('branches/branchBulkUpload', {
            data: batch,
            startIndex: i + 1,
          });

          const res = response.data.data;

          responseMessage = res?.message;
          console.log('RES IS HERE', responseMessage);
          responseStatus = res?.status;
          const result = res.result;
          console.log('STATUS IS HERE', responseStatus);

          if (result.failed && result.failed.length > 0) {
            failed = [...failed, ...result.failed];
          }
        } catch (err) {
          failed.push({
            index: i + 1,
            name: batch?.[0]?.Code ?? 'Unknown',
            reason: 'Server Error',
          });
        }

        setProgress(Math.round(((i + batchSize) / jsonData.length) * 100));
      }

      setFailedRecords(failed);
      setLoading(false);

      // SUCCESS — no failed rows
      if (failed.length === 0) {
        toast.success('Branch Bulk Upload completed successfully!');
        refresh();
        onClose();
      }
      // PARTIAL SUCCESS
      else if (responseStatus) {
        toast.success(responseMessage || 'Some records failed');
      }
      // FAILURE
      else {
        toast.error(responseMessage || 'Upload completed with errors');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to process Excel file');
      setLoading(false);
    }
  };

  // ------------------------------
  // UI RENDER
  // ------------------------------
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
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* CLOSE BUTTON */}
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        {/* TITLE */}
        <Typography variant="h6" textAlign="center" fontWeight="bold" mb={2}>
          Branch Bulk Upload
        </Typography>

        {/* UPLOAD BOX */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderStyle: 'dashed',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('branchFile')?.click()}
        >
          <UploadFileIcon sx={{ fontSize: 35, color: '#1976d2' }} />

          <Typography mt={1}>{file ? file.name : 'Click or upload Excel file'}</Typography>

          <input
            hidden
            id="branchFile"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />
        </Paper>

        {/* BUTTONS */}
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" fullWidth onClick={handleDownloadSample}>
            Download Excel Template
          </Button>

          <Button variant="contained" fullWidth disabled={loading} onClick={handleUpload}>
            Upload
          </Button>
        </Stack>

        {/* PROGRESS BAR */}
        {loading && (
          <>
            <LinearProgress sx={{ mt: 2 }} value={progress} />
            <Typography textAlign="center">Uploading...</Typography>
          </>
        )}

        {/* FAILED RECORDS TABLE */}
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
                    <TableCell>Code</TableCell>
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
}
