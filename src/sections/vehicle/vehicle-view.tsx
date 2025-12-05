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
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import toast, { Toaster } from 'react-hot-toast';

import { VehicleTableHead } from './vehicle-table-head';
import { VehicleTableRow } from './vehicle-table-row';
import { VehicleTableToolbar } from './vehicle-table-toolbar';
import VehicleBulkUploadModal from './vehicle-bulk-upload';
import VehicleDocumentsUpload from './vehicle-documents-upload';

import { applyFilterVehicle, emptyRows, getComparator } from './utils';
import { TableEmptyRows } from './table-empty-rows';
import { TableNoData } from './table-no-data';
import { VehicleProps } from './types';

// -------------------- Modal Style --------------------
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

// -------------------- Table Columns --------------------
const columns = [
  { id: 'vehicleNumber', label: 'Vehicle Number', align: 'center' as const },
  { id: 'vehicleName', label: 'Vehicle Name', align: 'center' as const },
  { id: 'vehicleModel', label: 'Model', align: 'center' as const },
  { id: 'isActive', label: 'Status', align: 'center' as const },
  { id: 'action', label: 'Action', align: 'center' as const },
];

// -------------------- Table Hook --------------------
export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('vehicleName');
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

// -------------------- Main Component --------------------
export function VehicleView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [open, setOpen] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editVehicle, setEditVehicle] = useState<VehicleProps | null>(null);

  // -------------------- Form State --------------------
  const [vehicleForm, setVehicleForm] = useState<VehicleProps>({
    vehicleNumber: '',
    vehicleName: '',
    vehicleModel: '',
    documents: {},
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // -------------------- Fetch Vehicles --------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/vehicle/list');

        console.log('Fetched vehicles:', res.data);
        const items = res.data?.data?.result?.data || [];

        setVehicles(
          items.map((item: any) => ({
            id: item.id,
            vehicleNumber: item.vehicleNumber,
            vehicleName: item.vehicleName,
            vehicleModel: item.vehicleModel,
            isActive: item.isActive,
            documents: item.documents || {},
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const refreshData = () => setRefreshTrigger((v) => v + 1);

  // -------------------- Modal Handlers --------------------
  const handleOpenAdd = () => {
    setModalMode('add');
    setEditVehicle(null);
    setErrors({});
    setVehicleForm({
      vehicleNumber: '',
      vehicleName: '',
      vehicleModel: '',
      documents: {},
      isActive: true,
    });
    setOpen(true);
  };

  const handleOpenEdit = (row: VehicleProps) => {
    setModalMode('edit');
    setEditVehicle(row);
    setErrors({});
    setVehicleForm({
      vehicleNumber: row.vehicleNumber,
      vehicleName: row.vehicleName,
      vehicleModel: row.vehicleModel,
      documents: row.documents || {},
      isActive: row.isActive,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditVehicle(null);
    setErrors({});
  };

  // -------------------- Form Change --------------------
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVehicleForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!vehicleForm.vehicleNumber.trim()) err.vehicleNumber = 'Required';
    if (!vehicleForm.vehicleName.trim()) err.vehicleName = 'Required';
    if (!vehicleForm.vehicleModel.trim()) err.vehicleModel = 'Required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // -------------------- Submit Form --------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...vehicleForm,
      documents: vehicleForm.documents,
    };

    try {
      setButtonLoading(true);

      if (modalMode === 'add') {
        await axiosInstance.post('/vehicle/create', payload);
        toast.success('Vehicle created!');
      } else {
        await axiosInstance.patch(`/vehicle/update/${editVehicle?.id}`, payload);
        toast.success('Vehicle updated!');
      }

      refreshData();
      handleClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setButtonLoading(false);
    }
  };

  // -------------------- Delete Vehicle --------------------
  const handleDelete = async (row: VehicleProps) => {
    if (!confirm('Delete this vehicle?')) return;

    try {
      await axiosInstance.delete(`/vehicle/delete/${row.id}`);
      toast.success('Vehicle deleted');
      refreshData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const dataFiltered = applyFilterVehicle({
    inputData: vehicles,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStatus,
  });

  const notFound = !dataFiltered.length && !!filterName;

  // -------------------- UI Rendering --------------------
  return (
    <DashboardContent>
      <Toaster position="top-right" />

      <Box mb={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Vehicle Management</Typography>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={refreshData} color="primary">
              <Iconify icon="eva:refresh-fill" />
            </IconButton>

            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:upload-bold" />}
              onClick={() => setOpenBulkModal(true)}
            >
              Bulk Upload
            </Button>

            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenAdd}
            >
              Add Vehicle
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Table */}
      <Card>
        <VehicleTableToolbar
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
              <VehicleTableHead
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
                        <TableCell colSpan={7}>
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
                        <VehicleTableRow
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
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" mb={3}>
            {modalMode === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vehicle Number *"
                name="vehicleNumber"
                value={vehicleForm.vehicleNumber}
                onChange={handleChange}
                error={!!errors.vehicleNumber}
                helperText={errors.vehicleNumber}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vehicle Name *"
                name="vehicleName"
                value={vehicleForm.vehicleName}
                onChange={handleChange}
                error={!!errors.vehicleName}
                helperText={errors.vehicleName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vehicle Model *"
                name="vehicleModel"
                value={vehicleForm.vehicleModel}
                onChange={handleChange}
                error={!!errors.vehicleModel}
                helperText={errors.vehicleModel}
              />
            </Grid>

            {/* Document Upload */}
            <Grid item xs={12}>
              <VehicleDocumentsUpload
                value={vehicleForm.documents}
                onChange={(d) =>
                  setVehicleForm((prev) => ({
                    ...prev,
                    documents: d,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography component="span">Active Status</Typography>
                <Switch
                  checked={vehicleForm.isActive}
                  onChange={(e) => setVehicleForm((p) => ({ ...p, isActive: e.target.checked }))}
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
      <VehicleBulkUploadModal
        open={openBulkModal}
        onClose={() => setOpenBulkModal(false)}
        refreshData={refreshData}
      />
    </DashboardContent>
  );
}
