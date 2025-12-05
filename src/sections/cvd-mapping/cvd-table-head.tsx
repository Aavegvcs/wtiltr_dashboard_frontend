// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import TableSortLabel from '@mui/material/TableSortLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Box from '@mui/material/Box';
// import { visuallyHidden } from './utils';

// type HeadLabel = {
//   id: string;
//   label: string;
//   align?: 'left' | 'center' | 'right';
// };

// type CvdTableHeadProps = {
//   order: 'asc' | 'desc';
//   orderBy: string;
//   rowCount: number;
//   numSelected: number;
//   onSort: (id: string) => void;
//   onSelectAllRows: (checked: boolean) => void;
//   headLabel: HeadLabel[];
// };

// export function CvdTableHead({
//   order,
//   orderBy,
//   rowCount,
//   numSelected,
//   onSort,
//   onSelectAllRows,
//   headLabel,
// }: CvdTableHeadProps) {
//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell padding="checkbox">
//           <Checkbox
//             indeterminate={numSelected > 0 && numSelected < rowCount}
//             checked={rowCount > 0 && numSelected === rowCount}
//             onChange={(e) => onSelectAllRows(e.target.checked)}
//           />
//         </TableCell>

//         {headLabel.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.align || 'center'}
//             sortDirection={orderBy === headCell.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : 'asc'}
//               onClick={() => onSort(headCell.id)}
//               sx={{ fontWeight: 'bold' }}
//             >
//               {headCell.label}
//               {orderBy === headCell.id && (
//                 <Box component="span" sx={visuallyHidden}>
//                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                 </Box>
//               )}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { visuallyHidden } from './utils';

type HeadLabel = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
};

type CvdTableHeadProps = {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  numSelected: number;
  onSort: (id: string) => void;
  onSelectAllRows: (checked: boolean) => void;
  headLabel: HeadLabel[];
};

export function CvdTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onSort,
  onSelectAllRows,
  headLabel,
}: CvdTableHeadProps) {

  const onSortClick = (id: string) => {
    onSort(id);
  };

  return (
    <TableHead>
      <TableRow>

        {/* Select All */}
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(e) => onSelectAllRows(e.target.checked)}
          />
        </TableCell>

        {/* Columns */}
        {headLabel.map((column) => (
          <TableCell
            key={column.id}
            align={column.align || 'center'}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={() => onSortClick(column.id)}
              sx={{ fontWeight: 'bold' }}
            >
              {column.label}

              {orderBy === column.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}

      </TableRow>
    </TableHead>
  );
}
