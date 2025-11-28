import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export default function TableEmptyRows({ emptyRows, height = 68 }: { emptyRows: number; height?: number }) {
  if (!emptyRows) return null;
  return (
    <TableRow sx={{ height: emptyRows * height }}>
      <TableCell colSpan={9} />
    </TableRow>
  );
}
