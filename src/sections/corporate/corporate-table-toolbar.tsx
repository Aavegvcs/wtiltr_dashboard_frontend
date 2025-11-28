// import Tooltip from '@mui/material/Tooltip';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputAdornment from '@mui/material/InputAdornment';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
// import { Iconify } from 'src/components/iconify';

// // ----------------------------------------------------------------------

// type CorporateTableToolbarProps = {
//   numSelected: number;
//   filterName: string;
//   onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   filterStatus: string;
//   onFilterStatus: (event: any) => void;
//   onDeleteSelected?: () => void;
// };

// export function CorporateTableToolbar({
//   numSelected,
//   filterName,
//   onFilterName,
//   filterStatus,
//   onFilterStatus,
//   onDeleteSelected,
// }: CorporateTableToolbarProps) {
//   const statusOptions = [
//     { label: 'All', value: '' },
//     { label: 'Active', value: 'active' },
//     { label: 'Inactive', value: 'inactive' },
//   ];

//   return (
//     <Toolbar
//       sx={{
//         height: 96,
//         display: 'flex',
//         justifyContent: 'space-between',
//         p: (theme) => theme.spacing(0, 2, 0, 3),
//         ...(numSelected > 0 && {
//           color: 'primary.main',
//           bgcolor: 'primary.lighter',
//         }),
//       }}
//     >
//       {/* Left Section */}
//       {numSelected > 0 ? (
//         <Typography component="div" variant="subtitle1">
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Stack direction="row" spacing={2} alignItems="center">
//           {/* Search Field */}
//           <OutlinedInput
//             value={filterName}
//             onChange={onFilterName}
//             placeholder="Search corporate..."
//             startAdornment={
//               <InputAdornment position="start">
//                 <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
//               </InputAdornment>
//             }
//             sx={{ maxWidth: 280 }}
//           />

//           {/* Status Filter */}
//           <Select
//             value={filterStatus}
//             onChange={onFilterStatus}
//             displayEmpty
//             size="small"
//             sx={{ width: 160 }}
//           >
//             {statusOptions.map((item) => (
//               <MenuItem key={item.value} value={item.value}>
//                 {item.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </Stack>
//       )}

//       {/* Right Section (Action Icons) */}
//       {numSelected > 0 ? (
//         <Tooltip title="Delete Selected">
//           <IconButton onClick={onDeleteSelected}>
//             <Iconify icon="solar:trash-bin-trash-bold" />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <Tooltip title="Filter Options">
//           <IconButton>
//             <Iconify icon="ic:round-filter-list" />
//           </IconButton>
//         </Tooltip>
//       )}
//     </Toolbar>
//   );
// }
// src/views/corporate/corporate-table-toolbar.tsx
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

type CorporateTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterStatus: 'all' | 'active' | 'inactive';
  onFilterStatus: (value: 'all' | 'active' | 'inactive') => void;
};

export function CorporateTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  filterStatus,
  onFilterStatus,
}: CorporateTableToolbarProps) {
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
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search corporate..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />

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
