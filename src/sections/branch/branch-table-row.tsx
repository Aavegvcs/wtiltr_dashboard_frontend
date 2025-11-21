import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { formatToCamelCase } from 'src/utils/utils';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

// EmployeeProps
export type BranchProps = {
  branchId: string;
  branchCode: string;               
  branchName: string;    
  companyId: string;                 
  stateId?: string | null;   
  stateName?: string;
  city: string;
  pincode?: string;
  isActive: boolean;
  address?: string;            
  email?: string;
  phone?: string;                   
  contactPerson?: string;
  panNumber?: string;
  activationDate?: Date;          
  regionalManagerId?: string;
  regionalManagerName?: string;
  controlBranchId?: string | null; 
  controlBranchName?: string | null; 
}

type BranchTableRowProps = {
  row: BranchProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit?: (row: BranchProps) => void; // Added onEdit prop
  onDelete?: (row: BranchProps) => void; // Added onEdit prop
};

export function BranchTableRow({
  row, 
  selected, 
  onSelectRow ,
  onEdit,
  onDelete

}: BranchTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  
  const handleEdit = () => {
    console.log("row",row)
    onEdit?.(row);
    handleClosePopover();
  };

  const handleDelete = () => {
    onDelete?.(row);
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

          <TableCell align="center">{row.branchCode || '-'}</TableCell>
         <TableCell align="center">{row.branchName || '-'}</TableCell>
         <TableCell align="center">{formatToCamelCase(row.phone) || '-'}</TableCell>
         <TableCell align="center">{row.email || '-'}</TableCell>
         <TableCell align="center">{row.contactPerson || '-'}</TableCell>
         <TableCell align="center">{row.controlBranchName || '-'}</TableCell>
         <TableCell align="center">{row.regionalManagerName || '-'}</TableCell>
         <TableCell align="center">{formatToCamelCase(row.stateName) || '-'}</TableCell>
         <TableCell align="center">
          <Label color={row.isActive ? 'success' : 'error'}>
            {row.isActive ? 'Active' : 'Inactive'}
           </Label>
         </TableCell>

         <TableCell align="center">           
          <IconButton onClick={handleEdit} color="primary">
             <Iconify icon="solar:pen-bold" />
          </IconButton>
           <IconButton onClick={handleDelete} color="error">
             <Iconify icon="solar:trash-bin-trash-bold" />
           </IconButton>
       </TableCell>

        
      </TableRow>

    </>
  );
}