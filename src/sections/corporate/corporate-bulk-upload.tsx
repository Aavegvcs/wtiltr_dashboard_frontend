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
  const [failedRecords, setFailedRecords] = useState<any[]>([]);

  // ✅ SIMPLE EXCEL TEMPLATE (NO DROPDOWNS)
  const handleDownloadSample = () => {
    const header = [
      'Corporate Code',
      'Corporate Name',
      'Phone Number',
      'Admin Name',
      'Email',
      'State',     // ✅ USER TYPES MANUALLY
      'Country',   // ✅ USER TYPES MANUALLY
      'Address',
      'IsActive',
    ];

    const sample = [
      [
        'CORP001',
        'Sample Corporate',
        '9876543210',
        'Admin Name',
        'admin@test.com',
        'Haryana',
        'India',
        'Dwarka Sector 10',
        'true',
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet([header, ...sample]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Corporates');
    XLSX.writeFile(wb, 'corporate_bulk_template.xlsx');
  };

  // ✅ FILE SELECT
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  // ✅ DOWNLOAD FAILED RECORDS CSV
  const handleDownloadFailed = () => {
    if (!failedRecords.length) return;

    const csvRows = [
      ['Index', 'Corporate Name', 'Reason'].join(','),
      ...failedRecords.map((rec) => [rec.index, rec.name, rec.reason].join(',')),
    ];

    const blob = new Blob([csvRows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'failed_corporate_records.csv');
    link.click();
  };

  // ✅✅✅ UPLOAD FILE → SEND DIRECT ARRAY TO BACKEND
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    setProgress(0);
    setFailedRecords([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null }) as any[];

      if (!jsonData.length) {
        toast.error('No data found in file');
        setLoading(false);
        return;
      }

      console.log('✅ CORPORATE BULK PAYLOAD ===>', jsonData);

      const res = await axiosInstance.post('companies/bulkUpload', jsonData);

      setFailedRecords(res?.data?.failedRecords || []);

      toast.success(`✅ Uploaded: ${res?.data?.successCount || 0}`);
      refreshData();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Bulk upload failed');
    }

    setLoading(false);
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
