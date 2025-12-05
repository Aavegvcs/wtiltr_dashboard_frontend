// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputAdornment from '@mui/material/InputAdornment';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Stack from '@mui/material/Stack';
// import { Iconify } from 'src/components/iconify';

// type Props = {
//   numSelected: number;
//   filterName: string;
//   onFilterName: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   filterStatus: string;
//   onFilterStatus: (v: any) => void;
// };

// export function TripSheetToolbar({ numSelected, filterName, onFilterName, filterStatus, onFilterStatus }: Props) {
//   return (
//     <Toolbar sx={{ height: 96, display: 'flex', justifyContent: 'space-between', p: (t) => t.spacing(0, 1, 0, 3) }}>
//       <Stack direction="row" spacing={2} alignItems="center">
//         <OutlinedInput
//           value={filterName}
//           onChange={onFilterName}
//           placeholder="Search mapping..."
//           startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} /></InputAdornment>}
//           sx={{ maxWidth: 360 }}
//         />

//         <Select value={filterStatus} onChange={(e) => onFilterStatus(e.target.value)} size="small" sx={{ minWidth: 160 }}>
//           <MenuItem value="all">All status</MenuItem>
//           <MenuItem value="created">Created</MenuItem>
//           <MenuItem value="submitted">Submitted</MenuItem>
//           <MenuItem value="approved">Approved</MenuItem>
//         </Select>
//       </Stack>

//       <Typography variant="subtitle1" color="text.secondary">{numSelected} selected</Typography>
//     </Toolbar>
//   );
// }
// ------------------------------------------------------
// TripSheetToolbar.tsx  (UPDATED WITH DATE FILTER)
// ------------------------------------------------------
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputAdornment from '@mui/material/InputAdornment';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
// import { Iconify } from 'src/components/iconify';

// type Props = {
//   numSelected: number;
//   filterName: string;
//   onFilterName: (e: React.ChangeEvent<HTMLInputElement>) => void;

//   filterStatus: string;
//   onFilterStatus: (v: any) => void;

//   fromDate: string;
//   toDate: string;
//   onFromDate: (v: string) => void;
//   onToDate: (v: string) => void;
// };

// export function TripSheetToolbar({
//   numSelected,
//   filterName,
//   onFilterName,
//   filterStatus,
//   onFilterStatus,
//   fromDate,
//   toDate,
//   onFromDate,
//   onToDate
// }: Props) {
//   return (
//     <Toolbar
//       sx={{
//         height: 96,
//         display: 'flex',
//         justifyContent: 'space-between',
//         p: (t) => t.spacing(0, 1, 0, 3),
//       }}
//     >
//       <Stack direction="row" spacing={2} alignItems="center">
//         {/* Search */}
//         <OutlinedInput
//           value={filterName}
//           onChange={onFilterName}
//           placeholder="Search trip sheet..."
//           startAdornment={
//             <InputAdornment position="start">
//               <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
//             </InputAdornment>
//           }
//           sx={{ maxWidth: 260 }}
//         />

//         {/* Date Filters */}
//         <TextField
//           type="date"
//           size="small"
//           label="From"
//           value={fromDate}
//           onChange={(e) => onFromDate(e.target.value)}
//         />

//         <TextField
//           type="date"
//           size="small"
//           label="To"
//           value={toDate}
//           onChange={(e) => onToDate(e.target.value)}
//         />

//         {/* Status Filter */}
//         <Select
//           value={filterStatus}
//           onChange={(e) => onFilterStatus(e.target.value)}
//           size="small"
//           sx={{ minWidth: 150 }}
//         >
//           <MenuItem value="all">All Status</MenuItem>
//           <MenuItem value="0">Created</MenuItem>
//           <MenuItem value="1">Submitted</MenuItem>
//           <MenuItem value="2">Approved</MenuItem>
//           <MenuItem value="3">Rejected</MenuItem>
//           <MenuItem value="4">Cancelled</MenuItem>
//         </Select>
//       </Stack>

//       <Typography variant="subtitle1" color="text.secondary">
//         {numSelected} selected
//       </Typography>
//     </Toolbar>
//   );
// }
// trip-sheet-toolbar.tsx
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Iconify } from 'src/components/iconify';

type Props = {
  numSelected: number;
  filterName: string;
  onFilterName: (e: React.ChangeEvent<HTMLInputElement>) => void;

  filterStatus: string;
  onFilterStatus: (v: any) => void;

  fromDate: string;
  toDate: string;
  onFromDate: (v: string) => void;
  onToDate: (v: string) => void;
};

export function TripSheetToolbar({
  numSelected,
  filterName,
  onFilterName,
  filterStatus,
  onFilterStatus,
  fromDate,
  toDate,
  onFromDate,
  onToDate
}: Props) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (t) => t.spacing(0, 1, 0, 3),
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Search */}
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search trip sheet..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 260 }}
        />

        {/* Date Filters */}
        <TextField
          type="date"
          size="small"
          label="From"
          value={fromDate}
          onChange={(e) => onFromDate(e.target.value)}
        />

        <TextField
          type="date"
          size="small"
          label="To"
          value={toDate}
          onChange={(e) => onToDate(e.target.value)}
        />

        {/* Status Filter */}
        <Select
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="0">Created</MenuItem>
          <MenuItem value="1">Submitted</MenuItem>
          <MenuItem value="2">Approved</MenuItem>
          <MenuItem value="3">Rejected</MenuItem>
          <MenuItem value="4">Cancelled</MenuItem>
        </Select>
      </Stack>

      <Typography variant="subtitle1" color="text.secondary">
        {numSelected} selected
      </Typography>
    </Toolbar>
  );
}
