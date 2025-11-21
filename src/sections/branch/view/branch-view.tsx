// -----------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import axiosInstance from 'src/config-global';
import { CircularProgress, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import toast, { Toaster } from 'react-hot-toast';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { RequiredMark } from 'src/utils/commonUtils';
import { formatToCamelCase } from 'src/utils/utils';
import { Switch } from '@mui/material';
import { BranchProps, BranchTableRow } from '../branch-table-row';
import { applyFilterForBranch, emptyRows, getComparator } from '../utils';
import { BranchTableToolbar } from '../branch-table-toolbar';
import { BranchTableHead } from '../branch-table-head';
import BranchBulkUploadModal from './branch-bulk-upload';

// Modal style
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflowY: 'auto',
};

// ----------------------------------------------------------------------
const columns = [
  {
    id: 'branchCode',
    label: 'Branch Code',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'branchName',
    label: 'Branch Name',
    minWidth: 140,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'contact',
    label: 'Contact Number',
    minWidth: 150,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 140,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'contactPerson',
    label: 'Contact Person',
    minWidth: 140,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'controlBranchId',
    label: 'Control Branch',
    minWidth: 140,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'regionalManagerId',
    label: 'Regional Manager',
    minWidth: 150,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },

  {
    id: 'state',
    label: 'State',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
];

export function BranchView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [branch, setBranch] = useState<BranchProps[]>([]);
  const [controlBranch, setControlBranch] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);
  const [department, setDepartment] = useState<{ id: number; name: string }[]>([]);
  const [ro, setRo] = useState<{ roId: string; name: string }[]>([]);
  const [state, setState] = useState<{ stateId: string; stateName: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [employee, setEmployee] = useState<{ empId: string; empName: string }[]>([]);
  const [newBranch, setNewBranch] = useState({
    branchCode: '',
    department: '',
    companyId: '',
    branchName: '', // corresponds to "name"
    stateId: '',
    city: '',
    pincode: '',
    isActive: true,
    address: '', // array
    email: '',
    phone: '',
    contactPerson: '',
    panNumber: '',
    activationDate: new Date(),
    regionalManagerId: '', // user id
    controlBranchId: '', // branch id
  });

  const [editBranch, setEditBranch] = useState<BranchProps | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refreshPage, setRefreshPage] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  // console.log("waqt hamara hai", branch)
  useEffect(() => {
    const fetchDetailsBranch = async () => {
      try {
        const response = await axiosInstance.post('branches/getDetailsBranch');
        const data = response.data.data.items;
        //  console.log('data ', data);
        const mappedData = data.map(
          (branch: any): BranchProps => ({
            branchId: branch.branchId,
            branchCode: branch.branchCode,
            branchName: branch.branchName,
            companyId: '',
            city: branch.city,
            pincode: branch.pincode,
            isActive: branch.isActive,
            address: branch.address,
            email: branch.email,
            phone: branch.phone,
            contactPerson: branch.contactPerson,
            panNumber: branch.panNumber,
            activationDate: branch.activationDate,
            stateId: branch.stateId ?? null,
            stateName: branch.stateName,
            regionalManagerId: branch.regionalManagerId,
            regionalManagerName: branch.regionalManagerName,
            controlBranchId: branch.controlBranchId ?? null,
            controlBranchName: branch.controlBranchName ?? null,
          })
        );

        setBranch(mappedData);
        //  console.log('map data is here ', mappedData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailsBranch();
  }, [refreshPage]);

  const fetchBranch = async () => {
    try {
      const response = await axiosInstance.post('branches/getBranch');
      //  console.log('branches',response.data.data.result);
      setControlBranch(response.data.data.result);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchState = async () => {
    try {
      const response = await axiosInstance.get('states/getAllState');
      //  console.log('here is state',response.data.data.result);
      setState(response.data.data.result);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await axiosInstance.get('departments');
      // console.log('this is departments', response.data.data);
      setDepartment(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.post('roles/all');
      setRoles(response.data.data.items);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axiosInstance.get('/insurance-ticket/getEmployee'); // Replace with actual endpoint
      //  console.log('employee', response.data.data);
      setEmployee(response.data.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };
  const getEmployeeRo = async () => {
    try {
      const response = await axiosInstance.get('users/getEmployeeRo');
      // console.log("reo ---", response.data.data)
      setRo(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleAddModal = () => {
    fetchBranch();
    fetchState();
    fetchDepartment();
    fetchRoles();
    fetchEmployee();
    getEmployeeRo();
    setModalMode('add');
    setNewBranch({
      branchCode: '',
      department: '',
      companyId: '',
      branchName: '', // corresponds to "name"
      stateId: '',
      city: '',
      pincode: '',
      isActive: true,
      address: '', // array
      email: '',
      phone: '',
      contactPerson: '',
      panNumber: '',
      activationDate: new Date(),
      regionalManagerId: '', // user id
      controlBranchId: '',
    });
    setOpen(true);
  };

  const handleEditModal = (item: BranchProps) => {
    // console.log("this is edit item", item);
    fetchState();
    fetchDepartment();
    fetchRoles();
    fetchEmployee();
    getEmployeeRo();
    setModalMode('edit');
    setEditBranch(item);
    setNewBranch({
      branchCode: item.branchCode || '',
      companyId: item.companyId || '',
      department: '',
      branchName: item.branchName || '',
      stateId: item.stateId || '',
      city: item.city || '',
      pincode: item.pincode || '',
      isActive: item.isActive ?? true,
      address: item.address || '',
      email: item.email || '',
      phone: item.phone || '',
      contactPerson: item.contactPerson || '',
      panNumber: item.panNumber || '',
      activationDate: new Date(),
      regionalManagerId: item.regionalManagerId?.toString() || '',
      controlBranchId: item.controlBranchId?.toString() || '',
    });

    fetchBranch();
    fetchDepartment();
    fetchRoles();
    getEmployeeRo();
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setErrors({});
    setNewBranch({
      branchCode: '',
      companyId: '',
      department: '',
      branchName: '', // corresponds to "name"
      stateId: '',
      city: '',
      pincode: '',
      isActive: true,
      address: '', // array
      email: '',
      phone: '',
      contactPerson: '',
      panNumber: '',
      activationDate: new Date(),
      regionalManagerId: '', // user id
      controlBranchId: '',
    });
    setEditBranch(null);
    setModalMode('add');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^\d*$/.test(value)) return; // Only numbers
    setNewBranch((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewBranch((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 2 && value.length <= 4) {
      value = `${value.slice(0, 2)}-${value.slice(2)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4, 8)}`;
    }
    setNewBranch((prev) => ({ ...prev, dateOfBirth: value }));
    setErrors((prev) => ({ ...prev, dateOfBirth: value ? '' : 'This field is required' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newBranch.branchName) newErrors.firstName = 'This field is required';
    if (!newBranch.branchCode) newErrors.branchId = 'This field is required';
    if (!newBranch.phone) {
      newErrors.phone = 'This field is required';
    } else if (!/^\d{10}$/.test(newBranch.phone)) {
      newErrors.phone = 'Must be 10 digits';
    }
    // if (!newUser.email) {
    //   newErrors.email = 'This field is required';
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
    //   newErrors.email = 'Invalid email format';
    // }
    // if (!newUser.roleId) newErrors.roleId = 'This field is required';
    // if (!newUser.dateOfBirth) newErrors.dateOfBirth = 'This field is required';
    // if (!newUser.gender) newErrors.gender = 'This field is required';
    // if (!newUser.departmentId) newErrors.departmentId = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForAPI = (date: string) => {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Convert "12-03-2025" to "2025-03-12"
  };

  const handleAddBranch = async () => {
    setButtonLoading(true);
    if (!validateForm()) {
      setButtonLoading(false);
      return;
    }
    if (!window.confirm('Are you sure?')) {
      setButtonLoading(false);
      return;
    }

    const payload = {
      ...newBranch,
    };
    // console.log('add payload', payload);
    try {
      const response = await axiosInstance.post('branches/create', payload);
      const responsedata = response.data;
      if (responsedata.message === 'success') {
        toast.success('Branch created successfully');
        setRefreshPage((prev) => !prev);
        handleCloseModal();
      } else {
        toast.error('Failed to create Branch');
      }
    } catch (error) {
      console.error('Error adding Branch:', error);
      toast.error('Failed to create Branch');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleUpdateBranch = async () => {
    if (!editBranch || !validateForm()) {
      setButtonLoading(false);
      return;
    }
    if (!window.confirm('Are you sure?')) {
      setButtonLoading(false);
      return;
    }

    setButtonLoading(true);
    const payload = {
      branchId: editBranch.branchId,
      ...newBranch,
    };
    // console.log('update branch payload', payload);
    try {
      const response = await axiosInstance.patch('branches/updateBranch', payload); // Assumed endpoint
      const resstatus = response.data.data.status;
      const resmsz = response.data.data.message;
      // console.log('response is here ',resstatus);

      if (resstatus == true) {
        toast.success(resmsz || 'Branch updated successfully');
        setRefreshPage((prev) => !prev);
      } else {
        toast.error(resmsz || 'Failed to update branch');
      }
    } catch (error) {
      console.error('Error updating banch:', error);
      toast.error('Failed to update branch');
    } finally {
      setButtonLoading(false);
      handleCloseModal();
    }
  };

  const handleDelete = async (row: BranchProps) => {
    if (!window.confirm('Are you sure?')) return;
    setButtonLoading(true);
    const payload = { branchId: row.branchId };
    // console.log("payload is here-", payload, row.branchCode);

    try {
      const response = await axiosInstance.post('branches/deleteBranch', payload); // Assumed endpoint
      if (response.data.message === 'success') {
        toast.success('Branch deleted successfully');
        setRefreshPage((prev) => !prev);
      } else {
        toast.error('Failed to delete Branch');
      }
    } catch (error) {
      console.error('Error deleting Branch:', error);
      toast.error('Failed to delete Branch');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleSubmit = () => {
    if (modalMode === 'add') {
      handleAddBranch();
    } else {
      handleUpdateBranch();
    }
  };

  const dataFiltered: BranchProps[] = applyFilterForBranch({
    inputData: branch,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  if (loading) {
    return (
      <DashboardContent>
        <LinearProgress
          sx={{
            width: 1,
            maxWidth: 320,
            bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
            [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            align: 'center',
            mx: 'auto',
          }}
        />
      </DashboardContent>
    );
  }

  const handleOpenBulkModal = () => {
    setOpenBulkModal(true);
  };
  return (
    <DashboardContent>
      <div>
        <Toaster />
      </div>
      <Box mb={5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }} // column on mobile, row on desktop
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              textAlign: { xs: 'center', sm: 'left' },
              mb: { xs: 2, sm: 0 },
            }}
          >
            Branch
          </Typography>

          {/* Bulk Upload Button */}
          <Button
            variant="contained"
            startIcon={<FileUploadIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              px: { xs: 2, md: 3 },
              backgroundColor: '#0055A5',
              width: { xs: '100%', sm: 'auto' }, // full width on mobile
              '&:hover': { backgroundColor: '#004080' },
            }}
            onClick={handleOpenBulkModal}
          >
            Bulk Upload
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAddModal}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              mr: { md: 3, xs: 0 },
              backgroundColor: '#0055A5',
              '&:hover': {
                backgroundColor: '#004080', // optional: darker shade on hover
              },
            }}
          >
            Add More
          </Button>
        </Stack>
      </Box>

      <Card>
        <BranchTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <BranchTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((branch) => String(branch.branchId))
                  )
                }
                headLabel={columns}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <BranchTableRow
                      key={row.branchId}
                      row={row}
                      selected={table.selected.includes(String(row.branchId))}
                      onSelectRow={() => table.onSelectRow(String(row.branchId))}
                      onEdit={() => handleEditModal(row)}
                      onDelete={() => handleDelete(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Modal for adding/editing employee */}

      <Modal
        open={open}
        onClose={handleCloseModal}
        BackdropProps={{ onClick: (e) => e.stopPropagation() }}
        disableEscapeKeyDown
      >
        <Box sx={modalStyle} className="w-1/2 max-md:w-[90%]">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              {modalMode === 'add' ? 'Create Branch' : 'Edit Branch'}
            </Typography>
            <Button
              variant="text"
              color="inherit"
              onClick={handleCloseModal}
              sx={{ minWidth: 'auto', p: 0 }}
            >
              <Iconify icon="eva:close-fill" width={30} height={30} />
            </Button>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Branch Code
                </Typography>
                <TextField
                  fullWidth
                  name="branchCode"
                  value={newBranch.branchCode}
                  onChange={handleTextChange}
                  InputProps={{
                    sx: { height: 38 },
                    inputProps: {
                      style: {
                        textTransform: 'uppercase',
                      },
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Branch Name
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="branchName"
                  value={newBranch.branchName}
                  onChange={handleTextChange}
                  error={!!errors.branchName}
                  helperText={errors.branchName}
                  InputProps={{
                    sx: { height: 38 },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Phone Number
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="phone"
                  value={newBranch.phone}
                  onChange={handleTextChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    sx: { height: 38 },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={newBranch.email}
                  onChange={handleTextChange}
                  InputProps={{
                    sx: { height: 38 },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Contact Person
                </Typography>
                <TextField
                  fullWidth
                  name="contactPerson"
                  value={newBranch.contactPerson}
                  onChange={handleTextChange}
                  InputProps={{
                    sx: { height: 38 },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Pan Number
                </Typography>
                <TextField
                  fullWidth
                  name="panNumber"
                  value={newBranch.panNumber}
                  onChange={handleTextChange}
                  InputProps={{
                    sx: { height: 38 },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Address
                </Typography>
                <TextField
                  fullWidth
                  name="address"
                  value={newBranch.address}
                  onChange={handleTextChange}
                  InputProps={{
                    sx: { height: 38 },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  City
                </Typography>
                <TextField
                  fullWidth
                  name="city"
                  value={newBranch.city}
                  onChange={handleTextChange}
                  InputProps={{
                    sx: { height: 38 },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Pin Code
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="pincode"
                  value={newBranch.pincode}
                  onChange={handleTextChange}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                  inputProps={{ maxLength: 6 }}
                  InputProps={{
                    sx: { height: 38 },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  State
                  <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.stateId}>
                  <Select
                    name="stateId"
                    value={newBranch.stateId}
                    onChange={handleSelectChange}
                    displayEmpty
                    size="small" // smaller Select
                    sx={{ height: 38 }} // same height as TextField
                  >
                    <MenuItem value="" disabled>
                      Select State
                    </MenuItem>
                    {state.map((dataState) => (
                      <MenuItem key={dataState.stateId} value={dataState.stateId}>
                        {formatToCamelCase(dataState.stateName)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.stateId && (
                    <Typography color="error" variant="caption">
                      {errors.stateId}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Control Branch
                  <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.controlBranchId}>
                  <Select
                    name="controlBranchId"
                    value={newBranch.controlBranchId}
                    onChange={handleSelectChange}
                    displayEmpty
                    size="small" // smaller Select
                    sx={{ height: 38 }} // same height as TextField
                  >
                    <MenuItem value="" disabled>
                      Select Branch
                    </MenuItem>
                    {controlBranch.map((dataBranch) => (
                      <MenuItem key={dataBranch.id} value={dataBranch.id}>
                        {formatToCamelCase(dataBranch.name)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.controlBranchId && (
                    <Typography color="error" variant="caption">
                      {errors.controlBranchId}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Regional Manager
                  <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.controlBranchId}>
                  <Select
                    name="regionalManagerId"
                    value={newBranch.regionalManagerId}
                    onChange={handleSelectChange}
                    displayEmpty
                    size="small" // smaller Select
                    sx={{ height: 38 }} // same height as TextField
                  >
                    <MenuItem value="" disabled>
                      Select RM
                    </MenuItem>
                    {employee.map((data) => (
                      <MenuItem key={data.empId} value={data.empId}>
                        {data.empName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.regionalManagerId && (
                    <Typography color="error" variant="caption">
                      {errors.regionalManagerId}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Status
                </Typography>
                <Switch
                  checked={Boolean(newBranch.isActive)}
                  onChange={(e) =>
                    setNewBranch((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  color="primary"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {newBranch.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 3,
                    // mr: { md: 3, xs: 0 },
                    ml: { md: 5, xs: 2 },
                    alignSelf: { xs: 'center', md: 'flex-start' },
                    borderColor: '#0055A5',
                    color: '#0055A5',
                    '&:hover': {
                      borderColor: '#004080',
                      backgroundColor: 'rgba(0, 85, 165, 0.1)', // optional subtle hover effect
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  //  className="bg-[#49c401] px-4 py-3 max-md:px-3 max-md:py-3 rounded-md"
                  variant="contained"
                  style={{ minWidth: '108px' }}
                  onClick={handleSubmit}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 3,
                    // mr: { md: 3, xs: 0 },
                    ml: { md: 5, xs: 2 },
                    backgroundColor: '#0055A5',
                    '&:hover': {
                      backgroundColor: '#004080', // optional: darker shade on hover
                    },
                  }}
                >
                  {buttonLoading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : modalMode === 'add' ? (
                    'Save'
                  ) : (
                    'Update'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <BranchBulkUploadModal
        open={openBulkModal}
        onClose={() => {
          setOpenBulkModal(false);
        }}
        refreshData={() => setRefreshPage((prev) => !prev)}
      />
    </DashboardContent>
  );
}

// [useTable function remains unchanged]
export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];
      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
