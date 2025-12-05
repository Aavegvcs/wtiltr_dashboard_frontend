
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Modal,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Switch,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';

import toast from 'react-hot-toast';
import { Scrollbar } from 'src/components/scrollbar';

import BranchTableHead from './branch-table-head';
import BranchTableRow from './branch-table-row';
import BranchTableToolbar from './branch-table-toolbar';
import TableEmptyRows from './table-empty-rows';
import TableNoData from './table-no-data';
import BranchBulkUpload from './branch-bulk-upload';

import type { BranchItem } from './types';
import type { HeadLabel } from './branch-table-head';

import {
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  toggleBranchStatus,
  getCorporatesForDropdown,
  getStatesForDropdown,
} from './branch-service';

// ---------------------------------------
// Typed Columns (Fix error)
// ---------------------------------------
const columns: HeadLabel[] = [
  { id: 'id', label: 'ID', align: 'center', minWidth: 60 },
  { id: 'branchCode', label: 'Branch Code', align: 'center', minWidth: 120 },
  { id: 'corporateName', label: 'Corporate', align: 'center', minWidth: 140 },
  { id: 'name', label: 'Name', align: 'center', minWidth: 150 },
  { id: 'stateName', label: 'State', align: 'center', minWidth: 120 },
  { id: 'city', label: 'City', align: 'center', minWidth: 120 },
  { id: 'isActive', label: 'Status', align: 'center', minWidth: 100 },
  { id: 'action', label: 'Action', align: 'center', minWidth: 120 },
];

export default function BranchView() {
  const table = useLocalTable();

  const [filterName, setFilterName] = useState('');
  const [rows, setRows] = useState<BranchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [openBulk, setOpenBulk] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editRow, setEditRow] = useState<BranchItem | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  // 🟢 pincode → null (Fix TS error)
  const [form, setForm] = useState<Partial<BranchItem>>({
    branchCode: '',
    name: '',
    corporateId: '',
    stateId: '',
    city: '',
    pincode: null,
    address: '',
    isActive: true,
    email: '',
    phone: '',
  });

  const [corporates, setCorporates] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  // ---------------------------------------
  // Fetch Branch List
  // ---------------------------------------
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const skip = table.page * table.rowsPerPage;
      const limit = table.rowsPerPage;

      const res = await listBranches(skip, limit);
      const items = res?.items ?? [];

      const mapped = items.map((b: any) => ({
        id: b.id,
        branchCode: b.branchCode,
        name: b.name,
        corporateId: b.corporate?.id ?? null,
        corporateName: b.corporate?.corporateName ?? '',
        stateId: b.state?.id ?? null,
        stateName: b.state?.name ?? '',
        city: b.city,
        pincode: b.pincode,
        address: b.address,
        email: b.email,
        phone: b.phone,
        isActive: b.isActive,
      }));

      setRows(mapped);
    } catch (e) {
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  }, [table.page, table.rowsPerPage]);

  // ---------------------------------------
  // Fetch Corporate + State dropdown data
  // ---------------------------------------
  const fetchDropdowns = useCallback(async () => {
    try {
      const corp = await getCorporatesForDropdown();
      setCorporates(corp?.items ?? []);

      const st = await getStatesForDropdown();
      setStates(st ?? []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchList();
    fetchDropdowns();
  }, [fetchList, fetchDropdowns]);

  // ---------------------------------------
  // Open Add Modal
  // ---------------------------------------
  const openAdd = () => {
    setModalMode('add');
    setEditRow(null);
    setForm({
      branchCode: '',
      name: '',
      corporateId: '',
      stateId: '',
      city: '',
      pincode: null, // Fix
      address: '',
      isActive: true,
      email: '',
      phone: '',
    });
    setOpenModal(true);
  };

  // ---------------------------------------
  // Open Edit Modal
  // ---------------------------------------
  const openEdit = (row: BranchItem) => {
    setModalMode('edit');
    setEditRow(row);

    const { id, ...rest } = row;
    setForm(rest);

    setOpenModal(true);
  };

  const closeModal = () => setOpenModal(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelect = (name: string, value: any) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  // ---------------------------------------
  // Create Branch
  // ---------------------------------------
  const handleCreate = async () => {
    setButtonLoading(true);
    try {
      const payload = {
        ...form,
        pincode: form.pincode ? Number(form.pincode) : null,
        isActive: Boolean(form.isActive),
      };

      await createBranch(payload);

      toast.success('Branch created');
      fetchList();
      closeModal();
    } catch (e) {
      toast.error('Failed to create branch');
    } finally {
      setButtonLoading(false);
    }
  };

  // ---------------------------------------
  // Update Branch
  // ---------------------------------------
  const handleUpdate = async () => {
    if (!editRow) return;
    setButtonLoading(true);

    try {
      const payload = {
        ...form,
        pincode: form.pincode ? Number(form.pincode) : null,
        isActive: Boolean(form.isActive),
      };

      await updateBranch(String(editRow.id), payload);

      toast.success('Branch updated');
      fetchList();
      closeModal();
    } catch (e) {
      toast.error('Failed to update');
    } finally {
      setButtonLoading(false);
    }
  };

  // ---------------------------------------
  // Delete Branch
  // ---------------------------------------
  const handleDelete = async (row: BranchItem) => {
    if (!window.confirm('Delete branch?')) return;

    try {
      await deleteBranch(String(row.id));
      toast.success('Branch deleted');
      fetchList();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  // ---------------------------------------
  // Toggle Status (Fix: Only 1 parameter)
  // ---------------------------------------
  const handleToggleStatus = async (row: BranchItem) => {
    try {
      await toggleBranchStatus(String(row.id)); // FIXED
      toast.success('Status updated');
      fetchList();
    } catch (e) {
      toast.error('Failed');
    }
  };

  const submitModal = () => (modalMode === 'add' ? handleCreate() : handleUpdate());

  // ---------------------------------------
  // Filter + Pagination
  // ---------------------------------------
  const filtered = rows.filter((r) => {
    const q = filterName.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.branchCode?.toLowerCase().includes(q) ||
      String(r.id).includes(q) ||
      r.corporateName?.toLowerCase().includes(q)
    );
  });

  const paginated = filtered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  // ---------------------------------------
  // Render Component
  // ---------------------------------------
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Branches</Typography>

        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={() => setOpenBulk(true)}>
            Bulk Upload
          </Button>
          <Button variant="contained" onClick={openAdd}>
            Add Branch
          </Button>
        </Box>
      </Box>

      {/* TABLE */}
      <Card>
        <BranchTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <BranchTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={filtered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    filtered.map((r) => String(r.id))
                  )
                }
                headLabel={columns}
              />

              <TableBody>
                {loading ? (
                  <TableRowPlaceholder colSpan={8} />
                ) : (
                  paginated.map((row) => (
                    <BranchTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                      onEdit={() => openEdit(row)}
                      onDelete={() => handleDelete(row)}
                      onToggleStatus={() => handleToggleStatus(row)}
                    />
                  ))
                )}

                <TableEmptyRows
                  emptyRows={Math.max(0, (1 + table.page) * table.rowsPerPage - filtered.length)}
                />

                {!loading && filtered.length === 0 && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={filtered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* MODAL */}
      <Modal open={openModal} onClose={closeModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            maxWidth: 900,
            bgcolor: 'white',
            p: 3,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" mb={2}>
            {modalMode === 'add' ? 'Create Branch' : 'Edit Branch'}
          </Typography>

          <Grid container spacing={2}>
            {/* Branch Code */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Branch Code"
                name="branchCode"
                value={form.branchCode ?? ''}
                onChange={handleChange}
                fullWidth
                size="small"
                disabled={modalMode === 'edit'}
              />
            </Grid>

            {/* Corporate */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Select
                  displayEmpty
                  value={form.corporateId ?? ''}
                  onChange={(e) => handleSelect('corporateId', e.target.value)}
                >
                  <MenuItem value="">Select Corporate</MenuItem>
                  {corporates.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.corporateName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={form.name ?? ''}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* State Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Select
                  displayEmpty
                  value={form.stateId ?? ''}
                  onChange={(e) => handleSelect('stateId', e.target.value)}
                >
                  <MenuItem value="">Select State</MenuItem>
                  {states.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                name="city"
                value={form.city ?? ''}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Pincode */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pincode"
                name="pincode"
                value={form.pincode ?? ''}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={form.address ?? ''}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={form.email ?? ''}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                name="phone"
                value={form.phone ?? ''}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              <Typography sx={{ mr: 2 }}>Active</Typography>
              <Switch
                checked={Boolean(form.isActive)}
                onChange={(e) => handleSelect('isActive', e.target.checked)}
              />
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="contained" onClick={submitModal} disabled={buttonLoading}>
                {buttonLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : modalMode === 'add' ? (
                  'Save'
                ) : (
                  'Update'
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <BranchBulkUpload
        open={openBulk}
        onClose={() => setOpenBulk(false)}
        refresh={() => {
          setOpenBulk(false);
          fetchList();
        }}
      />
    </Box>
  );
}

// ---------------------------------------
// Table Helper Hook
// ---------------------------------------
function useLocalTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = (id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const onSelectAllRows = (checked: boolean, ids: string[]) => {
    setSelected(checked ? ids : []);
  };

  const onSelectRow = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSort,
    onSelectRow,
    onSelectAllRows,
    onResetPage: () => setPage(0),
    onChangePage: (_e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) =>
      setPage(newPage),

   onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(0);
    },
  };
}

// ---------------------------------------
function TableRowPlaceholder({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ textAlign: 'center', padding: 24 }}>
        <CircularProgress />
      </td>
    </tr>
  );
}
