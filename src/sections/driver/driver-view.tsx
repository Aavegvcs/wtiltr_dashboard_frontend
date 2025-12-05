import { useState, useEffect, useCallback, ChangeEvent } from 'react';

import axiosInstance from 'src/config-global';

import {
  CircularProgress,
  Stack,
  IconButton,
  Skeleton,
  TableRow,
  TableCell,
  TextField,
  Modal,
  Grid,
  Button,
  Switch,
  Typography,
  Table,
  TableBody,
  TablePagination,
  Card,
} from '@mui/material';

import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import toast, { Toaster } from 'react-hot-toast';

import { DriverTableHead } from './driver-table-head';
import { DriverTableRow } from './driver-table-row';
import { DriverTableToolbar } from './driver-table-toolbar';

import DriverDocumentsUpload from './driver-documents-upload';
import DriverBulkUploadModal from './driver-bulk-upload';

import { applyFilterDriver, emptyRows, getComparator } from './utils';
import { TableEmptyRows } from './table-empty-rows';
import { TableNoData } from './table-no-data';
import { DriverProps } from './types';
import { safeExtractList } from 'src/utils/responseAdapter';

// --------------------
// Table header columns
// --------------------
const columns = [
  { id: 'name', label: 'Name', align: 'center' as const },
  { id: 'mobileNumber', label: 'Mobile Number', align: 'center' as const },
  { id: 'panNumber', label: 'PAN Number', align: 'center' as const },
  { id: 'status', label: 'Status', align: 'center' as const },
  { id: 'action', label: 'Action', align: 'center' as const },
];

// --------------------
// useTable hook
// --------------------
function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
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

  const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }, []);

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSort,
    onSelectRow,
    onSelectAllRows,
    onChangePage,
    onChangeRowsPerPage,
  };
}

// -----------------------
// Main Component
// -----------------------
export function DriverView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [drivers, setDrivers] = useState<DriverProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [editDriver, setEditDriver] = useState<DriverProps | null>(null);

  const [buttonLoading, setButtonLoading] = useState(false);

  const [newDriver, setNewDriver] = useState<DriverProps>({
    name: '',
    mobileNumber: '',
    panNumber: '',
    cancelCheque: '',
    documents: {},
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const refreshData = () => setRefreshTrigger((v) => v + 1);

  // --------------------
  // Fetch Drivers
  // --------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get('/driver/list');

        console.log('Fetched drivers:', res.data);

        const items = safeExtractList(res.data);

        setDrivers(
          items.map((item: any) => ({
            id: item.id,
            name: item.name,
            mobileNumber: item.mobileNumber,
            panNumber: item.panNumber || '',
            cancelCheque: item.cancelCheque || '',
            documents: item.documents || {},
            isActive: item.isActive,
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error('Failed to load drivers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);
  // --------------------
  // Modal Handlers
  // --------------------
  const handleOpenAdd = () => {
    setModalMode('add');
    setEditDriver(null);
    setErrors({});
    setNewDriver({
      name: '',
      mobileNumber: '',
      panNumber: '',
      cancelCheque: '',
      documents: {},
      isActive: true,
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (row: DriverProps) => {
    setModalMode('edit');
    setEditDriver(row);
    setErrors({});
    setNewDriver({ ...row });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditDriver(null);
    setErrors({});
  };

  // --------------------
  // Validation
  // --------------------
  const validate = () => {
    const err: Record<string, string> = {};
    if (!newDriver.name.trim()) err.name = 'Required';
    if (!newDriver.mobileNumber.trim()) err.mobileNumber = 'Required';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // --------------------
  // Submit (Create / Update)
  // --------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setButtonLoading(true);

      if (modalMode === 'add') {
        await axiosInstance.post('/driver/create', newDriver);
        toast.success('Driver created successfully!');
      } else {
        await axiosInstance.patch(`/driver/update/${editDriver?.id}`, newDriver);
        toast.success('Driver updated successfully!');
      }

      refreshData();
      handleClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setButtonLoading(false);
    }
  };

  // --------------------
  // Delete Driver
  // --------------------
  const handleDelete = async (row: DriverProps) => {
    if (!confirm('Delete this driver?')) return;

    try {
      await axiosInstance.delete(`/driver/delete/${row.id}`);
      toast.success('Driver deleted successfully!');
      refreshData();
    } catch {
      toast.error('Delete failed');
    }
  };

  // --------------------
  // Status Change
  // --------------------
  const handleStatusToggle = async (row: DriverProps) => {
    try {
      const newStatus = !row.isActive;

      await axiosInstance.patch(`/driver/change-status/${row.id}`, { isActive: newStatus });

      toast.success(`Driver ${newStatus ? 'activated' : 'deactivated'}`);
      refreshData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  // --------------------
  // Filtered Data
  // --------------------
  const dataFiltered = applyFilterDriver({
    inputData: drivers,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStatus,
  });

  const notFound = !dataFiltered.length && !!filterName;

  // --------------------
  // UI Rendering
  // --------------------
  return (
    <DashboardContent>
      <Toaster position="top-right" />

      {/* Header */}
      <Box mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Driver Management</Typography>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={refreshData} color="primary">
              <Iconify icon="eva:refresh-fill" />
            </IconButton>

            <Button variant="outlined" onClick={() => setOpenBulkModal(true)}>
              Bulk Upload
            </Button>

            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenAdd}
            >
              Add Driver
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Table */}
      <Card>
        <DriverTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onChangePage(null, 0);
          }}
          filterStatus={filterStatus}
          onFilterStatus={(value) => {
            setFilterStatus(value);
            table.onChangePage(null, 0);
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 900 }}>
              <DriverTableHead
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
                        <DriverTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                          onSelectRow={() => table.onSelectRow(String(row.id))}
                          onEdit={handleOpenEdit}
                          // onDelete={handleDelete}
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
      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '80%', md: '60%' },
            maxHeight: '90%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h5" mb={3}>
            {modalMode === 'add' ? 'Add Driver' : 'Edit Driver'}
          </Typography>

          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name *"
                name="name"
                value={newDriver.name}
                onChange={(e) => setNewDriver((p) => ({ ...p, name: e.target.value }))}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            {/* Mobile */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number *"
                name="mobileNumber"
                value={newDriver.mobileNumber}
                onChange={(e) => setNewDriver((p) => ({ ...p, mobileNumber: e.target.value }))}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
              />
            </Grid>

            {/* PAN */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PAN Number"
                value={newDriver.panNumber}
                onChange={(e) => setNewDriver((p) => ({ ...p, panNumber: e.target.value }))}
              />
            </Grid>

            {/* Cancel Cheque Upload (Image URL) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cancel Cheque (Image URL)"
                value={newDriver.cancelCheque}
                onChange={(e) => setNewDriver((p) => ({ ...p, cancelCheque: e.target.value }))}
              />
            </Grid>

            {/* Document Upload */}
            <Grid item xs={12}>
              <DriverDocumentsUpload
                value={newDriver.documents}
                onChange={(val) => setNewDriver((p) => ({ ...p, documents: val }))}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography component="span">Active Status</Typography>
                <Switch
                  checked={newDriver.isActive}
                  onChange={(e) => setNewDriver((p) => ({ ...p, isActive: e.target.checked }))}
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

      {/* Bulk Upload Modal */}
      <DriverBulkUploadModal
        open={openBulkModal}
        onClose={() => setOpenBulkModal(false)}
        refreshData={refreshData}
      />
    </DashboardContent>
  );
}
