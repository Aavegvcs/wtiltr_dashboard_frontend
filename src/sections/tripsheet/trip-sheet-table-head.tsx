import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { visuallyHidden } from '../cvd-mapping/utils';

type HeadLabel = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
};

type Props = {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  numSelected: number;
  onSort: (id: string) => void;
  onSelectAllRows: (checked: boolean) => void;
  headLabel: HeadLabel[];
};

export function TripSheetTableHead({ order, orderBy, rowCount, numSelected, onSort, onSelectAllRows, headLabel }: Props) {
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
          <TableCell key={h.id} align={h.align || 'center'} sortDirection={orderBy === h.id ? order : false}>
            <TableSortLabel active={orderBy === h.id} direction={orderBy === h.id ? order : 'asc'} onClick={() => onSort(h.id)}>
              {h.label}
              {orderBy === h.id && <Box component="span" sx={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
