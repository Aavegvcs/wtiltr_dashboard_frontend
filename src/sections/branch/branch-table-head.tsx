import React from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';

export type HeadLabel = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  minWidth?: number;
};

type Props = {
  orderBy: string;
  rowCount: number;
  numSelected: number;
  order: 'asc' | 'desc';
  onSort: (id: string) => void;
  headLabel: HeadLabel[];
  onSelectAllRows: (checked: boolean) => void;
};

export default function BranchTableHead({ order, onSort, orderBy, rowCount, headLabel, numSelected, onSelectAllRows }: Props) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(e) => onSelectAllRows(e.target.checked)}
          />
        </TableCell>
        {headLabel.map((h) => (
          <TableCell key={h.id} align={h.align || 'left'} sortDirection={orderBy === h.id ? order : false} sx={{ minWidth: h.minWidth }}>
            <TableSortLabel active={orderBy === h.id} direction={orderBy === h.id ? order : 'asc'} onClick={() => onSort(h.id)}>
              {h.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
