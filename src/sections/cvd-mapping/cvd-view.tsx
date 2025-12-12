import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import axiosInstance from 'src/config-global';

import {
  Box,
  Card,
  Button,
  Stack,
  Typography,
  Table,
  TableBody,
  IconButton,
  Skeleton,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import toast, { Toaster } from 'react-hot-toast';

import { CvdTableHead } from './cvd-table-head';
import { CvdTableRow } from './cvd-table-row';
import { CvdTableToolbar } from './cvd-table-toolbar';
import { TableEmptyRows } from './table-empty-rows';
import { TableNoData } from './table-no-data';

import CvdAddEditModal from './cvd-add-edit-modal';
import CvdBulkUploadModal from './cvd-bulk-upload';

import { CvdMappingProps } from './types';
import { applyFilterCvd, emptyRows, getComparator } from './utils';

// ----------------------------------------------------
// TABLE HOOK
// ----------------------------------------------------
export function useTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('corporate.corporateName');
  const [selected, setSelected] = useState<string[]>([]);

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectRow = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSort,
    onSelectRow,
    onResetPage: () => setPage(0),
    onSelectAllRows: (checked: boolean, newSelected: string[]) =>
      selected.length ? setSelected([]) : setSelected(newSelected),
    onChangePage: (_: any, newPage: number) => setPage(newPage),
    onChangeRowsPerPage: (e: ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    },
  };
}

// ----------------------------------------------------
// MAIN CVD VIEW
// ----------------------------------------------------
export function CvdView() {
  const table = useTable();

  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [cvdMappings, setCvdMappings] = useState<CvdMappingProps[]>([]);

  // List data
  const [corporates, setCorporates] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  // Modals
  const [openModal, setOpenModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);

  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editItem, setEditItem] = useState<CvdMappingProps | null>(null);

  // ----------------------------------------------------
  // FETCH LISTS + MAPPINGS
  // ----------------------------------------------------
  // useEffect(() => {
  //   const fetchAll = async () => {
  //     try {
  //       setLoading(true);

  //       const [cvdRes, corpRes, branchRes, vehicleRes, driverRes] = await Promise.all([
  //         axiosInstance.get('/cvd-mapping/list'),
  //         axiosInstance.post('/companies/list'),
  //         axiosInstance.post('/branches/list'),
  //         axiosInstance.get('/vehicle/list'),
  //         axiosInstance.get('/driver/list'),
  //       ]);

  //       // CVD mappings
  //       const cvdList = Array.isArray(cvdRes.data?.data?.result) ? cvdRes.data.data.result : [];

  //       setCvdMappings(
  //         cvdList.map((m: any) => ({
  //           id: m.id,
  //           corporate: m.corporate,
  //           branch: m.branch,
  //           vehicle: m.vehicle,
  //           driver: m.driver,
  //           isActive: m.isActive,
  //         }))
  //       );

  //       // ✅ RESTORED WORKING LOGIC for corporate & branch
  //       setCorporates(corpRes.data?.data?.items || []);
  //       setBranches(branchRes.data?.data?.items || []);
  //       console.log("corporates response:", corpRes.data)
  //       console.log("branches response:", branchRes.data)

  //       // ✅ Vehicle & Driver (NEW corrected logic)
  //       setVehicles(vehicleRes.data?.data?.result?.data || []);
  //       setDrivers(driverRes.data?.data?.result?.data || []);
  //     } catch (err) {
  //       console.error(err);
  //       toast.error('Failed to load CVD data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAll();
  // }, [refreshTrigger]);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [cvdRes, corpRes, branchRes, vehicleRes, driverRes] = await Promise.all([
          axiosInstance.get('/cvd-mapping/list'),
          axiosInstance.post('/corporate/list'),
          axiosInstance.post('/branches/list'),
          axiosInstance.get('/vehicle/list'),
          axiosInstance.get('/driver/list'),
        ]);

        // ✅ CVD Mappings (keep as-is)
        const cvdList = Array.isArray(cvdRes.data?.data?.result) ? cvdRes.data.data.result : [];

        setCvdMappings(
          cvdList.map((m: any) => ({
            id: m.id,
            corporate: m.corporate,
            branch: m.branch,
            vehicle: m.vehicle,
            driver: m.driver,
            isActive: m.isActive,
          }))
        );

        // ✅ ONLY ACTIVE CORPORATES
        const activeCorporates = (corpRes.data?.data?.items || []).filter(
          (c: any) => c.isActive === true
        );
        setCorporates(activeCorporates);

        // ✅ ONLY ACTIVE BRANCHES
        const activeBranches = (branchRes.data?.data?.items || []).filter(
          (b: any) => b.isActive === true
        );
        setBranches(activeBranches);

        // ✅ ONLY ACTIVE VEHICLES
        const activeVehicles = (vehicleRes.data?.data?.result?.data || []).filter(
          (v: any) => v.isActive === true
        );
        setVehicles(activeVehicles);

        // ✅ ONLY ACTIVE DRIVERS
        const activeDrivers = (driverRes.data?.data?.result?.data || []).filter(
          (d: any) => d.isActive === true
        );
        setDrivers(activeDrivers);

        console.log('Active corporates:', activeCorporates);
        console.log('Active branches:', activeBranches);
        console.log('Active vehicles:', activeVehicles);
        console.log('Active drivers:', activeDrivers);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load CVD data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [refreshTrigger]);

  const refreshData = () => setRefreshTrigger((v) => v + 1);

  // ----------------------------------------------------
  // MODAL HANDLERS
  // ----------------------------------------------------
  const openAddModal = () => {
    setModalMode('add');
    setEditItem(null);
    setOpenModal(true);
  };

  const openEditModal = (row: CvdMappingProps) => {
    setModalMode('edit');
    setEditItem(row);
    setOpenModal(true);
  };

  const handleDelete = async (row: CvdMappingProps) => {
    if (!confirm('Delete mapping?')) return;

    try {
      await axiosInstance.delete(`/cvd-mapping/delete/${row.id}`);
      toast.success('Mapping deleted');
      refreshData();
    } catch {
      toast.error('Delete failed');
    }
  };

  // ----------------------------------------------------
  // FILTERING
  // ----------------------------------------------------
  const dataFiltered = applyFilterCvd({
    inputData: cvdMappings,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStatus,
  });

  return (
    <DashboardContent>
      <Toaster position="top-right" />
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">CVD Mapping</Typography>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={refreshData}>
              <Iconify icon="eva:refresh-fill" />
            </IconButton>

            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:upload-square-outline" />}
              onClick={() => setOpenBulkModal(true)}
            >
              Bulk Upload
            </Button>

            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openAddModal}
            >
              Add Mapping
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Card>
        <CvdTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
          onFilterStatus={(value) => {
            setFilterStatus(value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <CvdTableHead
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
                headLabel={[
                  { id: 'corporate.corporateName', label: 'Corporate' },
                  { id: 'branch.name', label: 'Branch' },
                  { id: 'vehicle.vehicleNumber', label: 'Vehicle' },
                  { id: 'driver.name', label: 'Driver' },
                  { id: 'isActive', label: 'Status' },
                  { id: 'action', label: 'Action' },
                ]}
              />

              <TableBody>
                {loading
                  ? [...Array(8)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6}>
                          <Skeleton height={60} />
                        </td>
                      </tr>
                    ))
                  : dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        // <CvdTableRow
                        //   key={row.id}
                        //   row={row}
                        //   selected={table.selected.includes(String(row.id))}
                        //   onSelectRow={() => table.onSelectRow(String(row.id))}
                        //   onEdit={openEditModal}
                        //   onDelete={handleDelete}
                        // />
                        <CvdTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                          onSelectRow={() => table.onSelectRow(String(row.id))}
                          onEdit={openEditModal}
                          onDelete={handleDelete}
                          refreshData={refreshData} // ✅ ADD THIS
                        />
                      ))}

                <TableEmptyRows
                  height={70}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {!loading && dataFiltered.length === 0 && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* MODAL */}
      <CvdAddEditModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        mode={modalMode}
        editItem={editItem}
        corporates={corporates}
        branches={branches}
        vehicles={vehicles}
        drivers={drivers}
        mappings={cvdMappings} // IMPORTANT
        refreshData={refreshData}
      />

      {/* BULK UPLOAD */}
      <CvdBulkUploadModal
        open={openBulkModal}
        onClose={() => setOpenBulkModal(false)}
        refreshData={refreshData}
      />
    </DashboardContent>
  );
}
