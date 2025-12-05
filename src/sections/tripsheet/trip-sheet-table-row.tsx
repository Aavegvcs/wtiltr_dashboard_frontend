import { useState, useCallback } from 'react';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import axiosInstance from 'src/config-global';
import toast from 'react-hot-toast';
import type { TripSheetRow } from './trip-sheet-view';
import { alpha } from '@mui/material/styles';
import { getStatusColor } from 'src/utils/tripSheet';

type Props = {
  row: TripSheetRow;
  selected: boolean;
  onSelectRow: () => void;
  onView: () => void;
  onEdit: () => void;
  onUpdated: () => void;
};

const StatusMap: Record<
  number,
  { text: string; color: 'info' | 'warning' | 'success' | 'error' | 'default' }
> = {
  0: { text: 'Created', color: 'info' },
  1: { text: 'Submitted', color: 'warning' },
  2: { text: 'Approved', color: 'success' },
  3: { text: 'Rejected', color: 'error' },
  4: { text: 'Cancelled', color: 'default' },
};

function getStatusText(s: number | string | undefined) {
  const n = typeof s === 'string' ? Number(s) : (s ?? -1);
  return StatusMap[n as number]?.text ?? 'Unknown';
}
function getStatusColorKey(s: number | string | undefined) {
  const n = typeof s === 'string' ? Number(s) : (s ?? -1);
  return StatusMap[n as number]?.color ?? 'default';
}
// function getRowBg(status: number | string | undefined) {
//   const n = typeof status === 'string' ? Number(status) : status ?? -1;
//   switch (StatusMap[n as number]?.color) {
//     case 'success':
//       return { bgcolor: (t: any) => `${t.palette.success.light}22` };
//     case 'warning':
//       return { bgcolor: (t: any) => `${t.palette.warning.light}14` };
//     case 'error':
//       return { bgcolor: (t: any) => `${t.palette.error.light}14` };
//     case 'info':
//       return { bgcolor: (t: any) => `${t.palette.info.light}10` };
//     default:
//       return {};
//   }
// }
function getRowBg(status: number | string | undefined) {
  const color = getStatusColor(status);

  return {
    bgcolor: (theme: any) => {
      switch (color) {
        case 'success':
          return alpha(theme.palette.success.main, 0.15);
        case 'warning':
          return alpha(theme.palette.warning.main, 0.15);
        case 'error':
          return alpha(theme.palette.error.main, 0.15);
        case 'info':
          return alpha(theme.palette.info.main, 0.15);
        default:
          return 'inherit';
      }
    },
  };
}
export function TripSheetTableRow({
  row,
  selected,
  onSelectRow,
  onView,
  onEdit,
  onUpdated,
}: Props) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'APPROVE' | 'REJECT' | 'REOPEN' | null>(null);
  const [processing, setProcessing] = useState(false);

  const openMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => setAnchor(e.currentTarget),
    []
  );
  const closeMenu = useCallback(() => setAnchor(null), []);

  const handleConfirmOpen = (action: 'APPROVE' | 'REJECT' | 'REOPEN') => {
    setConfirmAction(action);
    setConfirmOpen(true);
    closeMenu();
  };
  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setConfirmAction(null);
  };

  const performStatusUpdate = async () => {
    if (!confirmAction) return;
    setProcessing(true);
    try {
      const tripStatus = confirmAction === 'APPROVE' ? 2 : confirmAction === 'REJECT' ? 3 : 0;
      const res = await axiosInstance.patch('/tripsheet/updateStatusByAdmin', {
        tripSheetId: row.id,
        tripStatus,
      });
      // backend returns standardResponse; we just refresh parent
      toast.success(
        `${confirmAction === 'APPROVE' ? 'Approved' : confirmAction === 'REJECT' ? 'Rejected' : 'Reopened'} successfully`
      );
      onUpdated();
    } catch (err: any) {
      console.error(err);
      toast.error('Operation failed');
    } finally {
      setProcessing(false);
      handleConfirmClose();
    }
  };

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        sx={getRowBg(row.tripStatus)}
      >
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align="center">{row.id}</TableCell>
        <TableCell align="center">{row.corporate?.corporateName || '-'}</TableCell>
        <TableCell align="center">{row.branch?.name || row.branch?.branchName || '-'}</TableCell>
        <TableCell align="center">
          {row.driver ? `${row.driver.name} (${row.driver.mobileNumber || '-'})` : '-'}
        </TableCell>
        <TableCell align="center">
          {row.vehicle
            ? `${row.vehicle.vehicleNumber} ${row.vehicle.vehicleName ? `(${row.vehicle.vehicleName})` : ''}`
            : '-'}
        </TableCell>
        <TableCell align="center">
          {row.tripDate ? new Date(row.tripDate).toLocaleDateString() : '-'}
        </TableCell>
        <TableCell align="center">{row.startOdometer ?? '-'}</TableCell>
        <TableCell align="center">{row.endOdometer ?? '-'}</TableCell>
        <TableCell align="center">{row.totalKm ?? '-'}</TableCell>

        <TableCell align="center">
          <Label color={getStatusColorKey(row.tripStatus)}>{getStatusText(row.tripStatus)}</Label>
        </TableCell>

        <TableCell align="center">
          <IconButton onClick={openMenu}>
            <Iconify icon="solar:menu-dots-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuList dense disablePadding>
          <MenuItem
            onClick={() => {
              onView();
              closeMenu();
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="solar:eye-bold" style={{ width: 18, height: 18 }} />{' '}
              <Typography>View</Typography>
            </Stack>
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEdit();
              closeMenu();
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="solar:edit-bold" style={{ width: 18, height: 18 }} />{' '}
              <Typography>Edit</Typography>
            </Stack>
          </MenuItem>

          <MenuItem onClick={() => handleConfirmOpen('APPROVE')}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="solar:check-bold" style={{ width: 18, height: 18 }} />{' '}
              <Typography>Approve</Typography>
            </Stack>
          </MenuItem>

          <MenuItem onClick={() => handleConfirmOpen('REJECT')}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="solar:close-bold" style={{ width: 18, height: 18 }} />{' '}
              <Typography>Reject</Typography>
            </Stack>
          </MenuItem>

          <MenuItem onClick={() => handleConfirmOpen('REOPEN')}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="solar:reload-bold" style={{ width: 18, height: 18 }} />{' '}
              <Typography>Reopen</Typography>
            </Stack>
          </MenuItem>
        </MenuList>
      </Popover> */}
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 170,
            p: 0.5,
          },
        }}
      >
        <MenuList dense disablePadding>
          {/* VIEW */}
          <MenuItem
            onClick={() => {
              onView();
              closeMenu();
            }}
            sx={{ py: 1.2 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Iconify icon="solar:eye-bold" width={20} />
              <Typography variant="body2">View</Typography>
            </Stack>
          </MenuItem>

          {/* EDIT */}
          <MenuItem
            onClick={() => {
              onEdit();
              closeMenu();
            }}
            sx={{ py: 1.2 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Iconify icon="solar:pen-bold" width={20} color="#1976d2" />
              <Typography variant="body2">Edit</Typography>
            </Stack>
          </MenuItem>

          {/* APPROVE */}
          <MenuItem onClick={() => handleConfirmOpen('APPROVE')} sx={{ py: 1.2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Iconify icon="solar:check-circle-bold" width={20} color="#2e7d32" />
              <Typography variant="body2">Approve</Typography>
            </Stack>
          </MenuItem>

          {/* REJECT */}
          <MenuItem onClick={() => handleConfirmOpen('REJECT')} sx={{ py: 1.2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Iconify icon="solar:close-circle-bold" width={20} color="#d32f2f" />
              <Typography variant="body2">Reject</Typography>
            </Stack>
          </MenuItem>

          {/* REOPEN */}
          <MenuItem onClick={() => handleConfirmOpen('REOPEN')} sx={{ py: 1.2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Iconify icon="solar:refresh-bold" width={20} color="#ed6c02" />
              <Typography variant="body2">Reopen</Typography>
            </Stack>
          </MenuItem>
        </MenuList>
      </Popover>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>
          {confirmAction === 'APPROVE'
            ? 'Confirm Approve'
            : confirmAction === 'REJECT'
              ? 'Confirm Reject'
              : 'Confirm Reopen'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{' '}
            {confirmAction === 'APPROVE'
              ? 'approve'
              : confirmAction === 'REJECT'
                ? 'reject'
                : 'reopen'}{' '}
            Trip Sheet #{row.id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} disabled={processing}>
            Cancel
          </Button>
          <Button
            color={confirmAction === 'REJECT' ? 'error' : 'primary'}
            variant="contained"
            onClick={performStatusUpdate}
            disabled={processing}
          >
            {processing
              ? 'Processing...'
              : confirmAction === 'APPROVE'
                ? 'Approve'
                : confirmAction === 'REJECT'
                  ? 'Reject'
                  : 'Reopen'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
