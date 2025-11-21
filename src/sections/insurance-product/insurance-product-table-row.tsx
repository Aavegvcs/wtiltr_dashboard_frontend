

import {
  Box,
  MenuItem,
  Avatar,
  Popover,
  TableRow,
  Checkbox,
  MenuList,
  TableCell,
  IconButton,
  menuItemClasses
} from '@mui/material';


import { useState, useCallback } from 'react';

import { Label } from 'src/components/label';
import { formatToCamelCase } from 'src/utils/utils';

import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------

export type InsuranceProductProps = {
  id: number;
  name: string;
  insuranceType: string;
   branchId?: string;
  branchName?: string;
  insuranceCompanyId: number;
  insuranceCompanyName?: string;
  insurancePrice: number;
  incentivePercentage: number;
  durationMonths: number;
  shortDescription: string;
  features: string;
  advantages: string;
  benefits: string;
  payoutPercentage: number;
  isActive: boolean;
};

type InsuranceProductTableRowProps = {
  row: InsuranceProductProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit?: (row: InsuranceProductProps) => void;
  onDelete?: (row: InsuranceProductProps) => void; 
};

export function InsuranceProductTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete
}: InsuranceProductTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    onEdit?.(row);
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

        <TableCell align="center">
          <Box gap={2} display="flex" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
            <Avatar alt={row.name} src="/default-product-icon.png" />
            {row.name}
          </Box>
        </TableCell>

        <TableCell align="center">{formatToCamelCase(row.insuranceType) || '-'}</TableCell>
        <TableCell align="center">{row.insuranceCompanyName || '-'}</TableCell>
        {/* <TableCell align="center">{row.insurancePrice || 0}</TableCell> */}
        {/* <TableCell align="center">{row.incentivePercentage || '-'}</TableCell> */}
        <TableCell align="center">{row.features || '-'}</TableCell>
        <TableCell align="center">{row.advantages || '-'}</TableCell>
        <TableCell align="center">{row.benefits || '-'}</TableCell>
        <TableCell align="center">{row.payoutPercentage || 0}</TableCell>
        <TableCell align="center">{row.shortDescription || '-'}</TableCell>
        {/* <TableCell align="center">{row.durationMonths || '-'}</TableCell> */}
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