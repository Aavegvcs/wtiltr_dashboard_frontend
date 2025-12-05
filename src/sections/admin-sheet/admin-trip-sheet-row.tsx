import { TableRow, TableCell, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import Checkbox from '@mui/material/Checkbox';

export function AdminTripSheetRow({ row, onView }: any) {
  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox disableRipple  />
      </TableCell>

      <TableCell align="center">{row.id}</TableCell>

      <TableCell align="center">{row.corporate?.corporateName || '-'}</TableCell>

      <TableCell align="center">{row.branch?.name || '-'}</TableCell>

      <TableCell align="center">
        {row.driver ? `${row.driver.name} (${row.driver.mobileNumber})` : '-'}
      </TableCell>

      <TableCell align="center">
        {row.vehicle
          ? `${row.vehicle.vehicleNumber}${
              row.vehicle.vehicleName ? ` (${row.vehicle.vehicleName})` : ''
            }`
          : '-'}
      </TableCell>

      <TableCell align="center">
        {row.tripDate ? new Date(row.tripDate).toLocaleDateString() : '-'}
      </TableCell>

      <TableCell align="center">{row.totalKm ?? '-'}</TableCell>

      {/* Fixed status — only approved rows appear */}
      <TableCell align="center">Approved</TableCell>

      {/* Only View button */}
      <TableCell align="center">
        <IconButton onClick={onView}>
          <Iconify icon="solar:eye-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
