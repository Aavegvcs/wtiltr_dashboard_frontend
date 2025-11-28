// import Box from '@mui/material/Box';
// import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import TableHead from '@mui/material/TableHead';
// import TableCell from '@mui/material/TableCell';
// import TableSortLabel from '@mui/material/TableSortLabel';

// import { visuallyHidden } from './utils';

// // ----------------------------------------------------------------------

// type CorporateTableHeadProps = {
//   orderBy: string;
//   rowCount: number;
//   numSelected: number;
//   order: 'asc' | 'desc';
//   onSort: (id: string) => void;
//   headLabel: Record<string, any>[];
//   onSelectAllRows: (checked: boolean) => void;
// };

// export function CorporateTableHead({
//   order,
//   onSort,
//   orderBy,
//   rowCount,
//   headLabel,
//   numSelected,
//   onSelectAllRows,
// }: CorporateTableHeadProps) {
//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell padding="checkbox">
//           <Checkbox
//             indeterminate={numSelected > 0 && numSelected < rowCount}
//             checked={rowCount > 0 && numSelected === rowCount}
//             onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//               onSelectAllRows(event.target.checked)
//             }
//           />
//         </TableCell>

//         {headLabel.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.align || 'left'}
//             sortDirection={orderBy === headCell.id ? order : false}
//             sx={{ width: headCell.width, minWidth: headCell.minWidth }}
//           >
//             {headCell.sortable === false ? (
//               headCell.label
//             ) : (
//               <TableSortLabel
//                 hideSortIcon
//                 active={orderBy === headCell.id}
//                 direction={orderBy === headCell.id ? order : 'asc'}
//                 onClick={() => onSort(headCell.id)}
//               >
//                 {headCell.label}
//                 {orderBy === headCell.id ? (
//                   <Box sx={{ ...visuallyHidden }}>
//                     {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                   </Box>
//                 ) : null}
//               </TableSortLabel>
//             )}
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }
// src/views/corporate/corporate-table-head.tsx
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from './utils';
import Box from '@mui/material/Box';

type HeadLabel = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
};

type CorporateTableHeadProps = {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  numSelected: number;
  onSort: (id: string) => void;
  onSelectAllRows: (checked: boolean) => void;
  headLabel: HeadLabel[];
};

export function CorporateTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onSort,
  onSelectAllRows,
  headLabel,
}: CorporateTableHeadProps) {
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

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'center'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={() => onSort(headCell.id)}
              sx={{ fontWeight: 'bold' }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}