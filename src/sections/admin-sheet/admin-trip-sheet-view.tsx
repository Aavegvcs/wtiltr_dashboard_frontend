// import { useEffect, useState } from 'react';
// import axiosInstance from 'src/config-global';
// import {
//   Box,
//   Card,
//   Stack,
//   Typography,
//   Table,
//   TableBody,
//   TableContainer,
//   TablePagination,
//   IconButton,
//   Skeleton,
//   Button,
//   TextField,
//   Autocomplete,
// } from '@mui/material';

// import { DashboardContent } from 'src/layouts/dashboard';
// import { Scrollbar } from 'src/components/scrollbar';
// import { Iconify } from 'src/components/iconify';
// import toast from 'react-hot-toast';

// import { TripSheetTableHead } from '../tripsheet/trip-sheet-table-head';
// import TripSheetViewModal from '../tripsheet/trip-sheet-view-modal';

// import { AdminTripSheetRow } from './admin-trip-sheet-row';

// /* ---------------- TYPES ---------------- */
// type Corporate = { id: number; corporateName: string };
// type Branch = { id: number; name: string; corporate?: { id: number } };

// export function AdminTripSheetView() {
//   /* ---------------- TABLE STATE ---------------- */
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   /* ---------------- DATA STATE ---------------- */
//   const [tripSheets, setTripSheets] = useState<any[]>([]);
//   const [corporates, setCorporates] = useState<Corporate[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);

//   /* ---------------- FILTER STATE ---------------- */
//   const today = new Date().toISOString().substring(0, 10);
//   const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().substring(0, 10);

//   const [selectedCorporate, setSelectedCorporate] = useState<Corporate | null>(null);
//   const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

//   const [fromDate, setFromDate] = useState(weekAgo);
//   const [toDate, setToDate] = useState(today);

//   /* UI */
//   const [loading, setLoading] = useState(true);
//   const [openView, setOpenView] = useState(false);
//   const [viewItem, setViewItem] = useState(null);

//   /* =====================================================
//     LOAD CORPORATES + BRANCHES
//   ===================================================== */
//   const loadDropdowns = async () => {
//     try {
//       const [corpRes, branchRes] = await Promise.all([
//         axiosInstance.post('/companies/list'),
//         axiosInstance.post('/branches/list'),
//       ]);

//       const corpList = corpRes.data?.data?.items || [];
//       const branchList = branchRes.data?.data?.items || [];

//       setCorporates(corpList);
//       setBranches(branchList);

//       // Auto-select first corporate
//       if (corpList.length > 0 && !selectedCorporate) {
//         setSelectedCorporate(corpList[0]);
//       }
//     } catch (err) {
//       toast.error('Failed to load corporate / branch filters');
//     }
//   };

//   /* =====================================================
//     AUTO SELECT FIRST BRANCH WHEN CORPORATE CHANGES
//   ===================================================== */
//   useEffect(() => {
//     if (!selectedCorporate || branches.length === 0) return;

//     const filtered = branches.filter(
//       (b) => b.corporate?.id === selectedCorporate.id
//     );

//     if (filtered.length > 0) {
//       setSelectedBranch(filtered[0]);
//     }
//   }, [selectedCorporate, branches]);

//   /* =====================================================
//     LOAD APPROVED TRIP SHEETS
//   ===================================================== */
//   const loadData = async () => {
//     if (!selectedCorporate || !selectedBranch) return;

//     setLoading(true);

//     try {
//       const payload = {
//         page: page + 1,
//         limit: rowsPerPage,
//         corporateId: selectedCorporate.id,
//         branchId: selectedBranch.id,
//         fromDate,
//         toDate,
//       };

//       const res = await axiosInstance.post(
//         '/tripsheet/getTripSheetForOperations',
//         payload
//       );

//       console.log('Trip sheet fetch response:', res);

//       const items = res.data?.data?.result?.items || [];

//       setTripSheets(items);
//       console.log('Loaded trip sheets:', items);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to load approved trip sheets');
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* INITIAL LOAD */
//   useEffect(() => {
//     loadDropdowns();
//   }, []);

//   /* LOAD DATA WHEN FILTERS CHANGE */
//   useEffect(() => {
//     if (selectedCorporate && selectedBranch) {
//       loadData();
//     }
//   }, [page, rowsPerPage, selectedCorporate, selectedBranch, fromDate, toDate]);

//   /* =====================================================
//     CSV DOWNLOAD
//   ===================================================== */
//   const downloadCSV = () => {
//     if (!tripSheets.length) {
//       toast.error('No data available to export');
//       return;
//     }

//     const header = [
//       'Trip ID,Corporate,Branch,Driver,Mobile,Vehicle,Trip Date,Start Time,End Time,Start KM,End KM,Total KM,Source,Destination',
//     ];

//     const rows = tripSheets.map((t: any) =>
//       [
//         t.id,
//         t.corporate?.corporateName || '',
//         t.branch?.name || '',
//         t.driver?.name || '',
//         t.driver?.mobileNumber || '',
//         t.vehicle?.vehicleNumber || '',
//         t.tripDate || '',
//         t.startTime || '',
//         t.endTime || '',
//         t.startOdometer || '',
//         t.endOdometer || '',
//         t.totalKm || '',
//         t.sourceName || '',
//         t.destinationName || '',
//       ].join(',')
//     );

//     const csv = [...header, ...rows].join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'approved-trip-sheets.csv';
//     a.click();

//     window.URL.revokeObjectURL(url);
//   };

//   /* =====================================================
//     VIEW MODAL
//   ===================================================== */
//   const openDetail = (row: any) => {
//     setViewItem(row);
//     setOpenView(true);
//   };

//   /* =====================================================
//     TABLE HEADERS
//   ===================================================== */
// type AdminHeadLabel = {
//   id: string;
//   label: string;
//   align?: 'center' | 'right' | 'left';
// };

// const columns: AdminHeadLabel[] = [
//   { id: 'id', label: 'Trip ID', align: 'center' },
//   { id: 'corporate', label: 'Corporate', align: 'center' },
//   { id: 'branch', label: 'Branch', align: 'center' },
//   { id: 'driver', label: 'Driver', align: 'center' },
//   { id: 'vehicle', label: 'Vehicle', align: 'center' },
//   { id: 'tripDate', label: 'Trip Date', align: 'center' },
//   { id: 'totalKm', label: 'KM', align: 'center' },
//   { id: 'tripStatus', label: 'Status', align: 'center' },
//   { id: 'action', label: 'Action', align: 'center' },
// ];

//   /* =====================================================
//     RENDER UI
//   ===================================================== */
//   return (
//     <DashboardContent>
//       {/* HEADER */}
//       <Box mb={5}>
//         <Stack direction="row" justifyContent="space-between">
//           <Typography variant="h4">Approved Trip Sheets</Typography>

//           <Stack direction="row" spacing={2}>
//             <Button variant="outlined" onClick={downloadCSV}>
//               Download CSV
//             </Button>

//             <IconButton onClick={loadData}>
//               <Iconify icon="eva:refresh-fill" />
//             </IconButton>
//           </Stack>
//         </Stack>
//       </Box>

//       {/* FILTER PANEL */}
//       <Card sx={{ p: 2, mb: 2 }}>
//         <Stack direction="row" spacing={2} flexWrap="wrap">

//           {/* CORPORATE */}
//           <Autocomplete
//             sx={{ width: 250 }}
//             options={corporates}
//             value={selectedCorporate}
//             getOptionLabel={(o) => o.corporateName || ''}
//             onChange={(_, v) => {
//               setSelectedCorporate(v);
//               setSelectedBranch(null);
//               setPage(0);
//             }}
//             renderInput={(p) => (
//               <TextField {...p} label="Corporate" size="small" />
//             )}
//           />

//           {/* BRANCH */}
//           <Autocomplete
//             sx={{ width: 250 }}
//             options={
//               selectedCorporate
//                 ? branches.filter((b) => b.corporate?.id === selectedCorporate.id)
//                 : []
//             }
//             value={selectedBranch}
//             getOptionLabel={(o) => o.name || ''}
//             onChange={(_, v) => {
//               setSelectedBranch(v);
//               setPage(0);
//             }}
//             renderInput={(p) => (
//               <TextField {...p} label="Branch" size="small" />
//             )}
//           />

//           {/* DATE FILTERS */}
//           <TextField
//             type="date"
//             label="From"
//             size="small"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />

//           <TextField
//             type="date"
//             label="To"
//             size="small"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </Stack>
//       </Card>

//       {/* TABLE */}
//       <Card>
//         <Scrollbar>
//           <TableContainer>
//             <Table>

//               <TripSheetTableHead
//                 order="asc"
//                 orderBy="id"
//                 rowCount={tripSheets.length}
//                 numSelected={0}
//                 onSort={() => {}}
//                 onSelectAllRows={() => {}}
//                 headLabel={columns}
//               />

//               <TableBody>
//                 {loading ? (
//                   [...Array(8)].map((_, i) => (
//                     <tr key={i}>
//                       <td colSpan={10}>
//                         <Skeleton height={55} />
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   tripSheets.map((row) => (
//                     <AdminTripSheetRow
//                       key={row.id}
//                       row={row}
//                       onView={() => openDetail(row)}
//                     />
//                   ))
//                 )}
//               </TableBody>

//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           component="div"
//           count={tripSheets.length}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onPageChange={(_, p) => setPage(p)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//           rowsPerPageOptions={[10, 25, 50]}
//         />
//       </Card>

//       {/* VIEW MODAL */}
//       <TripSheetViewModal
//         open={openView}
//         onClose={() => setOpenView(false)}
//         item={viewItem}
//       />
//     </DashboardContent>
//   );
// }
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

      const items = res.data?.data?.result?.items || [];

      setTripSheets(items);
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
      'Trip ID,Corporate,Branch,Driver,Mobile,Vehicle,Trip Date,Start Time,End Time,Start KM,End KM,Total KM,Source,Destination',
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

        <TablePagination
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
        />
      </Card>

      {/* VIEW MODAL */}
      <TripSheetViewModal open={openView} onClose={() => setOpenView(false)} item={viewItem} />
    </DashboardContent>
  );
}
