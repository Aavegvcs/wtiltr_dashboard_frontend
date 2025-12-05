import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Paper,
} from '@mui/material';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

import axiosInstance from 'src/config-global';
import toast from 'react-hot-toast';

type Props = {
  value: {
    profilePhoto?: string;
    aadharFront?: string;
    aadharBack?: string;
    dlFront?: string;
    dlBack?: string;
    panCard?: string;
  };
  onChange: (val: any) => void;
};

export default function DriverDocumentsUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: any, field: string) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      // Change endpoint if needed
      const res = await axiosInstance.post('/upload/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fileUrl = res.data?.url;
      if (!fileUrl) {
        toast.error('Upload failed');
        return;
      }

      onChange({
        ...value,
        [field]: fileUrl,
      });

      toast.success('Document uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (field: string) => {
    onChange({
      ...value,
      [field]: undefined,
    });
  };

  const renderUploadCard = (label: string, field: keyof Props['value'], currentValue?: string) => {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          borderStyle: 'dashed',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Typography fontWeight="bold" mb={1}>
          {label}
        </Typography>

        {currentValue ? (
          <Box>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {currentValue}
            </Typography>

            <IconButton
              color="error"
              onClick={() => handleRemove(field)}
              sx={{ mt: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<UploadFileIcon />}
            disabled={uploading}
            onClick={() => document.getElementById(field)?.click()}
          >
            Upload {label}
          </Button>
        )}

        <input
          id={field}
          type="file"
          accept="image/*,.pdf"
          hidden
          onChange={(e) => handleFileUpload(e, field)}
        />
      </Paper>
    );
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Driver Documents
      </Typography>

      <Stack spacing={2}>
        {renderUploadCard('Profile Photo', 'profilePhoto', value.profilePhoto)}
        {renderUploadCard('Aadhar Front', 'aadharFront', value.aadharFront)}
        {renderUploadCard('Aadhar Back', 'aadharBack', value.aadharBack)}
        {renderUploadCard('Driving License Front', 'dlFront', value.dlFront)}
        {renderUploadCard('Driving License Back', 'dlBack', value.dlBack)}
        {renderUploadCard('PAN Card', 'panCard', value.panCard)}
      </Stack>
    </Box>
  );
}
