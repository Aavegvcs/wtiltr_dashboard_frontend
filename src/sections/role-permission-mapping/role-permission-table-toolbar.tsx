import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import {
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Form } from 'react-router-dom';
import { InsuranceModuleType, InsurancePermissionType } from './view/types';

// ----------------------------------------------------------------------

type RolePermissionTableToolbarProps = {
  numSelected: number;
  filterName: string;
  filterType: string;
  filterModule: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterType: (event: SelectChangeEvent) => void;
  onFilterModule: (event: SelectChangeEvent) => void;
};

export function RolePermissionTableToolbar({
  numSelected,
  filterName,
  filterType,
  filterModule,
  onFilterName,
  onFilterType,
  onFilterModule,
}: RolePermissionTableToolbarProps) {
  return (
    <Toolbar
      // sx={{
      //   height: 96,
      //   display: 'flex',
      //   justifyContent: 'space-between',
      //   p: (theme) => theme.spacing(0, 1, 0, 3),
      //   ...(numSelected > 0 && {
      //     color: 'primary.main',
      //     bgcolor: 'primary.lighter',
      //   }),
      // }}
      sx={{
    height: { xs: 'auto', md: 96 }, // Responsive height
    alignItems: 'center',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' }, // Stack items on mobile
    gap: 2,
    justifyContent: 'space-between',
    p: (theme) => theme.spacing(2),
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <OutlinedInput
              fullWidth
              value={filterName}
              onChange={onFilterName}
              placeholder="Search permission..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ maxWidth: 320 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter By Type</InputLabel>
              <Select value={filterType} label="Filter By Type" onChange={onFilterType}>
                <MenuItem value="AllTypes">All Types</MenuItem>
                {/* {Object.values(InsurancePermissionType).map((type) => {
                  return <MenuItem value={type}>{type}</MenuItem>;
                })} */}
                {Object.values(InsurancePermissionType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter By Module</InputLabel>
              <Select value={filterModule} label="Filter By Module" onChange={onFilterModule}>
                <MenuItem value="AllModules">All Module</MenuItem>
                {/* {Object.values(InsuranceModuleType).map((module) => {
                  return <MenuItem value={module}>{module}</MenuItem>;
                })} */}
                {Object.values(InsuranceModuleType).map((module) => (
                  <MenuItem key={module} value={module}>
                    {module}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      )}
      {/* : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
}
