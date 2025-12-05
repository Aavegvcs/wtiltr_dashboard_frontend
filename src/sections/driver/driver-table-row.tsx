// import { useState, useCallback } from 'react';

// import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import TableCell from '@mui/material/TableCell';
// import IconButton from '@mui/material/IconButton';
// import MenuItem from '@mui/material/MenuItem';
// import MenuList from '@mui/material/MenuList';
// import Popover from '@mui/material/Popover';

// import { Iconify } from 'src/components/iconify';
// import { Label } from 'src/components/label';

// import { DriverProps } from './types';

// type DriverTableRowProps = {
//   row: DriverProps;
//   selected: boolean;
//   onSelectRow: () => void;
//   onEdit: (row: DriverProps) => void;
//   onDelete: (row: DriverProps) => void;
// };

// export function DriverTableRow({
//   row,
//   selected,
//   onSelectRow,
//   onEdit,
//   onDelete,
// }: DriverTableRowProps) {
//   const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

//   const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
//     setOpenPopover(event.currentTarget);
//   }, []);

//   const handleClosePopover = useCallback(() => {
//     setOpenPopover(null);
//   }, []);

//   const handleEditClick = () => {
//     onEdit?.(row);
//     handleClosePopover();
//   };

//   const handleDeleteClick = () => {
//     onDelete?.(row);
//     handleClosePopover();
//   };

//   return (
//     <>
//       <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
//         <TableCell padding="checkbox">
//           <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
//         </TableCell>

//         {/* Name */}
//         <TableCell align="center">{row.name || '-'}</TableCell>

//         {/* Mobile */}
//         <TableCell align="center">{row.mobileNumber || '-'}</TableCell>

//         {/* PAN */}
//         <TableCell align="center">{row.panNumber || '-'}</TableCell>

//         {/* Status */}
//         <TableCell align="center">
//           <Label color={row.isActive ? 'success' : 'error'}>
//             {row.isActive ? 'Active' : 'Inactive'}
//           </Label>
//         </TableCell>

//         {/* Action Menu */}
//         <TableCell align="center">
//           <IconButton onClick={handleOpenPopover}>
//             <Iconify icon="solar:menu-dots-bold" />
//           </IconButton>
//         </TableCell>
//       </TableRow>

//       {/* Popover Actions */}
//       <Popover
//         open={!!openPopover}
//         anchorEl={openPopover}
//         onClose={handleClosePopover}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <MenuList dense disablePadding>
//           <MenuItem onClick={handleEditClick}>
//             <Iconify icon="solar:pen-bold" style={{ marginRight: 8 }} /> Edit
//           </MenuItem>

//           <MenuItem onClick={handleDeleteClick}>
//             <Iconify
//               icon="solar:trash-bin-trash-bold"
//               color="red"
//               style={{ marginRight: 8 }}
//             />
//             Delete
//           </MenuItem>
//         </MenuList>
//       </Popover>
//     </>
//   );
// }
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { DriverProps } from './types';

type DriverTableRowProps = {
  row: DriverProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: (row: DriverProps) => void;
};

export function DriverTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
}: DriverTableRowProps) {
  const handleEditClick = () => {
    onEdit?.(row);
  };

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
      </TableCell>

      {/* Name */}
      <TableCell align="center">{row.name || '-'}</TableCell>

      {/* Mobile */}
      <TableCell align="center">{row.mobileNumber || '-'}</TableCell>

      {/* PAN */}
      <TableCell align="center">{row.panNumber || '-'}</TableCell>

      {/* Status */}
      <TableCell align="center">
        <Label color={row.isActive ? 'success' : 'error'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Label>
      </TableCell>

      {/* Only Edit Icon */}
      <TableCell align="center">
        <IconButton onClick={handleEditClick} color="primary">
          <Iconify icon="solar:pen-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
