import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Modal, Box, Typography, Button, LinearProgress, Paper, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import { createBranch } from './branch-service';
import type { BranchItem } from './types';

export default function BranchBulkUpload({ open, onClose, refresh }: { open: boolean; onClose: () => void; refresh: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  const downloadSample = () => {
    const header = ['id', 'branchCode', 'corporateId', 'name', 'stateId', 'city', 'pincode', 'address', 'email', 'phone', 'isActive'];
    const sample = [['B001', 'B001', '1', 'Sample Branch', '1', 'City', '110001', 'Address', 'a@a.com', '9876543210', 'true']];
    const ws = XLSX.utils.aoa_to_sheet([header, ...sample]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sample');
    XLSX.writeFile(wb, 'branch_bulk_sample.xlsx');
  };

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
      const batchSize = 20;
      const failedRows: any[] = [];

      for (let i = 0; i < json.length; i += batchSize) {
        const batch = json.slice(i, i + batchSize);
        const promises = batch.map(async (row, idx) => {
          try {
            const payload: Partial<BranchItem> = {
              id: row.id ?? row.branchCode,
              branchCode: row.branchCode,
              corporateId: row.corporateId,
              name: row.name,
              stateId: row.stateId,
              city: row.city,
              pincode: row.pincode ? Number(row.pincode) : undefined,
              address: row.address,
              email: row.email,
              phone: row.phone,
              isActive: row.isActive === undefined ? true : (String(row.isActive).toLowerCase() === 'true'),
            };
            await createBranch(payload);
            return null;
          } catch (err: any) {
            return { index: i + idx + 1, reason: err?.message ?? JSON.stringify(err) };
          }
        });

        const results = await Promise.all(promises);
        results.forEach((r) => r && failedRows.push(r));
        setProgress(Math.round(Math.min(100, ((i + batchSize) / json.length) * 100)));
      }

      setFailed(failedRows);
      if (failedRows.length === 0) {
        toast.success('Bulk upload completed');
        refresh();
        onClose();
      } else {
        toast.error(`${failedRows.length} rows failed`);
      }
    } catch (err) {
      console.error(err);
      toast.error('File processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, maxWidth: 800, mx: 'auto', mt: 5, position: 'relative' }}>
        <Button sx={{ position: 'absolute', right: 12, top: 12 }} onClick={onClose}><CloseIcon /></Button>
        <Typography variant="h6" textAlign="center" mb={2}>Branch Bulk Upload</Typography>

        <Paper variant="outlined" sx={{ p: 2, borderStyle: 'dashed', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('branchFile')?.click()}>
          <UploadFileIcon sx={{ fontSize: 40 }} />
          <Typography mt={1}>{file ? file.name : 'Click to select XLSX/CSV'}</Typography>
          <input id="branchFile" style={{ display: 'none' }} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
        </Paper>

        <Box mt={2} display="flex" gap={2}>
          <Button variant="outlined" fullWidth onClick={downloadSample}>Download Sample</Button>
          <Button variant="contained" fullWidth onClick={handleUpload} disabled={!file || loading}>{loading ? 'Uploading...' : 'Upload'}</Button>
        </Box>

        {loading && <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />}

        {failed.length > 0 && (
          <>
            <Typography mt={2}>Failed rows</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {failed.map((f, i) => (
                  <TableRow key={i}>
                    <TableCell>{f.index}</TableCell>
                    <TableCell>{f.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box mt={2}>
              <Button variant="outlined" onClick={() => {
                const ws = XLSX.utils.json_to_sheet(failed);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'failed');
                XLSX.writeFile(wb, 'branch_bulk_failed.xlsx');
              }}>Download Failed</Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
