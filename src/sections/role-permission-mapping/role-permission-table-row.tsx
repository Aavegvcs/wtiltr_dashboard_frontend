import {
  Box,
  MenuItem,
  Avatar,
  Popover,
  TableRow,
  Checkbox,
  MenuList,
  TableCell,
  IconButton,
  menuItemClasses,
} from '@mui/material';

import { useState, useCallback } from 'react';

import { Label } from 'src/components/label';
import { formatToCamelCase } from 'src/utils/utils';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type RolePermissionProps = {
  id: string;
  name: string;
  type: string;
  module: string;
  description: string;
  status: boolean;
};

type RolePermissionTableRowProps = {
  row: RolePermissionProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit?: (row: RolePermissionProps) => void;
  onDelete?: (row: RolePermissionProps) => void;
};

export function RolePermissionMappingTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete,
}: RolePermissionTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    onEdit?.(row);
    handleClosePopover();
  };
  const handleDelete = () => {
    onDelete?.(row); // Call onEdit with the row data
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align="center">{formatToCamelCase(row.name) || '-'}</TableCell>
        <TableCell align="center">{formatToCamelCase(row.type) || '-'}</TableCell>
        <TableCell align="center">{formatToCamelCase(row.module) || '-'}</TableCell>
        <TableCell align="center">{row.description || '-'}</TableCell>
        <TableCell align="center">
          <Label color={row.status ? 'success' : 'error'}>
            {row.status ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>
        <TableCell align="center">
          <IconButton onClick={handleEdit} color="primary">
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton onClick={handleDelete} color="error">
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
