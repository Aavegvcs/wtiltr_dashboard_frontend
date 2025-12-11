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

// type Props = {
//   row: CvdMappingProps;
//   selected: boolean;
//   onSelectRow: () => void;
//   onEdit: (row: CvdMappingProps) => void;
//   onDelete: (row: CvdMappingProps) => void;
// };

// export function CvdTableRow({ row, selected, onSelectRow, onEdit, onDelete }: Props) {
//   const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

//   const openMenu = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
//     setOpenPopover(e.currentTarget);
//   }, []);

//   const closeMenu = useCallback(() => {
//     setOpenPopover(null);
//   }, []);

//   const handleEdit = () => {
//     closeMenu();
//     onEdit(row);
//   };

//   const handleDelete = () => {
//     closeMenu();
//     onDelete(row);
//   };

//   return (
//     // <>
//     //   <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>

//     //     {/* Checkbox */}
//     //     <TableCell padding="checkbox">
//     //       <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
//     //     </TableCell>

//     //     {/* Corporate */}
//     //     <TableCell align="center">
//     //       {row.corporate?.corporateName || '-'}
//     //     </TableCell>

//     //     {/* Branch */}
//     //     <TableCell align="center">
//     //       {row.branch?.name || '-'}
//     //     </TableCell>

//     //     {/* Vehicle */}
//     //     <TableCell align="center">
//     //       {row.vehicle?.vehicleNumber
//     //         ? `${row.vehicle.vehicleNumber}${row.vehicle.vehicleName ? ` (${row.vehicle.vehicleName})` : ''}`
//     //         : '-'}
//     //     </TableCell>

//     //     {/* Driver */}
//     //     <TableCell align="center">
//     //       {row.driver?.name
//     //         ? `${row.driver.name}${row.driver.mobileNumber ? ` (${row.driver.mobileNumber})` : ''}`
//     //         : '-'}
//     //     </TableCell>

//     //     {/* Status */}
//     //     <TableCell align="center">
//     //       <Label color={row.isActive ? 'success' : 'error'}>
//     //         {row.isActive ? 'Active' : 'Inactive'}
//     //       </Label>
//     //     </TableCell>

//     //     {/* Action */}
//     //     <TableCell align="center">
//     //       <IconButton onClick={openMenu}>
//     //         <Iconify icon="solar:menu-dots-bold" />
//     //       </IconButton>
//     //     </TableCell>

//     //   </TableRow>

//     //   {/* Menu */}
//     //   <Popover
//     //     open={!!openPopover}
//     //     anchorEl={openPopover}
//     //     onClose={closeMenu}
//     //     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//     //   >
//     //     <MenuList dense disablePadding>

//     //       <MenuItem onClick={handleEdit}>
//     //         <Iconify icon="solar:pen-bold" style={{ marginRight: 8 }} />
//     //         Edit
//     //       </MenuItem>

//     //       {/* <MenuItem onClick={handleDelete}>
//     //         <Iconify icon="solar:trash-bin-trash-bold" color="red" style={{ marginRight: 8 }} />
//     //         Delete
//     //       </MenuItem> */}

//     //     </MenuList>
//     //   </Popover>
//     // </>
//     <>
//       <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
//         {/* Checkbox */}
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
//             ? `${row.vehicle.vehicleNumber}${row.vehicle.vehicleName ? ` (${row.vehicle.vehicleName})` : ''}`
//             : '-'}
//         </TableCell>

//         {/* Driver */}
//         <TableCell align="center">
//           {row.driver?.name
//             ? `${row.driver.name}${row.driver.mobileNumber ? ` (${row.driver.mobileNumber})` : ''}`
//             : '-'}
//         </TableCell>

//         {/* Status */}
//         <TableCell align="center">
//           <Label color={row.isActive ? 'success' : 'error'}>
//             {row.isActive ? 'Active' : 'Inactive'}
//           </Label>
//         </TableCell>

//         {/* DIRECT EDIT BUTTON */}
//         <TableCell align="center">
//           <IconButton color="primary" onClick={() => onEdit(row)}>
//             <Iconify icon="solar:pen-bold" />
//           </IconButton>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }
import { useState, useCallback } from 'react';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Switch } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import axiosInstance from 'src/config-global';
import toast from 'react-hot-toast';

import { CvdMappingProps } from './types';

type Props = {
  row: CvdMappingProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: (row: CvdMappingProps) => void;
  onDelete: (row: CvdMappingProps) => void;
  refreshData?: () => void; // NEW
};

export function CvdTableRow({ row, selected, onSelectRow, onEdit, onDelete, refreshData }: Props) {
  // ------------------------------------------
  // HANDLE STATUS TOGGLE
  // ------------------------------------------
  // const handleStatusToggle = async () => {
  //   try {
  //     const newStatus = !row.isActive;

  //     const res = await axiosInstance.patch(`/cvd-mapping/change-status/${row.id}`, {
  //       isActive: newStatus,
  //     });
  //     console.log('Status Toggle Response:', res.data);

  //     // ❌ BACKEND ERROR
  //     if (res.data?.status === false) {
  //       toast.error(res.data.message || 'Status update failed');
  //       return;
  //     }

  //     toast.success('Status updated');

  //     // UI Refresh
  //     refreshData && refreshData();
  //   } catch (err: any) {
  //     console.error(err);
  //     toast.error(err.response?.data?.message || 'Status update failed');
  //   }
  // };
  const handleStatusToggle = async () => {
    try {
      const newStatus = !row.isActive;

      const res = await axiosInstance.patch(`/cvd-mapping/change-status/${row.id}`, {
        isActive: newStatus,
      });

      const api = res.data?.data; // decrypted inner response

      if (!api?.status) {
        toast.error(api?.message || 'Status update failed');
        return;
      }

      toast.success(api?.message || 'Status updated');
      refreshData && refreshData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
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
            ? `${row.vehicle.vehicleNumber}${
                row.vehicle.vehicleName ? ` (${row.vehicle.vehicleName})` : ''
              }`
            : '-'}
        </TableCell>

        {/* Driver */}
        <TableCell align="center">
          {row.driver?.name
            ? `${row.driver.name}${row.driver.mobileNumber ? ` (${row.driver.mobileNumber})` : ''}`
            : '-'}
        </TableCell>

        {/* STATUS TOGGLE */}
        <TableCell align="center">
          <Switch
            checked={row.isActive}
            onChange={handleStatusToggle}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'green', // Thumb color when active
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'green', // Track color when active
              },

              '& .MuiSwitch-switchBase': {
                color: 'red', // Thumb color when inactive
              },
              '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                backgroundColor: 'red', // Track color when inactive
              },
            }}
          />
        </TableCell>

        {/* EDIT BUTTON */}
        <TableCell align="center">
          <IconButton color="primary" onClick={() => onEdit(row)}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
