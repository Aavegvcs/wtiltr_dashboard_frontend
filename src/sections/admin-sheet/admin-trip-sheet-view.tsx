import { useEffect, useState } from 'react';
import axiosInstance from 'src/config-global';
import {
  Box,
  Card,
  Stack,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  IconButton,
  Skeleton,
  Button,
  TextField,
  Autocomplete,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import toast from 'react-hot-toast';

import { TripSheetTableHead } from '../tripsheet/trip-sheet-table-head';
import TripSheetViewModal from '../tripsheet/trip-sheet-view-modal';

import { AdminTripSheetRow } from './admin-trip-sheet-row';

/* ---------------- TYPES ---------------- */
type Corporate = { id: number; corporateName: string };
type Branch = { id: number; name: string; corporate?: { id: number } };

/* ---------------- TABLE HEADER TYPE ---------------- */
type AdminHeadLabel = {
  id: string;
  label: string;
  align?: 'center' | 'right' | 'left';
};

export function AdminTripSheetView() {
  /* ---------------- TABLE STATE ---------------- */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ---------------- DATA STATE ---------------- */
  const [tripSheets, setTripSheets] = useState<any[]>([]);
  const [corporates, setCorporates] = useState<Corporate[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  /* ---------------- FILTER STATE ---------------- */
  const today = new Date().toISOString().substring(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().substring(0, 10);

  const [selectedCorporate, setSelectedCorporate] = useState<Corporate | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [fromDate, setFromDate] = useState(weekAgo);
  const [toDate, setToDate] = useState(today);

  /* UI */
  const [loading, setLoading] = useState(true);
  const [openView, setOpenView] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  /* =====================================================
    LOAD CORPORATES + BRANCHES
  ===================================================== */
  const loadDropdowns = async () => {
    try {
      const [corpRes, branchRes] = await Promise.all([
        axiosInstance.post('/corporate/list'),
        axiosInstance.post('/branches/list'),
      ]);

      const corpList = corpRes.data?.data?.items || [];
      const branchList = branchRes.data?.data?.items || [];

      setCorporates(corpList);
      setBranches(branchList);
    } catch (err) {
      toast.error('Failed to load corporate / branch filters');
    }
  };

  /* =====================================================
    LOAD APPROVED TRIP SHEETS
  ===================================================== */
  const loadData = async () => {
    setLoading(true);

    try {
      const payload = {
        page: page + 1,
        limit: rowsPerPage,
        corporateId: selectedCorporate?.id || 0, // 0 = all
        branchId: selectedBranch?.id || 0, // 0 = all
        fromDate,
        toDate,
      };

      const res = await axiosInstance.post('/tripsheet/getTripSheetForOperations', payload);

      console.log('Admin API Response4545:', res.data);

      // const items = res.data?.data?.result?.items || [];

      // setTripSheets(items);
      const result = res.data?.data?.result;

      setTripSheets(result?.items || []);
      setTotalCount(result?.total || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load approved trip sheets');
    } finally {
      setLoading(false);
    }
  };

  /* INITIAL LOAD */
  useEffect(() => {
    loadDropdowns();
    loadData();
  }, []);

  /* LOAD DATA WHEN FILTERS CHANGE */
  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, selectedCorporate, selectedBranch, fromDate, toDate]);

  /* =====================================================
    CSV DOWNLOAD
  ===================================================== */
  const downloadCSV = () => {
    if (!tripSheets.length) {
      toast.error('No data available to export');
      return;
    }

    const header = [
      'Trip ID,Corporate,Branch,Driver,Mobile,Vehicle,Trip Date,Start Time,End Time,Start KM,End KM,Total KM,Source,Destination,driverSign,driverSignLat,driverSignLng,userSign,userSignLat,userSignLng',
    ];

    const rows = tripSheets.map((t: any) =>
      [
        t.id,
        t.corporate?.corporateName || '',
        t.branch?.name || '',
        t.driver?.name || '',
        t.driver?.mobileNumber || '',
        t.vehicle?.vehicleNumber || '',
        t.tripDate || '',
        t.startTime || '',
        t.endTime || '',
        t.startOdometer || '',
        t.endOdometer || '',
        t.totalKm || '',
        t.sourceName || '',
        t.destinationName || '',
        t.driverSign || '',
        t.driverSignLat || '',
        t.driverSignLng || '',
        t.userSign || '',
        t.userSignLat || '',
        t.userSignLng || '',
      ].join(',')
    );

    const csv = [...header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'approved-trip-sheets.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  };

  /* =====================================================
    VIEW MODAL
  ===================================================== */
  const openDetail = (row: any) => {
    setViewItem(row);
    setOpenView(true);
  };

  /* =====================================================
    TABLE HEADERS
  ===================================================== */
  const columns: AdminHeadLabel[] = [
    { id: 'id', label: 'Trip ID', align: 'center' },
    { id: 'corporate', label: 'Corporate', align: 'center' },
    { id: 'branch', label: 'Branch', align: 'center' },
    { id: 'driver', label: 'Driver', align: 'center' },
    { id: 'vehicle', label: 'Vehicle', align: 'center' },
    { id: 'tripDate', label: 'Trip Date', align: 'center' },
    { id: 'totalKm', label: 'KM', align: 'center' },
    { id: 'tripStatus', label: 'Status', align: 'center' },
    { id: 'action', label: 'Action', align: 'center' },
  ];

  /* =====================================================
    RENDER UI
  ===================================================== */
  return (
    <DashboardContent>
      {/* HEADER */}
      <Box mb={5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Approved Trip Sheets</Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={downloadCSV}>
              Download CSV
            </Button>

            <IconButton onClick={loadData}>
              <Iconify icon="eva:refresh-fill" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* FILTER PANEL */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {/* CORPORATE FILTER */}
          <Autocomplete
            sx={{ width: 250 }}
            options={[{ id: 0, corporateName: 'All Corporates' }, ...corporates]}
            value={selectedCorporate || { id: 0, corporateName: 'All Corporates' }}
            getOptionLabel={(o) => o.corporateName || ''}
            onChange={(_, v) => {
              setSelectedCorporate(v?.id === 0 ? null : v);
              setSelectedBranch(null);
              setPage(0);
            }}
            renderInput={(p) => <TextField {...p} label="Corporate" size="small" />}
          />

          {/* BRANCH FILTER */}
          <Autocomplete
            sx={{ width: 250 }}
            options={
              selectedCorporate
                ? branches.filter((b) => b.corporate?.id === selectedCorporate.id)
                : [{ id: 0, name: 'All Branches' }, ...branches]
            }
            value={selectedBranch || { id: 0, name: 'All Branches' }}
            getOptionLabel={(o) => o.name || ''}
            onChange={(_, v) => {
              setSelectedBranch(v?.id === 0 ? null : v);
              setPage(0);
            }}
            renderInput={(p) => <TextField {...p} label="Branch" size="small" />}
          />

          {/* DATE FILTERS */}
          <TextField
            type="date"
            label="From"
            size="small"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <TextField
            type="date"
            label="To"
            size="small"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Stack>
      </Card>

      {/* TABLE */}
      <Card>
        <Scrollbar>
          <TableContainer>
            <Table>
              <TripSheetTableHead
                order="asc"
                orderBy="id"
                rowCount={tripSheets.length}
                numSelected={0}
                onSort={() => {}}
                onSelectAllRows={() => {}}
                headLabel={columns}
              />

              <TableBody>
                {loading
                  ? [...Array(8)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={10}>
                          <Skeleton height={55} />
                        </td>
                      </tr>
                    ))
                  : tripSheets.map((row) => (
                      <AdminTripSheetRow key={row.id} row={row} onView={() => openDetail(row)} />
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* <TablePagination
          component="div"
          count={tripSheets.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        /> */}
        <TablePagination
          component="div"
          count={totalCount} // 🔥 BACKEND TOTAL
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>

      {/* VIEW MODAL */}
      <TripSheetViewModal open={openView} onClose={() => setOpenView(false)} item={viewItem} />
    </DashboardContent>
  );
}
