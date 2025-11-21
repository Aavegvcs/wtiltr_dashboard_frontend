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
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FileUploadIcon from '@mui/icons-material/FileUpload';
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
import { UserTableHead } from '../user-table-head';
import { InsuranceUserTableRow } from '../user-table-row';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, getComparator, applyFilterForCompanyUser } from '../utils';
import type { EmployeeProps } from '../user-table-row';
import { RequiredMark } from 'src/utils/commonUtils';
import { formatToCamelCase } from 'src/utils/utils';
import { Switch } from '@mui/material';
import EmployeeBulkUploadModal from './employee-bulk-upload';

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
    id: 'name',
    label: 'Name',
    minWidth: 150,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'empCode',
    label: 'Employee Code',
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
    id: 'role',
    label: 'Role',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'dateOfBirth',
    label: 'DOB',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'gender',
    label: 'Gender',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'roName',
    label: 'Reporting Officer',
    minWidth: 150,
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

export function EmployeeView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [users, setUsers] = useState<EmployeeProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);
  const [branch, setBranch] = useState<{ id: string; name: string }[]>([]);
  const [department, setDepartment] = useState<{ id: number; name: string }[]>([]);
  const [ro, setRo] = useState<{ roId: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [newUser, setNewUser] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    designation: '',
    salary: '',
    branchId: '',
    dateOfJoining: '2024-01-01T12:00:00.000Z',
    probation: '',
    phone: '',
    email: '',
    leaveDays: '',
    roleId: '',
    departmentId: '',
    dateOfBirth: '',
    gender: '',
    status: 'active',
    company: 1,
    roId: '',
    isActive: true,
  });
  const [editUser, setEditUser] = useState<EmployeeProps | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refreshPage, setRefreshPage] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  // console.log("waqt hamara hai", branch)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const body = { companyId: 1 };
        const response = await axiosInstance.post('users/getUserByCompanyId', body);
        const data = response.data.data;
        // console.log("data ", data)
        const mappedData = data.map((user: any) => ({
          user_id: user.user_id,
          name: user.name,
          empCode: user.empCode,
          phoneNumber: user.phoneNumber,
          email: user.email,
          roleId: user.roleId,
          roleName: user.roleName,
          status: user.status,
          companyName: user.companyName,
          avatarUrl: user.avatarUrl,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          branchId: user.branchId,
          companyId: user.companyId,
          userType: user.userType,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          designation: user.designation,
          salary: user.salary,
          dateOfJoining: user.dateOfJoining,
          probation: user.probation,
          leaveDays: user.leaveDays,
          departmentId: user.departmentId,
          roId: user.roId,
          roName: user.roName,
          isActive: user.isActive,
        }));
        setUsers(mappedData);
        //  console.log('map data is here ', mappedData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshPage]);

  const fetchBranch = async () => {
    try {
      const response = await axiosInstance.post('branches/getBranch');
      // console.log(response.data.data.result);
      setBranch(response.data.data.result);
    } catch (error) {
      console.error('Error fetching branches:', error);
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
    fetchDepartment();
    fetchRoles();
    getEmployeeRo();
    setModalMode('add');
    setNewUser({
      firstName: '',
      middleName: '',
      lastName: '',
      designation: '',
      salary: '',
      branchId: '',
      dateOfJoining: '2024-01-01T12:00:00.000Z',
      probation: '',
      phone: '',
      email: '',
      leaveDays: '',
      roleId: '',
      departmentId: '',
      dateOfBirth: '',
      gender: '',
      status: 'active',
      company: 1,
      roId: '',
      isActive: true,
    });
    setOpen(true);
  };

  const handleEditModal = (item: EmployeeProps) => {
    setModalMode('edit');
    setEditUser(item);
    setNewUser({
      firstName: item.firstName || '',
      middleName: item.middleName || '',
      lastName: item.lastName || '',
      designation: item.designation || '',
      salary: item.salary || '',
      branchId: item.branchId || '',
      dateOfJoining: item.dateOfJoining || '2024-01-01T12:00:00.000Z',
      probation: item.probation || '',
      phone: item.phoneNumber || '',
      email: item.email || '',
      leaveDays: item.leaveDays || '',
      roleId: item.roleId?.toString() || '',
      departmentId: item.departmentId || '',
      dateOfBirth: item.dateOfBirth || '',
      gender: item.gender || '',
      status: item.status || 'active',
      company: item.companyId || 1,
      roId: item.roId || '',
      isActive: item.isActive,
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
    setNewUser({
      firstName: '',
      middleName: '',
      lastName: '',
      designation: '',
      salary: '',
      branchId: '',
      dateOfJoining: '2024-01-01T12:00:00.000Z',
      probation: '',
      phone: '',
      email: '',
      leaveDays: '',
      roleId: '',
      departmentId: '',
      dateOfBirth: '',
      gender: '',
      status: 'active',
      company: 1,
      roId: '',
      isActive: true,
    });
    setEditUser(null);
    setModalMode('add');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^\d*$/.test(value)) return; // Only numbers
    setNewUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 2 && value.length <= 4) {
      value = `${value.slice(0, 2)}-${value.slice(2)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4, 8)}`;
    }
    setNewUser((prev) => ({ ...prev, dateOfBirth: value }));
    setErrors((prev) => ({ ...prev, dateOfBirth: value ? '' : 'This field is required' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newUser.firstName) newErrors.firstName = 'This field is required';
    if (!newUser.branchId) newErrors.branchId = 'This field is required';
    if (!newUser.phone) {
      newErrors.phone = 'This field is required';
    } else if (!/^\d{10}$/.test(newUser.phone)) {
      newErrors.phone = 'Must be 10 digits';
    }
    if (!newUser.email) {
      newErrors.email = 'This field is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!newUser.roleId) newErrors.roleId = 'This field is required';
    if (!newUser.dateOfBirth) newErrors.dateOfBirth = 'This field is required';
    if (!newUser.gender) newErrors.gender = 'This field is required';
    if (!newUser.departmentId) newErrors.departmentId = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForAPI = (date: string) => {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Convert "12-03-2025" to "2025-03-12"
  };

  const handleAddUser = async () => {
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
      ...newUser,
      dateOfBirth: formatDateForAPI(newUser.dateOfBirth),
    };
    // console.log('add payload', payload);

    try {
      const response = await axiosInstance.post('employee/createInsuranceEmployee', payload);
      const responsedata = response.data;
      if (responsedata.message === 'success') {
        toast.success('User created successfully');
        setRefreshPage((prev) => !prev);
        handleCloseModal();
      } else {
        toast.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to create user');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser || !validateForm()) {
      setButtonLoading(false);
      return;
    }
    if (!window.confirm('Are you sure?')) {
      setButtonLoading(false);
      return;
    }

    setButtonLoading(true);
    const payload = {
      user_id: editUser.user_id,
      ...newUser,
      dateOfBirth: formatDateForAPI(newUser.dateOfBirth),
    };
    // console.log('updateInsuranceEmployee payload', payload);
    try {
      const response = await axiosInstance.patch('employee/updateInsuranceEmployee', payload); // Assumed endpoint
      const resstatus = response.data.data.status;
      const resmsz = response.data.data.message;
      // console.log('meri ', resstatus);

      if (resstatus === 'success') {
        toast.success(resmsz || 'User updated successfully');
        setRefreshPage((prev) => !prev);
      } else {
        toast.error(resmsz || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setButtonLoading(false);
      handleCloseModal();
    }
  };

  const handleDelete = async (row: EmployeeProps) => {
    if (!window.confirm('Are you sure?')) return;
    setButtonLoading(true);
    const payload = { user_id: row.user_id };

    try {
      const response = await axiosInstance.post('employee/deleteEmployee', payload); // Assumed endpoint
      if (response.data.message === 'success') {
        toast.success('User deleted successfully');
        setRefreshPage((prev) => !prev);
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleSubmit = () => {
    if (modalMode === 'add') {
      handleAddUser();
    } else {
      handleUpdateUser();
    }
  };

  const dataFiltered: EmployeeProps[] = applyFilterForCompanyUser({
    inputData: users,
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
        {newUser.roleId}
        <Toaster />
      </div>
      {/* <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Company Employee
        </Typography>
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
      </Box> */}

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
                Company Employee
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
        <UserTableToolbar
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
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((user) => String(user.user_id))
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
                    <InsuranceUserTableRow
                      key={row.user_id}
                      row={row}
                      selected={table.selected.includes(String(row.user_id))}
                      onSelectRow={() => table.onSelectRow(String(row.user_id))}
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
              {modalMode === 'add' ? 'Add Employee' : 'Edit Employee'}
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Branch
                  <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.branchId}>
                  <Select
                    name="branchId"
                    value={newUser.branchId}
                    onChange={handleSelectChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Branch
                    </MenuItem>
                    {branch.map((dataBranch) => (
                      <MenuItem key={dataBranch.id} value={dataBranch.id}>
                        {dataBranch.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.branchId && (
                    <Typography color="error" variant="caption">
                      {errors.branchId}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Department
                  <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.departmentId}>
                  <Select
                    name="departmentId"
                    value={newUser.departmentId}
                    onChange={handleSelectChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Department
                    </MenuItem>
                    {department.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.departmentId && (
                    <Typography color="error" variant="caption">
                      {errors.departmentId}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  First Name
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleTextChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Middle Name:
                </Typography>
                <TextField
                  fullWidth
                  name="middleName"
                  value={newUser.middleName}
                  onChange={handleTextChange}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Last Name
                </Typography>
                <TextField
                  fullWidth
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleTextChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Role
                  <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.roleId}>
                  <Select
                    name="roleId"
                    value={newUser.roleId}
                    onChange={handleSelectChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Role
                    </MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {formatToCamelCase(role.roleName)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.roleId && (
                    <Typography color="error" variant="caption">
                      {errors.roleId}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            {Number(newUser.roleId) !== 1 && Number(newUser.roleId) !== 2 && (
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    Reporting Officer
                    <RequiredMark />
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="roId"
                      value={newUser.roId}
                      onChange={handleSelectChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select RO
                      </MenuItem>
                      {ro.map((ro) => (
                        <MenuItem key={ro.roId} value={ro.roId}>
                          {ro.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            )}

            {/* <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Designation
                </Typography>
                <TextField
                  fullWidth
                  name="designation"
                  value={newUser.designation}
                  onChange={handleTextChange}
                  error={!!errors.designation}
                  helperText={errors.designation}
                />
              </Box>
            </Grid> */}

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Date of Birth (DD-MM-YYYY)
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="dateOfBirth"
                  value={newUser.dateOfBirth}
                  onChange={handleDateChange}
                  inputProps={{ maxLength: 10 }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Phone Number
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="phone"
                  value={newUser.phone}
                  onChange={handleTextChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  inputProps={{ maxLength: 10 }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Email
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={newUser.email}
                  onChange={handleTextChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Gender
                  <RequiredMark />
                </Typography>
                <FormControl component="fieldset" error={!!errors.gender}>
                  <RadioGroup row name="gender" value={newUser.gender} onChange={handleTextChange}>
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  </RadioGroup>
                  {errors.gender && (
                    <Typography color="error" variant="caption">
                      {errors.gender}
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
                  checked={Boolean(newUser.isActive)}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, isActive: e.target.checked }))}
                  color="primary"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {newUser.isActive ? 'Active' : 'Inactive'}
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

      <EmployeeBulkUploadModal
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
