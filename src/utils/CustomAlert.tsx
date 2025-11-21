import { Box, Dialog, DialogContent, DialogActions, Typography, Button } from '@mui/material';

interface CustomAlertProps {
  open: boolean;
  message: string;
  alertType?: 'error' | 'success' | 'info';
  onClose: () => void;
}

export default function CustomAlert({
  open,
  message,
  alertType = 'error',
  onClose,
}: CustomAlertProps) {
  // Define colors for each alert type
  const typeStyles = {
    error: { backgroundColor: '#d32f2f', hoverColor: '#b71c1c', borderColor: '#d32f2f' },
    success: { backgroundColor: '#2e7d32', hoverColor: '#1b5e20', borderColor: '#2e7d32' },
    info: { backgroundColor: '#0055A5', hoverColor: '#004080', borderColor: '#0055A5' },
  };

  const { backgroundColor, hoverColor, borderColor } = typeStyles[alertType];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: '400px',
          width: '90%',
          margin: 'auto',
          transition: 'all 0.3s ease-in-out',
          border: `1px solid ${borderColor}`,
        },
      }}
    >
      <DialogContent sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="body1"
          sx={{
            color: '#333',
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            py: 1,
            backgroundColor,
            color: '#fff',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: hoverColor,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
