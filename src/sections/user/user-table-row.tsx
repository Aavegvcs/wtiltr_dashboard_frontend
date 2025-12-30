import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { formatToCamelCase } from 'src/utils/utils';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

export type EmployeeProps = {
  user_id: number; // Matches API's "user_id"
  name: string;
  empCode?: string; // Maps to "code" (optional if not always present)
  phoneNumber?: string; // Maps to "contact"
  email: string;
  roleId: number; // Could map to "role" as a number
  roleName: string;
  status: string;
  isActive: boolean;
  companyName: string; // Maps to "company"
  avatarUrl?: string; // Optional, not in API
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  branchId?: string;
  corporateId: number;
  userType: string;
  firstName?: string;
  lastName?: string;
  middleName?: string; // Added
  designation?: string; // Added
  salary?: string; // Added
  dateOfJoining?: string; // Added
  probation?: string; // Added
  leaveDays?: string; // Added
  departmentId?: string; // Added
  roId?: string;
  roName?: string;
};
type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={row.avatarUrl} />
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.company}</TableCell>

        <TableCell>{row.role}</TableCell>

        <TableCell align="center">
          {row.isVerified ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell>
          <Label color={(row.status === 'banned' && 'error') || 'success'}>{row.status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

type InsuranceUserTableRowProps = {
  row: EmployeeProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit?: (row: EmployeeProps) => void; // Added onEdit prop
  onDelete?: (row: EmployeeProps) => void; // Added onEdit prop
};
// Updated InsuranceUserTableRow component

// new code
export function InsuranceUserTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete,
}: // {
// row: EmployeeProps;
// selected: boolean;
// onSelectRow: () => void;
// onEdit?: (row: EmployeeProps) => void;
// onDelete?: (row: EmployeeProps) => void;
//}
InsuranceUserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    console.log("row",row)
    onEdit?.(row);
    handleClosePopover();
  };

  const handleDelete = () => {
    onDelete?.(row);
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align="center">
          <Box gap={2} display="flex" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
            <Avatar alt={row.name} src={row.avatarUrl || '/default-avatar.png'} />
            {row.name}
          </Box>
        </TableCell>

        <TableCell align="center">{row.empCode || '-'}</TableCell>
        <TableCell align="center">{row.phoneNumber || '-'}</TableCell>
        <TableCell>{row.email || '-'}</TableCell>
        <TableCell align="center">{formatToCamelCase(row.roleName) || '-'}</TableCell>
        <TableCell align="center">{row.dateOfBirth || '-'}</TableCell>
        <TableCell align="center">{row.gender || '-'}</TableCell>
        <TableCell align="center">{row.roName || '-'}</TableCell>
        <TableCell align="center">
          <Label color={row.isActive ? 'success' : 'error'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        {/* <TableCell align="center">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}

        <TableCell align="center">
          <IconButton onClick={handleEdit} color="primary">
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton onClick={handleDelete} color="error">
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>
      {/* 
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover> */}
    </>
  );
}
