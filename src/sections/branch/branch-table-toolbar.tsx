import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Iconify } from 'src/components/iconify';

type Props = {
  numSelected: number;
  filterName: string;
  onFilterName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd?: () => void;
  onBulk?: () => void;
};

export default function BranchTableToolbar({ numSelected, filterName, onFilterName, onAdd, onBulk }: Props) {
  return (
    <Toolbar sx={{ height: 96, display: 'flex', justifyContent: 'space-between', p: (t) => t.spacing(0, 1, 0, 3) }}>
      <OutlinedInput
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify width={20} icon="eva:search-fill" />
          </InputAdornment>
        }
        sx={{ maxWidth: 360 }}
      />
      {/* <div>
        <Tooltip title="Bulk upload">
          <IconButton onClick={onBulk}>
            <Iconify icon="ic:round-file-upload" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add">
          <IconButton onClick={onAdd}>
            <Iconify icon="mingcute:add-line" />
          </IconButton>
        </Tooltip>
      </div> */}
    </Toolbar>
  );
}
