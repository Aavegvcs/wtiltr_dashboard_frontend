import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type CompanyProps = {
  id: number;
  companyName: string;
  companyAddress: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  secondaryContactPerson: string;
  secondaryContactNumber: string;
  secondaryEmail: string;
  isActive: boolean;
};

type InsuranceCompanyTableRowProps = {
  row: CompanyProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit?: (row: CompanyProps) => void; 
  onDelete?: (row: CompanyProps) => void; 
};

export function InsuranceCompanyTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete
}: InsuranceCompanyTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    onEdit?.(row); // Call onEdit with the row data
    handleClosePopover();
  };
  const handleDelete = () => {
    onDelete?.(row); // Call onEdit with the row data
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align="center">{row.companyName || '-'}</TableCell>
        <TableCell align="center">{row.contactPerson || '-'}</TableCell>
        <TableCell align="center">{row.contactNumber || '-'}</TableCell>
        <TableCell align="center">{row.email || row.email || '-'}</TableCell>
         <TableCell align="center">{row.secondaryContactPerson || row.secondaryContactPerson || '-'}</TableCell>
        <TableCell align="center">{row.secondaryContactNumber || row.secondaryContactNumber || '-'}</TableCell>
        <TableCell align="center">{row.secondaryEmail || row.secondaryEmail || '-'}</TableCell>
        {/* <TableCell >{row.companyAddress || row.companyAddress || '-'}</TableCell> */}
        <TableCell align="center">
          <Label color={row.isActive ? 'success' : 'error'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        {/* <TableCell align="center">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}

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
