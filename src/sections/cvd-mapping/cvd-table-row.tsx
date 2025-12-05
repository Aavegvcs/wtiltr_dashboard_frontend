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

// import { CvdMappingProps } from './types';

// type CvdTableRowProps = {
//   row: CvdMappingProps;
//   selected: boolean;
//   onSelectRow: () => void;
//   onEdit: (row: CvdMappingProps) => void;
//   onDelete: (row: CvdMappingProps) => void;
// };

// export function CvdTableRow({ row, selected, onSelectRow, onEdit, onDelete }: CvdTableRowProps) {
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

//         {/* Corporate */}
//         <TableCell align="center">{row.corporate?.corporateName || '-'}</TableCell>

//         {/* Branch */}
//         <TableCell align="center">{row.branch?.name || '-'}</TableCell>

//         {/* Vehicle */}
//         <TableCell align="center">
//           {row.vehicle?.vehicleNumber
//             ? `${row.vehicle.vehicleNumber} ${row.vehicle.vehicleName ? `(${row.vehicle.vehicleName})` : ''}`
//             : '-'}
//         </TableCell>

//         {/* Driver */}
//         <TableCell align="center">
//           {row.driver?.name
//             ? `${row.driver.name} ${row.driver.mobileNumber ? `(${row.driver.mobileNumber})` : ''}`
//             : '-'}
//         </TableCell>

//         {/* Status */}
//         <TableCell align="center">
//           <Label color={row.isActive ? 'success' : 'error'}>
//             {row.isActive ? 'Active' : 'Inactive'}
//           </Label>
//         </TableCell>

//         {/* Action */}
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
//             <Iconify icon="solar:trash-bin-trash-bold" color="red" style={{ marginRight: 8 }} />
//             Delete
//           </MenuItem>
//         </MenuList>
//       </Popover>
//     </>
//   );
// }
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

import { CvdMappingProps } from './types';

type Props = {
  row: CvdMappingProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: (row: CvdMappingProps) => void;
  onDelete: (row: CvdMappingProps) => void;
};

export function CvdTableRow({ row, selected, onSelectRow, onEdit, onDelete }: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const openMenu = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(e.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    closeMenu();
    onEdit(row);
  };

  const handleDelete = () => {
    closeMenu();
    onDelete(row);
  };

  return (
    // <>
    //   <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>

    //     {/* Checkbox */}
    //     <TableCell padding="checkbox">
    //       <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
    //     </TableCell>

    //     {/* Corporate */}
    //     <TableCell align="center">
    //       {row.corporate?.corporateName || '-'}
    //     </TableCell>

    //     {/* Branch */}
    //     <TableCell align="center">
    //       {row.branch?.name || '-'}
    //     </TableCell>

    //     {/* Vehicle */}
    //     <TableCell align="center">
    //       {row.vehicle?.vehicleNumber
    //         ? `${row.vehicle.vehicleNumber}${row.vehicle.vehicleName ? ` (${row.vehicle.vehicleName})` : ''}`
    //         : '-'}
    //     </TableCell>

    //     {/* Driver */}
    //     <TableCell align="center">
    //       {row.driver?.name
    //         ? `${row.driver.name}${row.driver.mobileNumber ? ` (${row.driver.mobileNumber})` : ''}`
    //         : '-'}
    //     </TableCell>

    //     {/* Status */}
    //     <TableCell align="center">
    //       <Label color={row.isActive ? 'success' : 'error'}>
    //         {row.isActive ? 'Active' : 'Inactive'}
    //       </Label>
    //     </TableCell>

    //     {/* Action */}
    //     <TableCell align="center">
    //       <IconButton onClick={openMenu}>
    //         <Iconify icon="solar:menu-dots-bold" />
    //       </IconButton>
    //     </TableCell>

    //   </TableRow>

    //   {/* Menu */}
    //   <Popover
    //     open={!!openPopover}
    //     anchorEl={openPopover}
    //     onClose={closeMenu}
    //     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    //   >
    //     <MenuList dense disablePadding>

    //       <MenuItem onClick={handleEdit}>
    //         <Iconify icon="solar:pen-bold" style={{ marginRight: 8 }} />
    //         Edit
    //       </MenuItem>

    //       {/* <MenuItem onClick={handleDelete}>
    //         <Iconify icon="solar:trash-bin-trash-bold" color="red" style={{ marginRight: 8 }} />
    //         Delete
    //       </MenuItem> */}

    //     </MenuList>
    //   </Popover>
    // </>
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* Checkbox */}
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        {/* Corporate */}
        <TableCell align="center">{row.corporate?.corporateName || '-'}</TableCell>

        {/* Branch */}
        <TableCell align="center">{row.branch?.name || '-'}</TableCell>

        {/* Vehicle */}
        <TableCell align="center">
          {row.vehicle?.vehicleNumber
            ? `${row.vehicle.vehicleNumber}${row.vehicle.vehicleName ? ` (${row.vehicle.vehicleName})` : ''}`
            : '-'}
        </TableCell>

        {/* Driver */}
        <TableCell align="center">
          {row.driver?.name
            ? `${row.driver.name}${row.driver.mobileNumber ? ` (${row.driver.mobileNumber})` : ''}`
            : '-'}
        </TableCell>

        {/* Status */}
        <TableCell align="center">
          <Label color={row.isActive ? 'success' : 'error'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        {/* DIRECT EDIT BUTTON */}
        <TableCell align="center">
          <IconButton color="primary" onClick={() => onEdit(row)}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
