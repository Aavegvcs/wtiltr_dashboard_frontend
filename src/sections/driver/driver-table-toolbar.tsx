import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

import { Iconify } from 'src/components/iconify';

type DriverTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterStatus: 'all' | 'active' | 'inactive';
  onFilterStatus: (value: 'all' | 'active' | 'inactive') => void;
};

export function DriverTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  filterStatus,
  onFilterStatus,
}: DriverTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Search Input */}
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search driver..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />

          {/* Status Filter */}
          <Select
            value={filterStatus}
            onChange={(e) => onFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            size="small"
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </Stack>
      )}

      {/* Delete Selected */}
      {numSelected > 0 && (
        <Tooltip title="Delete Selected">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
