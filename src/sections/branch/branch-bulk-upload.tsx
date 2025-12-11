// import React, { useEffect, useState } from 'react';
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
//   const [stateList, setStateList] = useState<string[]>([]);
//   const [corporateList, setCorporateList] = useState<any[]>([]);

//   // ✅ LOAD STATES & CORPORATES FOR DROPDOWN + SAMPLE
//   useEffect(() => {
//     const loadMasters = async () => {
//       try {
//         const [stateRes, corpRes] = await Promise.all([
//           axiosInstance.get('/states'),
//           axiosInstance.post('companies/list', {}),
//         ]);

//         setStateList((stateRes?.data?.data || []).map((s: any) => s.name));
//         console.log('✅ States loaded 0000:', stateRes?.data?.data || 0);
//         setCorporateList(corpRes?.data?.data?.items || []);
//         console.log('✅ Corporates loaded 999:', corpRes?.data?.data?.items || 0);
//       } catch (err) {
//         toast.error('Failed to load masters');
//       }
//     };
//     loadMasters();
//   }, []);

//   // ✅ FILE PICK
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) setFile(e.target.files[0]);
//   };

//   // ✅✅✅ DOWNLOAD SAMPLE (WITH CORPORATE ID)
//   const downloadSample = () => {
//     const header = [
//       'Code',
//       'Name',
//       'City',
//       'State Name',
//       'Pincode',
//       'Address',
//       'Email',
//       'Mobile',
//       'corporateId',   // ✅ REQUIRED
//     ];

//     const sample = [
//       [
//         'B001',
//         'Sample Branch',
//         'Delhi',
//         stateList[0] || 'Delhi',
//         '110001',
//         'Dwarka',
//         'a@a.com',
//         '9876543210',
//         corporateList[0]?.id || '1',
//       ],
//     ];

//     const ws = XLSX.utils.aoa_to_sheet([header, ...sample]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'sample');
//     XLSX.writeFile(wb, 'branch_bulk_sample.xlsx');
//   };

//   // ✅✅✅ FINAL BULK UPLOAD (CORPORATE INCLUDED)
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

//       // ✅✅✅ SEND EXACT STRUCTURE REQUIRED BY BACKEND
//       const payload = {
//         data: json,
//         startIndex: 1,
//       };

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
//           <Typography mt={1}>{file ? file.name : 'Click to select XLSX/CSV'}</Typography>
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
//           <Button variant="contained" fullWidth onClick={handleUpload} disabled={!file || loading}>
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
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import axiosInstance from 'src/config-global';

export default function BranchBulkUpload({
  open,
  onClose,
  refresh,
}: {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState<any[]>([]);

  // ✅ FILE PICK
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  // ✅✅✅ SIMPLE EXCEL SAMPLE (NO DROPDOWNS)
  const downloadSample = () => {
    const header = [
      'Code',
      'Name',
      'City',
      'State Name',   // ✅ USER WILL TYPE MANUALLY
      'Pincode',
      'Address',
      'Email',
      'Mobile',
      'corporateId',  // ✅ USER WILL TYPE ID
    ];

    const sample = [
      [
        'B001',
        'Sample Branch',
        'Delhi',
        'Haryana',
        '110001',
        'Dwarka Sector 10',
        'a@a.com',
        '9876543210',
        '1',
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet([header, ...sample]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Branches');
    XLSX.writeFile(wb, 'branch_bulk_sample.xlsx');
  };

  // ✅✅✅ FINAL BULK UPLOAD (SIMPLE PAYLOAD)
  const handleUpload = async () => {
    if (!file) return toast.error('Select file');

    setLoading(true);
    setProgress(0);
    setFailed([]);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

      if (!json.length) {
        toast.error('No data found in file');
        setLoading(false);
        return;
      }

      // ✅✅✅ BACKEND EXPECTS THIS FORMAT
      const payload = {
        data: json,
        startIndex: 1,
      };

      console.log('✅ BRANCH BULK PAYLOAD ===>', payload);

      const res = await axiosInstance.post('branches/branchBulkUpload', payload);

      const failedRows = res?.data?.data?.failed || [];
      const successCount = res?.data?.data?.successCount || 0;

      setFailed(failedRows);

      if (failedRows.length === 0) {
        toast.success(`✅ ${successCount} branches uploaded successfully`);
        refresh();
        onClose();
      } else {
        toast.error(`⚠️ ${failedRows.length} rows failed`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Bulk upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          bgcolor: 'white',
          borderRadius: 2,
          maxWidth: 800,
          mx: 'auto',
          mt: 5,
          position: 'relative',
        }}
      >
        <Button sx={{ position: 'absolute', right: 12, top: 12 }} onClick={onClose}>
          <CloseIcon />
        </Button>

        <Typography variant="h6" textAlign="center" mb={2}>
          Branch Bulk Upload
        </Typography>

        <Paper
          variant="outlined"
          sx={{ p: 2, borderStyle: 'dashed', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => document.getElementById('branchFile')?.click()}
        >
          <UploadFileIcon sx={{ fontSize: 40 }} />
          <Typography mt={1}>
            {file ? file.name : 'Click to select XLSX/CSV'}
          </Typography>
          <input
            id="branchFile"
            style={{ display: 'none' }}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
          />
        </Paper>

        <Box mt={2} display="flex" gap={2}>
          <Button variant="outlined" fullWidth onClick={downloadSample}>
            Download Sample
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>

        {loading && <LinearProgress variant="indeterminate" sx={{ mt: 2 }} />}

        {/* ✅ FAILED TABLE */}
        {failed.length > 0 && (
          <>
            <Typography mt={2}>Failed rows</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {failed.map((f, i) => (
                  <TableRow key={i}>
                    <TableCell>{f.index}</TableCell>
                    <TableCell>{f.name}</TableCell>
                    <TableCell>{f.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box mt={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  const ws = XLSX.utils.json_to_sheet(failed);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, 'failed');
                  XLSX.writeFile(wb, 'branch_bulk_failed.xlsx');
                }}
              >
                Download Failed
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
