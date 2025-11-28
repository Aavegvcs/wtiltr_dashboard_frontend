import { useState, useCallback } from 'react';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { formatToCamelCase } from 'src/utils/utils';
import { CorporateProps } from './types';
// ----------------------------------------------------------------------

type CorporateTableRowProps = {
  row: CorporateProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: (row: CorporateProps) => void;
  onDelete: (row: CorporateProps) => void;
};

export function CorporateTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete,
}: CorporateTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEditClick = () => {
    onEdit?.(row);
    handleClosePopover();
  };

  const handleDeleteClick = () => {
    onDelete?.(row);
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align="center">{row.corporateCode || '-'}</TableCell>
        <TableCell align="center">{row.corporateName || '-'}</TableCell>
        <TableCell align="center">{row.phoneNumber || '-'}</TableCell>
        <TableCell align="center">{row.email || '-'}</TableCell>
        <TableCell align="center">
          {formatToCamelCase(typeof row.state === 'object' ? row.state?.name : row.state) || '-'}
        </TableCell>

        <TableCell align="center">
          {formatToCamelCase(typeof row.country === 'object' ? row.country?.name : row.country) ||
            '-'}
        </TableCell>

        <TableCell align="center">
          <Label color={row.isActive ? 'success' : 'error'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="solar:menu-dots-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Action Menu */}
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuList dense disablePadding>
          <MenuItem onClick={handleEditClick}>
            <Iconify icon="solar:pen-bold" style={{ marginRight: 8 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <Iconify icon="solar:trash-bin-trash-bold" color="red" style={{ marginRight: 8 }} />{' '}
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

