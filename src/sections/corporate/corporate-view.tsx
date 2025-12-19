import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import axiosInstance from 'src/config-global';
import {
  CircularProgress,
  Stack,
  SelectChangeEvent,
  IconButton,
  Skeleton,
  TableRow,
  TableCell,
} from '@mui/material';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import toast, { Toaster } from 'react-hot-toast';

import { CorporateTableHead } from './corporate-table-head';
import { CorporateTableRow } from './corporate-table-row';
import { CorporateTableToolbar } from './corporate-table-toolbar';
import CorporateBulkUploadModal from './corporate-bulk-upload';
import { applyFilterCorporate, emptyRows, getComparator } from './utils';
import { TableEmptyRows } from './table-empty-rows';
import { TableNoData } from './table-no-data';
import { CorporateProps } from './types';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
  maxHeight: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflowY: 'auto',
};

// Table columns with correct align type
const columns = [
  { id: 'id', label: 'ID', align: 'center' as const },
  { id: 'corporateCode', label: 'Corporate Code', align: 'center' as const },
  { id: 'corporateName', label: 'Corporate Name', align: 'center' as const },
  { id: 'phoneNumber', label: 'Phone', align: 'center' as const },
  { id: 'email', label: 'Email', align: 'center' as const },
  { id: 'state', label: 'State', align: 'center' as const },
  { id: 'country', label: 'Country', align: 'center' as const },
  { id: 'status', label: 'Status', align: 'center' as const },
  { id: 'action', label: 'Action', align: 'center' as const },
];

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('corporateName');
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const onResetPage = () => setPage(0);
  const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    onResetPage();
  }, []);

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSort,
    onSelectRow,
    onResetPage,
    onSelectAllRows,
    onChangePage,
    onChangeRowsPerPage,
  };
}

export function CorporateView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [corporates, setCorporates] = useState<CorporateProps[]>([]);
  const [stateList, setStateList] = useState<{ id: number; name: string }[]>([]);
  const [countryList, setCountryList] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [open, setOpen] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editCorporate, setEditCorporate] = useState<CorporateProps | null>(null);

  // Form state — country/state are now objects or null
  // const [newCorporate, setNewCorporate] = useState<Omit<CorporateProps, 'id'>>({
  //   corporateCode: '',
  //   corporateName: '',
  //   phoneNumber: '',
  //   secondaryPhoneNumber: '',
  //   email: '',
  //   gst: '',
  //   panNumber: '',
  //   address: '',
  //   currency: '',
  //   country: null,
  //   state: null,
  //   isActive: true,
  // });
  const [newCorporate, setNewCorporate] = useState<Omit<CorporateProps, 'id' | 'corporateCode'>>({
    corporateName: '',
    phoneNumber: '',
    secondaryPhoneNumber: '',
    email: '',
    gst: '',
    panNumber: '',
    address: '',
    currency: '',
    country: null,
    state: null,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [corpRes, statesRes, countriesRes] = await Promise.all([
          axiosInstance.post('corporate/list'),
          axiosInstance.get('/states'),
          axiosInstance.get('/countries'),
        ]);
        const resData = corpRes.data?.data;
        const items = corpRes.data?.data?.items || [];

        setCorporates(
          items.map((item: any) => ({
            id: item.id,
            corporateCode: item.corporateCode || '',
            corporateName: item.corporateName || '',
            phoneNumber: item.phoneNumber || '',
            secondaryPhoneNumber: item.secondaryPhoneNumber || '',
            email: item.email || '',
            gst: item.gst || '',
            panNumber: item.panNumber || '',
            address: item.address || '',
            currency: item.currency || '',
            country: item.country ? { id: item.country.id, name: item.country.name } : null,
            state: item.state ? { id: item.state.id, name: item.state.name } : null,
            isActive: item.isActive ?? true,
          }))
        );

        setStateList(statesRes.data.data || []);
        setCountryList(countriesRes.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const refreshData = () => setRefreshTrigger((v) => v + 1);

  // Modal handlers
  const handleOpenAdd = () => {
    setModalMode('add');
    setEditCorporate(null);
    setErrors({});
    setNewCorporate({
      // corporateCode: '',
      corporateName: '',
      phoneNumber: '',
      secondaryPhoneNumber: '',
      email: '',
      gst: '',
      panNumber: '',
      address: '',
      currency: '',
      country: null,
      state: null,
      isActive: true,
    });
    setOpen(true);
  };

  const handleOpenEdit = (row: CorporateProps) => {
    setModalMode('edit');
    setEditCorporate(row);
    setErrors({});
    setNewCorporate({
      // corporateCode: row.corporateCode,
      corporateName: row.corporateName,
      phoneNumber: row.phoneNumber,
      secondaryPhoneNumber: row.secondaryPhoneNumber || '',
      email: row.email || '',
      gst: row.gst || '',
      panNumber: row.panNumber || '',
      address: row.address || '',
      currency: row.currency || '',
      country: row.country, // object or null
      state: row.state, // object or null
      isActive: row.isActive,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCorporate(null);
    setErrors({});
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'country' || name === 'state') {
      const selected = value ? { id: Number(value), name: '' } : null;
      const list = name === 'country' ? countryList : stateList;
      const found = list.find((item) => item.id === Number(value));
      setNewCorporate((prev) => ({ ...prev, [name]: found || selected }));
    } else {
      setNewCorporate((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};

    // ✅ Corporate Code (Create only)
    // if (modalMode === 'add' && !newCorporate.corporateCode.trim()) {
    //   err.corporateCode = 'Corporate Code is required';
    // }

    // ✅ Corporate Name
    if (!newCorporate.corporateName.trim()) {
      err.corporateName = 'Corporate Name is required';
    }

    // ✅ Phone (Optional but if present must be valid)

    if (!newCorporate.phoneNumber.trim()) {
      err.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(newCorporate.phoneNumber)) {
      err.phoneNumber = 'Enter a valid 10-digit Indian mobile number';
    }

    // ✅ Email (Optional but if present must be valid)
    if (!newCorporate.email.trim()) {
      err.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCorporate.email)) {
      err.email = 'Enter a valid email address';
    }

    // ✅ GST (Optional but format check)
    if (
      newCorporate.gst &&
      !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/.test(newCorporate.gst)
    ) {
      err.gst = 'Invalid GST number format';
    }

    // ✅ PAN (Optional but format check)
    if (newCorporate.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(newCorporate.panNumber)) {
      err.panNumber = 'Invalid PAN number format';
    }

    // ✅ Country & State (Optional rule – enable if required)
    // if (!newCorporate.country) err.country = 'Country is required';
    // if (!newCorporate.state) err.state = 'State is required';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // const payload = {
    //   ...newCorporate,
    //   country: newCorporate.country?.id || null,
    //   state: newCorporate.state?.id || null,
    // };
    const payload = {
      corporateName: newCorporate.corporateName,
      phoneNumber: newCorporate.phoneNumber,
      secondaryPhoneNumber: newCorporate.secondaryPhoneNumber,
      email: newCorporate.email,
      gst: newCorporate.gst,
      panNumber: newCorporate.panNumber,
      address: newCorporate.address,
      currency: newCorporate.currency,
      isActive: newCorporate.isActive,
      country: newCorporate.country?.id || null,
      state: newCorporate.state?.id || null,
    };

    try {
      setButtonLoading(true);
      if (modalMode === 'add') {
        const res = await axiosInstance.post('corporate/create', payload);
        console.log('corrdlfkjekdklnklvnlvnkl', res);
        const message =
          res?.data?.data?.message || // ✅ REAL backend message
          res?.data?.message || // fallback
          'Corporate created';
        if (res?.data?.data?.status === false) {
          toast.error(message);
          return;
        }

        toast.success(message);
        // toast.success('Corporate created!');
      } else {
        console.log("in else statuement");
        
        const res = await axiosInstance.put('corporate/update', {
          id: editCorporate?.id,
          ...payload,
        });
        console.log('resresresresresresres', res);
        const message = res?.data?.data?.message || res?.data?.message || 'Corporate updated';

        if (res?.data?.data?.status === false) {
          toast.error(message);
          return;
        }

        toast.success(message);
        // toast.success('Corporate updated!');
      }
      refreshData();
      handleClose();
    } catch (err: any) {
      toast.error(err.message);
      console.log(err.response);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDelete = async (row: CorporateProps) => {
    if (!confirm('Delete this corporate?')) return;
    try {
      await axiosInstance.post('corporate/delete', { id: row.id });
      toast.success('Deleted');
      refreshData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const dataFiltered = applyFilterCorporate({
    inputData: corporates,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStatus,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Toaster position="top-right" />

      <Box mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Corporate</Typography>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={refreshData} color="primary">
              <Iconify icon="eva:refresh-fill" />
            </IconButton>

            <Button
              variant="outlined"
              startIcon={<FileUploadIcon />}
              onClick={() => setOpenBulkModal(true)}
            >
              Bulk Upload
            </Button>

            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenAdd}
            >
              Add Corporate
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Card>
        <CorporateTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
          filterStatus={filterStatus}
          onFilterStatus={(value) => {
            setFilterStatus(value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 900 }}>
              <CorporateTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => String(row.id))
                  )
                }
                headLabel={columns}
              />

              <TableBody>
                {loading
                  ? [...Array(8)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={9}>
                          <Skeleton height={60} />
                        </TableCell>
                      </TableRow>
                    ))
                  : dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <CorporateTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                          onSelectRow={() => table.onSelectRow(String(row.id))}
                          onEdit={handleOpenEdit}
                        />
                      ))}

                <TableEmptyRows
                  height={70}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" mb={3}>
            {modalMode === 'add' ? 'Create New Corporate' : 'Edit Corporate'}
          </Typography>

          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Corporate Code *"
                name="corporateCode"
                value={newCorporate.corporateCode}
                onChange={handleChange}
                error={!!errors.corporateCode}
                helperText={errors.corporateCode}
                disabled={modalMode === 'edit'}
              />
            </Grid> */}
            {modalMode === 'edit' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Corporate Code"
                  value={editCorporate?.corporateCode || ''}
                  disabled
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Corporate Name *"
                name="corporateName"
                value={newCorporate.corporateName}
                onChange={handleChange}
                error={!!errors.corporateName}
                helperText={errors.corporateName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {/* <TextField
                fullWidth
                label="Phone"
                name="phoneNumber"
                value={newCorporate.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              /> */}
              <TextField
                fullWidth
                label="Phone *"
                name="phoneNumber"
                value={newCorporate.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // ✅ Remove non-numbers
                  if (value.length <= 10) {
                    setNewCorporate((prev) => ({
                      ...prev,
                      phoneNumber: value,
                    }));
                  }
                }}
                inputProps={{
                  maxLength: 10, // ✅ Extra safety
                  inputMode: 'numeric',
                }}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                value={newCorporate.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  name="country"
                  // value={newCorporate.country?.id ?? ''}
                  value={(newCorporate.country?.id ?? '').toString()}
                  onChange={handleChange}
                  label="Country"
                >
                  <MenuItem value="">None</MenuItem>
                  {countryList.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  // value={newCorporate.state?.id ?? ''}
                  value={(newCorporate.state?.id ?? '').toString()}
                  onChange={handleChange}
                  label="State"
                >
                  <MenuItem value="">None</MenuItem>
                  {stateList.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={newCorporate.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography component="span">Active Status</Typography>
                <Switch
                  checked={newCorporate.isActive}
                  onChange={(e) => setNewCorporate((p) => ({ ...p, isActive: e.target.checked }))}
                />
              </Box>

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={buttonLoading}>
                  {buttonLoading ? (
                    <CircularProgress size={22} />
                  ) : modalMode === 'add' ? (
                    'Create'
                  ) : (
                    'Update'
                  )}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <CorporateBulkUploadModal
        open={openBulkModal}
        onClose={() => setOpenBulkModal(false)}
        refreshData={refreshData}
      />
    </DashboardContent>
  );
}
