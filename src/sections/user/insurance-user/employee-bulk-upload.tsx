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
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from 'src/config-global';
import toast from 'react-hot-toast';
import { Scrollbar } from 'src/components/scrollbar';
import { Insurance_Type } from 'src/utils/insurance.utils';
import { RequiredMark } from 'src/utils/commonUtils';

const EmployeeBulkUploadModal = ({ open, onClose, refreshData, insuranceCompany }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failedRecords, setFailedRecords] = useState<
    { index: number; name: string; reason: string }[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [company, setCompany] = useState<string>('');

  const handleDownloadSample = () => {
    // Define headers
    const headers = [
      'Staff name',
      'Staff Code',
      'RM Code',
      'Branch Code',
      'Email',
      'Mobile',
      'Pan NO',
      'roles'
    ];

    const sampleRows = Object.values(Insurance_Type).map((type) => [
      'Aftab Alam',
      'AFB01', 
      'TT9',
      'BR1',
      'test@gmail.com',
      '9100000000',
      'PAN8377',
      'staff'
    ]);

    // Build CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...sampleRows.map((row) => row.join(',')), // Data rows
    ].join('\n');

    // Create CSV blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_employee_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFailed = () => {
    if (failedRecords.length === 0) return;

    const headers = ['Index', 'Product Name', 'Reason'];
    const csvRows = [
      headers.join(','), // header row
      ...failedRecords.map((rec) => [rec.index, rec.name, rec.reason].join(',')),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'failed_product_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    setCompany(value);
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const handleUpload = async () => {
    // if (!company) {
    //   setErrors((prev) => ({ ...prev, insuranceCompanyId: 'Please select a company' }));
    //   return;
    // }
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

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
 console.log("branch json data is here---", jsonData);

    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize);
    //   console.log("here is batch data -----", batch);
      
      try {
        const response = await axiosInstance.post('users/employeeBulkUpload', {
          data: batch,
          startIndex: i + 1,
          insuranceCompanyId: company,
        });
        const res = response.data.data;
        resstatus = res.status;
        resmsz = res.message;
        const result = res.result;
        if (result.failed && result.failed.length > 0) {
          failed = [...failed, ...result.failed];
        }
      } catch (err) {
        failed.push({ index: i + 1, name: 'Unknown', reason: 'Server error' });
      }
      setProgress(Math.round(((i + batchSize) / jsonData.length) * 100));
    }

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
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 10, right: 10 }}
          size="small"
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" textAlign="center" mb={2} fontWeight="bold">
          Employee Bulk Upload
        </Typography>

        {/* File Upload */}
        <Paper
          variant="outlined"
          sx={{
            p: 1,
            borderStyle: 'dashed',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f9f9f9' },
          }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <UploadFileIcon sx={{ fontSize: 40, color: '#1976d2' }} />
          <Typography variant="body1" mt={1}>
            {file ? file.name : 'Click here or drag & drop csv file to upload'}
          </Typography>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Paper>

        {/* Buttons */}
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" fullWidth onClick={handleDownloadSample}>
            Download Sample
          </Button>
          <Button variant="contained" fullWidth onClick={handleUpload} disabled={loading || !file}>
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </Stack>

        {/* Progress */}
        {loading && (
          <>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
            <Typography mt={1} textAlign="center">
              {progress}% Completed
            </Typography>
          </>
        )}

        {/* Failed Records Table */}
        {failedRecords.length > 0 && (
          <Box mt={3} flex={1} sx={{ minHeight: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                Failed Records:
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleDownloadFailed}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' },
                }}
              >
                Download CSV
              </Button>
            </Box>
            <Box sx={{ maxHeight: 176, overflowY: 'auto' }}>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                <Table size="small" stickyHeader>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Index</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Employee Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {failedRecords.map((rec, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{rec.index}</TableCell>
                        <TableCell>{rec.name}</TableCell>
                        <TableCell>{rec.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default EmployeeBulkUploadModal;
