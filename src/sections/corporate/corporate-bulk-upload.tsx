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

const CorporateBulkUploadModal = ({ open, onClose, refreshData }: any) => {
const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failedRecords, setFailedRecords] = useState<
    { index: number; name: string; reason: string }[]
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

const handleDownloadSample = () => {
  const headers = [
    'corporateName',
    'phoneNumber',
    'adminName',
    'email',
    'state',
    'country',
    'address'
  ];

  const sampleRow = [
    'Sample Corporate',
    '9876543210',
    'Admin Name',
    'admin@test.com',
    'Haryana',
    'India',
    'Dwarka Sector 10'
  ];

  const wsData = [headers, sampleRow];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws['!cols'] = headers.map(() => ({ wch: 20 }));

  XLSX.utils.book_append_sheet(wb, ws, 'sample_corporate_template');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample_corporate_template.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const handleDownloadFailed = () => {
  if (!failedRecords || failedRecords.length === 0) return;

  const headers = ['Index', 'Company Name', 'Reason'];
  const rows = failedRecords.map((rec) => [rec.index, rec.name, rec.reason]);
  const wsData = [headers, ...rows];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 60 }];

  XLSX.utils.book_append_sheet(wb, ws, 'FailedRecords');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'failed_corporate_records.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setFailedRecords([]);
    let resstatus = null;
    let resmsz = null;
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    const batchSize = 50;
    let failed: { index: number; name: string; reason: string }[] = [];

    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize);
      console.log('batch is here', batch);

      try {
        const response = await axiosInstance.post('corporate/bulkUpload', {
          data: batch,
          startIndex: i + 1,
        });
        const res = response.data.data;
        resstatus = res.status;
        console.log('response status is', resstatus);
        resmsz = res.message;
        console.log('response message is', resmsz);
        const result = res.result;
        console.log('result is here', result);
        if (result.failed && result.failed.length > 0) {
          failed = [...failed, ...result.failed];
        }
        console.log('failed data is1', failed);
      } catch (err) {
        failed.push({ index: i + 1, name: failed[i].name, reason: 'Server error' });
      }
      setProgress(Math.round(((i + batchSize) / jsonData.length) * 100));
    }
    console.log('failed data is2', failed);

    setFailedRecords(failed);
    setLoading(false);

    if (failed.length === 0) {
      toast.success('Bulk upload completed successfully!');
      refreshData();
      onClose();
    } else if (resstatus) {
      toast.success(resmsz);
    } else {
      toast.error(resmsz);
    }
  };

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
        {/* ❌ CLOSE */}
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        {/* ✅ TITLE */}
        <Typography variant="h6" textAlign="center" fontWeight="bold" mb={2}>
          Corporate Bulk Upload
        </Typography>

        {/* ✅ FILE UPLOAD BOX */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderStyle: 'dashed',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <UploadFileIcon sx={{ fontSize: 35, color: '#1976d2' }} />
          <Typography mt={1}>
            {file ? file.name : 'Click or upload Excel file'}
          </Typography>
          <input
            hidden
            id="fileInput"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />
        </Paper>

        {/* ✅ BUTTONS */}
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" fullWidth onClick={handleDownloadSample}>
            Download Excel Template
          </Button>
          <Button variant="contained" fullWidth onClick={handleUpload} disabled={loading}>
            Upload
          </Button>
        </Stack>

        {/* ✅ PROGRESS */}
        {loading && (
          <>
            <LinearProgress sx={{ mt: 2 }} />
            <Typography textAlign="center">Uploading...</Typography>
          </>
        )}

        {/* ✅ FAILED RECORDS */}
        {failedRecords.length > 0 && (
          <Box mt={3} flex={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight="bold" color="error">
                Failed Records
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleDownloadFailed}
              >
                Download CSV
              </Button>
            </Stack>

            <Scrollbar sx={{ maxHeight: 180 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Corporate Name</TableCell>
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

export default CorporateBulkUploadModal;
