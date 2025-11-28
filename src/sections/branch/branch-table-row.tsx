import React from 'react';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import { BranchItem } from './types';
import { Label } from 'src/components/label';

export type BranchTableRowProps = {
  row: BranchItem;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
};

export default function BranchTableRow({ row, selected, onSelectRow, onEdit, onDelete, onToggleStatus }: BranchTableRowProps) {
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox"><Checkbox checked={selected} onChange={onSelectRow} /></TableCell>
      <TableCell align="center">{row.id}</TableCell>
      <TableCell align="center">{row.branchCode}</TableCell>
      <TableCell align="center">{row.corporateName ?? '-'}</TableCell>
      <TableCell align="center">{row.name ?? '-'}</TableCell>
      <TableCell align="center">{row.stateName ?? '-'}</TableCell>
      <TableCell align="center">{row.city ?? '-'}</TableCell>
      <TableCell align="center">
        <Label color={row.isActive ? 'success' : 'error'}>{row.isActive ? 'Active' : 'Inactive'}</Label>
      </TableCell>
      <TableCell align="center">
        <IconButton onClick={onEdit}><Iconify icon="solar:pen-bold" /></IconButton>
        {/* <IconButton onClick={onToggleStatus}><Iconify icon="mdi:toggle-switch" /></IconButton> */}
        <IconButton onClick={onDelete} color="error"><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
      </TableCell>
    </TableRow>
  );
}
