import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function TableNoData({ searchQuery }: { searchQuery: string }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={9}>
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h6">Not found</Typography>
          <Typography>No results found for <strong>&quot;{searchQuery}&quot;</strong></Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
