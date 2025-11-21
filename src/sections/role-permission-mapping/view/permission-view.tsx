import { useState, useCallback, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import axiosInstance from 'src/config-global';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Modal from '@mui/material/Modal';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { formatToCamelCase } from 'src/utils/utils';
import toast, { Toaster } from 'react-hot-toast';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { Switch } from '@mui/material';
import { Insurance_Type } from 'src/utils/insurance.utils';
import { RequiredMark } from 'src/utils/commonUtils';
import { RolePermissionMappingTableRow, RolePermissionProps } from '../role-permission-table-row';
import { applyFilterForEscalation, emptyRows, getComparator } from '../utils';
import { RolePermissionTableToolbar } from '../role-permission-table-toolbar';
import { RolePermissionMappingTableHead } from '../role-permission-table-head';
import { InsuranceModuleType, InsurancePermissionType } from './types';

// Modal style
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: '50%',
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
    minWidth: 170,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'type',
    label: 'Type',
    minWidth: 140,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'module',
    label: 'Module',
    minWidth: 170,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },

  {
    id: 'description',
    label: 'Description',
    minWidth: 200,
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

export function PermissionView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [permission, setPermission] = useState<RolePermissionProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const [module, setModule] = useState<{ module: string }[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('AllTypes');
  const [filterModule, setFilterModule] = useState('AllModules');

  const [addUpdateModal, setAddUpdateModal] = useState({
    updateModal: false,
    addModal: true,
  });
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [newPermission, setNewPermission] = useState({
    name: '',
    type: '' as string | undefined,
    module: '',
    description: '',
    status: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editPermission, setEditPermission] = useState<RolePermissionProps | null>(null);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axiosInstance.get('/insurance-role-permission/getPermission');

        const data = response.data.data.data;
        // console.log('response', response.data);
        const mappedData = data.map((permission: any) => ({
          id: permission.id,
          name: permission.name,
          module: permission.module,
          type: permission.type,
          description: permission.description,
          status: permission.is_active,
        }));
        // console.log('mappedData', mappedData);
        setPermission(mappedData);
      } catch (error) {
        console.error('Error fetching permission:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermission();
  }, [refreshPage]);

  const fetchModule = async () => {
    try {
      const response = await axiosInstance.get('insurance-product/getInsuranceCompany');
      setModule(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // const fetchType = async () => {
  //   try {
  //     const response = await axiosInstance.get('insurance-product/insuranceType');
  //     setType(response.data.data || []);
  //     console.log('all  type  is here ', response.data.data);
  //   } catch (error) {
  //     console.error('Error fetching roles:', error);
  //   }
  // };

  const handleAddModal = () => {
    fetchModule();
    // fetchType();
    setAddUpdateModal({ ...addUpdateModal, addModal: true, updateModal: false });
    handleOpenModal();
    setModalMode('add');
  };

  const handleEditModal = (item: RolePermissionProps) => {
    setModalMode('edit');
    setEditPermission(item);

    setNewPermission({
      name: item.name,
      module: item.module,
      type: item.type || '',
      description: item.description || '',
      status: item.status,
    });
    fetchModule();
    handleOpenModal();
  };

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
    setErrors({});
    setNewPermission({
      name: '',
      module: '',
      type: '',
      description: '',
      status: true,
    });
    setEditPermission(null);
    setModalMode('add');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPermission((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    setNewPermission((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newPermission.name) newErrors.name = 'This field is required';
    if (!newPermission.module) newErrors.module = 'This field is required';
    if (!newPermission.type) newErrors.type = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPermission = async () => {
    if (!validateForm()) {
      setButtonLoading(false);
      return;
    }
    if (!window.confirm('Are you sure?')) {
      return;
    }
    setButtonLoading(true);
    const payload = {
      ...newPermission,
    };
    // console.log('payload is here', payload);
    try {
      const response = await axiosInstance.post(
        '/insurance-role-permission/createPermission',
        payload
      );
      // console.log(response.data.data);
      
      const resstatus = response.data.data.status;
      const resmsz = response.data.data.message;
      if (resstatus) {
        toast.success('Permission saved successfully');
        setButtonLoading(false);
        setRefreshPage(true);
         handleCloseModal();
      } else {
        toast.error(resmsz);
        setButtonLoading(false);
      }
     
      setRefreshPage(true);
    } catch (error) {
      console.error('Error adding permission:', error);
      toast.error('Failed! to save permission');
      setButtonLoading(false);
    }
  };

  const handleUpdatePermission = async () => {
    if (!editPermission || !validateForm()) {
      setButtonLoading(false);
      return;
    }
    if (!window.confirm('Are you sure?')) return;

    setButtonLoading(true);
    const payload = {
      id: editPermission.id,
      ...newPermission,
    };
    // console.log('on update fun', payload);
    try {
      const response = await axiosInstance.patch(
        'insurance-role-permission/updatePermission',
        payload
      ); // Assumed endpoint

      const resstatus = response.data.data.status;
      const resmsz = response.data.data.message;
      if (resstatus === 'success') {
        toast.success(resmsz);
        setRefreshPage((prev) => !prev);
      } else {
        toast.error(resmsz);
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    } finally {
      setButtonLoading(false);
      handleCloseModal();
    }
  };

  const handleDelete = async (row: any) => {
    const payload = {
      permissionId: row.id,
    };
    if (!window.confirm('Are you sure?')) return;
    // setButtonLoading(true);
    try {
      const response = await axiosInstance.post(
        'insurance-role-permission/deletePermission',
        payload
      );

      const resstatus = response.data.data.status;
      const resmsz = response.data.data.message;
      // console.log('resstatus is here', resmsz);
      if (resstatus === 'success') {
        toast.success(resmsz);
        setRefreshPage(true);
      } else {
        toast.error(resmsz);
      }
    } catch (error) {
      // setButtonLoading(false);
      console.error('Error delete permission:', error);
      toast.error('Failed! to delete permission');
    }
  };
  const handleSubmit = () => {
    if (modalMode === 'add') {
      handleAddPermission();
    } else {
      handleUpdatePermission();
    }
  };
  const dataFiltered: RolePermissionProps[] = applyFilterForEscalation({
    inputData: permission.filter((item) => {
      return (
        (filterType === '' || filterType === 'AllTypes' || item.type === filterType) &&
        (filterModule === '' || filterModule === 'AllModules' || item.module === filterModule)
      );
    }),
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

  return (
    <DashboardContent>
      <div>
        <Toaster />
      </div>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Permissions
        </Typography>
        <Button
          variant="contained"
          color="inherit"
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
      </Box>

      <Card>
        <RolePermissionTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterType={filterType}
          filterModule={filterModule}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterType={(event) => {
            setFilterType(event.target.value);
            table.onResetPage();
          }}
          onFilterModule={(event) => {
            setFilterModule(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <RolePermissionMappingTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((filterdata) => String(filterdata.id))
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
                    <RolePermissionMappingTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                      onEdit={() => handleEditModal(row)} // Pass edit handler
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

      {/* Modal for adding new user */}

      {/* new modal is opened */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        BackdropProps={{ onClick: (e) => e.stopPropagation() }}
        disableEscapeKeyDown
      >
        <Box sx={modalStyle} className="w-1/2 max-md:w-[90%]">
          <Box display={'flex'} justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              {modalMode === 'add' ? 'Add Permission' : 'Edit Permission'}
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
                  Module <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.module}>
                  <Select
                    name="module"
                    value={newPermission.module || ''} // Ensure value is defined, default to empty string
                    onChange={handleSelectChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Module
                    </MenuItem>
                    {Object.values(InsuranceModuleType)
                      .filter((value) => typeof value === 'string')
                      .map((data) => (
                        <MenuItem key={data} value={data}>
                          {formatToCamelCase(data)}{' '}
                          {/* Optional: Use formatToCamelCase for better display */}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.module && (
                    <Typography color="error" variant="caption">
                      {errors.module}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Type
                  <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.type}>
                  <Select
                    name="type"
                    value={newPermission.type || ''} // Default to empty string if undefined
                    onChange={handleSelectChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Type
                    </MenuItem>
                    {Object.values(InsurancePermissionType)
                      .filter((value) => typeof value === 'string')
                      .map((type) => (
                        <MenuItem key={type} value={type}>
                          {formatToCamelCase(type)}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.type && (
                    <Typography color="error" variant="caption">
                      {errors.type}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Name
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={newPermission.name}
                  onChange={handleTextChange}
                  placeholder="Enter Permissions"
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Description
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  value={newPermission.description}
                  onChange={handleTextChange}
                  placeholder="Enter description"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Status
                </Typography>
                <Switch
                  checked={Boolean(newPermission.status)}
                  onChange={(e) =>
                    setNewPermission((prev) => ({ ...prev, status: e.target.checked }))
                  }
                  color="primary"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {newPermission.status ? 'Active' : 'Inactive'}
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
                  // className="bg-[#49c401] px-4 py-3 max-md:px-3 max-md:py-3 rounded-md"
                  variant="contained"
                  style={{ minWidth: '108px' }}
                  onClick={handleSubmit}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 2,
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
