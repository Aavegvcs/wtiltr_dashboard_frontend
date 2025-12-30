// import { useEffect, useState, useCallback } from 'react';
// import axiosInstance from 'src/config-global';

// import {
//   Box,
//   Card,
//   Button,
//   Stack,
//   Typography,
//   Table,
//   TableBody,
//   IconButton,
//   Skeleton,
//   TableContainer,
//   TablePagination,
// } from '@mui/material';

// import { DashboardContent } from 'src/layouts/dashboard';
// import { Scrollbar } from 'src/components/scrollbar';
// import { Iconify } from 'src/components/iconify';
// import toast from 'react-hot-toast';

// import { TripSheetTableHead } from './trip-sheet-table-head';
// import { TripSheetTableRow } from './trip-sheet-table-row';
// import { TripSheetToolbar } from './trip-sheet-toolbar';
// import { TableEmptyRows } from '../cvd-mapping/table-empty-rows';
// import { TableNoData } from '../cvd-mapping/table-no-data';

// import TripSheetViewModal from './trip-sheet-view-modal';
// import { safeExtractList } from '../../utils/responseAdapter';
// import { getComparator, emptyRows } from '../cvd-mapping/utils';

// // types
// export type TripSheetRow = {
//   id: number;
//   corporate?: any;
//   branch?: any;
//   vehicle?: any;
//   driver?: any;
//   tripDate?: string;
//   startTime?: string;
//   endTime?: string;
//   startOdometer?: number;
//   endOdometer?: number;
//   totalKm?: number;
//   tripStatus?: string | number;
//   documents?: any;
//   createdAt?: string;
//   updatedAt?: string;
// };

// function useTable() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [order, setOrder] = useState<'asc' | 'desc'>('desc');
//   const [orderBy, setOrderBy] = useState('tripDate');
//   const [selected, setSelected] = useState<string[]>([]);
//   const onResetPage = () => setPage(0);

//   const onSort = useCallback(
//     (id: string) => {
//       const isAsc = orderBy === id && order === 'asc';
//       setOrder(isAsc ? 'desc' : 'asc');
//       setOrderBy(id);
//     },
//     [order, orderBy]
//   );

//   const onSelectRow = useCallback((id: string) => {
//     setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
//   }, []);

//   const onSelectAllRows = useCallback((checked: boolean, newSelected: string[]) => {
//     setSelected(checked ? newSelected : []);
//   }, []);

//   // const onResetPage = () => setPage(0);

//   const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);

//   const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(e.target.value, 10));
//     onResetPage();
//   }, []);

//   return {
//     page,
//     rowsPerPage,
//     order,
//     orderBy,
//     selected,
//     onSort,
//     onSelectRow,
//     onSelectAllRows,
//     onChangePage,
//     onResetPage,
//     onChangeRowsPerPage,
//   };
// }

// export default function TripSheetView() {
//   const table = useTable();

//   const [loading, setLoading] = useState(true);
//   const [tripSheets, setTripSheets] = useState<TripSheetRow[]>([]);
//   const [filterName, setFilterName] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'created' | 'submitted' | 'approved'>('all');
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [openView, setOpenView] = useState(false);
//   const [viewItem, setViewItem] = useState<TripSheetRow | null>(null);

//   const refreshData = () => setRefreshKey((k) => k + 1);

//   useEffect(() => {
//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         // Try to fetch dedicated list endpoint first
//         const res = await axiosInstance.get('/tripsheet/getTripSheetForAdmin').catch(() => null);

//         if (res && res.status === 200) {
//           const items = safeExtractList(res.data);
//           setTripSheets(
//             items.map((m: any) => ({
//               id: m.id,
//               corporate: m.corporate,
//               branch: m.branch,
//               vehicle: m.vehicle,
//               driver: m.driver,
//               tripDate: m.tripDate,
//               startTime: m.startTime,
//               endTime: m.endTime,
//               startOdometer: m.startOdometer,
//               endOdometer: m.endOdometer,
//               totalKm: m.totalKm,
//               tripStatus: m.tripStatus,
//               documents: m.documents,
//               createdAt: m.createdAt,
//               updatedAt: m.updatedAt,
//             }))
//           );
//         } else {
//           // fallback: aggregate by drivers
//           const driversRes = await axiosInstance.get('/driver/list');
//           const driverList = safeExtractList(driversRes.data) as any[];

//           // limit concurrency to avoid overload
//           const concurrency = 5;
//           const allTrips: TripSheetRow[] = [];

//           for (let i = 0; i < driverList.length; i += concurrency) {
//             const batch = driverList.slice(i, i + concurrency);
//             const calls = batch.map((d) =>
//               axiosInstance.get(`/tripsheet/driver/${d.id}`).then((r) => safeExtractList(r.data)).catch(() => [])
//             );
//             const results = await Promise.all(calls);
//             results.forEach((arr) => {
//               (arr || []).forEach((m: any) =>
//                 allTrips.push({
//                   id: m.id,
//                   corporate: m.corporate,
//                   branch: m.branch,
//                   vehicle: m.vehicle,
//                   driver: m.driver,
//                   tripDate: m.tripDate,
//                   startTime: m.startTime,
//                   endTime: m.endTime,
//                   startOdometer: m.startOdometer,
//                   endOdometer: m.endOdometer,
//                   totalKm: m.totalKm,
//                   tripStatus: m.tripStatus,
//                   documents: m.documents,
//                   createdAt: m.createdAt,
//                   updatedAt: m.updatedAt,
//                 })
//               );
//             });
//           }

//           setTripSheets(allTrips);
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load trip sheets');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [refreshKey]);

//   // filters & sorting (simple client-side)
//   const filtered = tripSheets
//     .filter((row) => {
//       if (!filterName) return true;
//       const q = filterName.toLowerCase();
//       const text =
//         `${row.driver?.name || ''} ${row.driver?.mobileNumber || ''} ${row.vehicle?.vehicleNumber || ''} ${row.corporate?.corporateName || ''}`.toLowerCase();
//       return text.includes(q);
//     })
//     .filter((row) => {
//       if (filterStatus === 'all') return true;
//       return String(row.tripStatus).toLowerCase() === filterStatus;
//     });

//   const sorted = [...filtered].sort(getComparator(table.order, table.orderBy as any));

//   const notFound = !sorted.length && !!filterName;

//   const openDetail = (row: TripSheetRow) => {
//     setViewItem(row);
//     setOpenView(true);
//   };

//   const handleApprove = async (row: TripSheetRow) => {
//     try {
//       await axiosInstance.patch(`/tripsheet/close/${row.id}`);
//       toast.success('Trip sheet approved/closed');
//       refreshData();
//     } catch (err) {
//       toast.error('Action failed');
//     }
//   };

//   const handleReopen = async (row: TripSheetRow) => {
//     try {
//       await axiosInstance.patch(`/tripsheet/reopen/${row.id}`);
//       toast.success('Trip sheet reopened');
//       refreshData();
//     } catch {
//       toast.error('Action failed');
//     }
//   };

//   // table columns
//   const columns = [
//     { id: 'id', label: 'Trip ID', align: 'center' as const },
//     { id: 'corporate', label: 'Corporate', align: 'center' as const },
//     { id: 'branch', label: 'Branch', align: 'center' as const },
//     { id: 'driver', label: 'Driver', align: 'center' as const },
//     { id: 'vehicle', label: 'Vehicle', align: 'center' as const },
//     { id: 'tripDate', label: 'Trip Date', align: 'center' as const },
//     { id: 'startOdometer', label: 'Start KM', align: 'center' as const },
//     { id: 'endOdometer', label: 'End KM', align: 'center' as const },
//     { id: 'totalKm', label: 'Total KM', align: 'center' as const },
//     { id: 'tripStatus', label: 'Status', align: 'center' as const },
//     { id: 'action', label: 'Action', align: 'center' as const },
//   ];

//   return (
//     <DashboardContent>
//       <Box mb={5}>
//         <Stack direction="row" alignItems="center" justifyContent="space-between">
//           <Typography variant="h4">Trip Sheets</Typography>

//           <Stack direction="row" spacing={1}>
//             <IconButton onClick={refreshData}>
//               <Iconify icon="eva:refresh-fill" />
//             </IconButton>

//             <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
//               New Trip (admin)
//             </Button>
//           </Stack>
//         </Stack>
//       </Box>

//       <Card>
//         <TripSheetToolbar
//           numSelected={table.selected.length}
//           filterName={filterName}
//           onFilterName={(e) => {
//             setFilterName(e.target.value);
//             table.onResetPage?.();
//           }}
//           filterStatus={filterStatus}
//           onFilterStatus={(v) => setFilterStatus(v)}
//         />

//         <Scrollbar>
//           <TableContainer>
//             <Table sx={{ minWidth: 1000 }}>
//               <TripSheetTableHead
//                 order={table.order}
//                 orderBy={table.orderBy}
//                 rowCount={sorted.length}
//                 numSelected={table.selected.length}
//                 onSort={table.onSort}
//                 onSelectAllRows={(checked) =>
//                   table.onSelectAllRows(checked, sorted.map((r) => String(r.id)))
//                 }
//                 headLabel={columns}
//               />

//               <TableBody>
//                 {loading
//                   ? [...Array(8)].map((_, i) => (
//                       <tr key={i}>
//                         <td colSpan={11}>
//                           <Skeleton height={60} />
//                         </td>
//                       </tr>
//                     ))
//                   : sorted
//                       .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
//                       .map((row) => (
//                         <TripSheetTableRow
//                           key={row.id}
//                           row={row}
//                           selected={table.selected.includes(String(row.id))}
//                           onSelectRow={() => table.onSelectRow(String(row.id))}
//                           onView={() => openDetail(row)}
//                           onApprove={() => handleApprove(row)}
//                           onReopen={() => handleReopen(row)}
//                         />
//                       ))}

//                 <TableEmptyRows height={70} emptyRows={emptyRows(table.page, table.rowsPerPage, sorted.length)} />

//                 {notFound && <TableNoData searchQuery={filterName} />}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           component="div"
//           count={sorted.length}
//           page={table.page}
//           rowsPerPage={table.rowsPerPage}
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           onPageChange={table.onChangePage}
//           onRowsPerPageChange={table.onChangeRowsPerPage}
//         />
//       </Card>

//       <TripSheetViewModal open={openView} onClose={() => setOpenView(false)} item={viewItem} />
//     </DashboardContent>
//   );
// }
// ------------------------------------------------------
// TripSheetView.tsx (UPDATED)
// ------------------------------------------------------
// import { useEffect, useState, useCallback } from 'react';
// import axiosInstance from 'src/config-global';

// import {
//   Box,
//   Card,
//   Button,
//   Stack,
//   Typography,
//   Table,
//   TableBody,
//   IconButton,
//   Skeleton,
//   TableContainer,
//   TablePagination,
// } from '@mui/material';

// import { DashboardContent } from 'src/layouts/dashboard';
// import { Scrollbar } from 'src/components/scrollbar';
// import { Iconify } from 'src/components/iconify';
// import toast from 'react-hot-toast';

// import { TripSheetTableHead } from './trip-sheet-table-head';
// import { TripSheetTableRow } from './trip-sheet-table-row';
// import { TripSheetToolbar } from './trip-sheet-toolbar';
// import { TableEmptyRows } from '../cvd-mapping/table-empty-rows';
// import { TableNoData } from '../cvd-mapping/table-no-data';

// import TripSheetViewModal from './trip-sheet-view-modal';
// import { safeExtractList } from '../../utils/responseAdapter';
// import { getComparator, emptyRows } from '../cvd-mapping/utils';

// // ---------------- DEFAULT DATE RANGE (last 7 days) -----------------
// const today = new Date();
// const past7 = new Date();
// past7.setDate(today.getDate() - 7);

// const formatDate = (d: Date) => d.toISOString().substring(0, 10);

// // ---------------- TYPES -----------------
// export type TripSheetRow = {
//   id: number;
//   corporate?: any;
//   branch?: any;
//   vehicle?: any;
//   driver?: any;
//   tripDate?: string;
//   startTime?: string;
//   endTime?: string;
//   startOdometer?: number;
//   endOdometer?: number;
//   totalKm?: number;
//   tripStatus?: number | string;
//   sourceName?: string;
//   destinationName?: string;
//   documents?: any;
//   createdAt?: string;
//   updatedAt?: string;
// };

// // ---------- useTable() ----------
// function useTable() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [order, setOrder] = useState<'asc' | 'desc'>('desc');
//   const [orderBy, setOrderBy] = useState('tripDate');
//   const [selected, setSelected] = useState<string[]>([]);

//   const onResetPage = () => setPage(0);

//   const onSort = useCallback(
//     (id: string) => {
//       const isAsc = orderBy === id && order === 'asc';
//       setOrder(isAsc ? 'desc' : 'asc');
//       setOrderBy(id);
//     },
//     [order, orderBy]
//   );

//   const onSelectRow = useCallback(
//     (id: string) =>
//       setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
//     []
//   );

//   const onSelectAllRows = useCallback((checked: boolean, newSelected: string[]) => {
//     setSelected(checked ? newSelected : []);
//   }, []);

//   const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);

//   const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(e.target.value, 10));
//     onResetPage();
//   }, []);

//   return {
//     page,
//     rowsPerPage,
//     order,
//     orderBy,
//     selected,
//     onSort,
//     onSelectRow,
//     onSelectAllRows,
//     onChangePage,
//     onChangeRowsPerPage,
//     onResetPage,
//   };
// }

// // ------------------------------------------------------
// // MAIN COMPONENT
// // ------------------------------------------------------
// export default function TripSheetView() {
//   const table = useTable();

//   const [loading, setLoading] = useState(true);
//   const [tripSheets, setTripSheets] = useState<TripSheetRow[]>([]);

//   const [filterName, setFilterName] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');

//   // Date Filters
//   const [fromDate, setFromDate] = useState(formatDate(past7));
//   const [toDate, setToDate] = useState(formatDate(today));

//   const [openView, setOpenView] = useState(false);
//   const [viewItem, setViewItem] = useState<TripSheetRow | null>(null);

//   const refreshData = () => loadData();

//   // ------------------ FETCH API ------------------
//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         page: table.page + 1,
//         limit: table.rowsPerPage,
//         fromDate,
//         toDate,
//       };

//       const res = await axiosInstance.post('/tripsheet/getTripSheetForAdmin', payload);

//       // console.log('RAW response:', res.data);

//       const items = safeExtractList(res.data);

//       // console.log('Extracted items:', items);

//       setTripSheets(items);
//     } catch (err) {
//       toast.error('Failed to load trip sheets');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [table.page, table.rowsPerPage, fromDate, toDate]);

//   // ---------------- Filtering ----------------
//   const filtered = tripSheets.filter((row) => {
//     if (!filterName) return true;
//     const q = filterName.toLowerCase();
//     return `${row.driver?.name || ''} ${row.driver?.mobileNumber || ''} ${row.vehicle?.vehicleNumber || ''}`
//       .toLowerCase()
//       .includes(q);
//   });

//   const sorted = [...filtered].sort(getComparator(table.order, table.orderBy as any));

//   const notFound = !sorted.length && !!filterName;

//   // ---------------- Handlers ----------------
//   const openDetail = (row: TripSheetRow) => {
//     setViewItem(row);
//     setOpenView(true);
//   };

//   // ---------------- UI ----------------------
//   const columns = [
//     { id: 'id', label: 'Trip ID', align: 'center' as const },
//     { id: 'corporate', label: 'Corporate', align: 'center' as const },
//     { id: 'branch', label: 'Branch', align: 'center' as const },
//     { id: 'driver', label: 'Driver', align: 'center' as const },
//     { id: 'vehicle', label: 'Vehicle', align: 'center' as const },
//     { id: 'tripDate', label: 'Trip Date', align: 'center' as const },
//     { id: 'startOdometer', label: 'Start KM', align: 'center' as const },
//     { id: 'endOdometer', label: 'End KM', align: 'center' as const },
//     { id: 'totalKm', label: 'Total KM', align: 'center' as const },
//     { id: 'tripStatus', label: 'Status', align: 'center' as const },
//     { id: 'action', label: 'Action', align: 'center' as const },
//   ];

//   return (
//     <DashboardContent>
//       <Box mb={5}>
//         <Stack direction="row" alignItems="center" justifyContent="space-between">
//           <Typography variant="h4">Trip Sheets</Typography>

//           <IconButton onClick={refreshData}>
//             <Iconify icon="eva:refresh-fill" />
//           </IconButton>
//         </Stack>
//       </Box>

//       <Card>
//         <TripSheetToolbar
//           numSelected={table.selected.length}
//           filterName={filterName}
//           onFilterName={(e) => {
//             setFilterName(e.target.value);
//             table.onResetPage();
//           }}
//           filterStatus={filterStatus}
//           onFilterStatus={(v) => setFilterStatus(v)}
//           fromDate={fromDate}
//           toDate={toDate}
//           onFromDate={(v) => {
//             setFromDate(v);
//             table.onResetPage();
//           }}
//           onToDate={(v) => {
//             setToDate(v);
//             table.onResetPage();
//           }}
//         />

//         <Scrollbar>
//           <TableContainer>
//             <Table>
//               <TripSheetTableHead
//                 order={table.order}
//                 orderBy={table.orderBy}
//                 rowCount={sorted.length}
//                 numSelected={table.selected.length}
//                 onSort={table.onSort}
//                 onSelectAllRows={(checked) =>
//                   table.onSelectAllRows(
//                     checked,
//                     sorted.map((r) => String(r.id))
//                   )
//                 }
//                 headLabel={columns}
//               />

//               <TableBody>
//                 {loading
//                   ? [...Array(8)].map((_, i) => (
//                       <tr key={i}>
//                         <td colSpan={11}>
//                           <Skeleton height={55} />
//                         </td>
//                       </tr>
//                     ))
//                   : sorted
//                       .slice(
//                         table.page * table.rowsPerPage,
//                         table.page * table.rowsPerPage + table.rowsPerPage
//                       )
//                       .map((row) => (
//                         <TripSheetTableRow
//                           key={row.id}
//                           row={row}
//                           selected={table.selected.includes(String(row.id))}
//                           onSelectRow={() => table.onSelectRow(String(row.id))}
//                           onView={() => openDetail(row)}
//                           onApprove={() => {}}
//                           onReopen={() => {}}
//                         />
//                       ))}

//                 <TableEmptyRows
//                   height={70}
//                   emptyRows={emptyRows(table.page, table.rowsPerPage, sorted.length)}
//                 />

//                 {notFound && <TableNoData searchQuery={filterName} />}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           component="div"
//           count={sorted.length}
//           page={table.page}
//           rowsPerPage={table.rowsPerPage}
//           rowsPerPageOptions={[10, 25, 50]}
//           onPageChange={table.onChangePage}
//           onRowsPerPageChange={table.onChangeRowsPerPage}
//         />
//       </Card>

//       <TripSheetViewModal open={openView} onClose={() => setOpenView(false)} item={viewItem} />
//     </DashboardContent>
//   );
// }
// trip-sheet-view.tsx
import { useEffect, useState, useCallback } from 'react';
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
import toast from 'react-hot-toast';

import { TripSheetTableHead } from './trip-sheet-table-head';
import { TripSheetTableRow } from './trip-sheet-table-row';
import { TripSheetToolbar } from './trip-sheet-toolbar';
import { TableEmptyRows } from '../cvd-mapping/table-empty-rows';
import { TableNoData } from '../cvd-mapping/table-no-data';

import TripSheetViewModal from './trip-sheet-view-modal';
import TripSheetEditModal from './trip-sheet-edit-modal';
import { safeExtractList } from '../../utils/responseAdapter';
import { getComparator, emptyRows } from '../cvd-mapping/utils';

// ---------------- DEFAULT DATE RANGE (last 7 days) -----------------
const today = new Date();
const past7 = new Date();
past7.setDate(today.getDate() - 7);

const formatDate = (d: Date) => d.toISOString().substring(0, 10);

// ---------------- TYPES -----------------
export type TripSheetRow = {
  id: number;
  corporate?: any;
  branch?: any;
  vehicle?: any;
  driver?: any;
  tripDate?: string;
  startTime?: string;
  endTime?: string;
  startOdometer?: number;
  endOdometer?: number;
  totalKm?: number;
  tripStatus?: number | string;
  sourceName?: string;
  destinationName?: string;
  documents?: any;
  createdAt?: string;
  updatedAt?: string;
  edits?: any[];
  isEdited?: boolean;
  isActive?: boolean;
};

// ---------- useTable() ----------
function useTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState('tripDate');
  const [selected, setSelected] = useState<string[]>([]);

  const onResetPage = () => setPage(0);

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectRow = useCallback(
    (id: string) =>
      setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    []
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelected: string[]) => {
    setSelected(checked ? newSelected : []);
  }, []);

  const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);

  const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    onResetPage();
  }, []);

  return {
    page,
    rowsPerPage,
    order,
    orderBy,
    selected,
    onSort,
    onSelectRow,
    onSelectAllRows,
    onChangePage,
    onChangeRowsPerPage,
    onResetPage,
  };
}

// ------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------
export default function TripSheetView() {
  const table = useTable();

  const [loading, setLoading] = useState(true);
  const [tripSheets, setTripSheets] = useState<TripSheetRow[]>([]);

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Date Filters
  const [fromDate, setFromDate] = useState(formatDate(past7));
  const [toDate, setToDate] = useState(formatDate(today));

  const [openView, setOpenView] = useState(false);
  const [viewItem, setViewItem] = useState<TripSheetRow | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editItem, setEditItem] = useState<TripSheetRow | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const refreshData = () => loadData();

  // ------------------ FETCH API ------------------
  const loadData = async () => {
    setLoading(true);
    try {
      const payload = {
        page: table.page + 1,
        limit: table.rowsPerPage,
        fromDate,
        toDate,
      };

      const res = await axiosInstance.post('/tripsheet/getTripSheetForAdmin', payload);

      // const items = safeExtractList(res.data);
      const result = res.data?.data?.result;
      console.log('Fetched trip sheets:', result);

      // backend returns { items: finalData, total: ... }
      // setTripSheets(items);
      // setTotalCount(res.data?.data?.result?.total || 0);

      setTripSheets(result?.items || []);
      setTotalCount(result?.total || 0);
      console.log('Total count:', result?.total || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load trip sheets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.page, table.rowsPerPage, fromDate, toDate]);

  const downloadCSV = () => {
    if (!tripSheets.length) {
      toast.error('No data available to export');
      return;
    }

    const header = [
      'Trip ID,Corporate,Branch,Driver,Mobile,Vehicle,Trip Date,Start Time,End Time,Start KM,End KM,Total KM,Source,Destination,tripStatus,driverSign,driverSignLat,driverSignLng,userSign,userSignLat,userSignLng',
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
        t.tripStatus || '',
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
    a.download = 'Corporate-trip-sheets.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // ---------------- Filtering ----------------
  const filtered = tripSheets.filter((row) => {
    if (filterStatus !== 'all') {
      // filterStatus is a string numeric; compare numbers
      if (String(row.tripStatus) !== String(filterStatus)) return false;
    }

    if (!filterName) return true;
    const q = filterName.toLowerCase();
    return `${row.driver?.name || ''} ${row.driver?.mobileNumber || ''} ${row.vehicle?.vehicleNumber || ''}`
      .toLowerCase()
      .includes(q);
  });

  const sorted = [...filtered].sort(getComparator(table.order, table.orderBy as any));

  const notFound = !sorted.length && !!filterName;

  // ---------------- Handlers ----------------
  const openDetail = (row: TripSheetRow) => {
    setViewItem(row);
    setOpenView(true);
  };

  const openEditModal = (row: TripSheetRow) => {
    setEditItem(row);
    setOpenEdit(true);
  };

  const onUpdated = () => {
    // simple refresh
    loadData();
  };

  // ---------------- UI ----------------------
  const columns = [
    { id: 'id', label: 'Trip ID', align: 'center' as const },
    { id: 'corporate', label: 'Corporate', align: 'center' as const },
    { id: 'branch', label: 'Branch', align: 'center' as const },
    { id: 'driver', label: 'Driver', align: 'center' as const },
    { id: 'vehicle', label: 'Vehicle', align: 'center' as const },
    { id: 'tripDate', label: 'Trip Date', align: 'center' as const },
    { id: 'startOdometer', label: 'Start KM', align: 'center' as const },
    { id: 'endOdometer', label: 'End KM', align: 'center' as const },
    { id: 'totalKm', label: 'Total KM', align: 'center' as const },
    { id: 'tripStatus', label: 'Status', align: 'center' as const },
    { id: 'action', label: 'Action', align: 'center' as const },
  ];

  return (
    <DashboardContent>
      <Box mb={5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4"> Trip Sheets</Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={downloadCSV}>
              Download CSV
            </Button>

            <IconButton onClick={refreshData}>
              <Iconify icon="eva:refresh-fill" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <Card>
        <TripSheetToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
          filterStatus={filterStatus}
          onFilterStatus={(v) => setFilterStatus(v)}
          fromDate={fromDate}
          toDate={toDate}
          onFromDate={(v) => {
            setFromDate(v);
            table.onResetPage();
          }}
          onToDate={(v) => {
            setToDate(v);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer>
            <Table>
              <TripSheetTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={sorted.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    sorted.map((r) => String(r.id))
                  )
                }
                headLabel={columns}
              />

              <TableBody>
                {loading
                  ? [...Array(8)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={11}>
                          <Skeleton height={55} />
                        </td>
                      </tr>
                    ))
                  : // : sorted
                    //     .slice(
                    //       table.page * table.rowsPerPage,
                    //       table.page * table.rowsPerPage + table.rowsPerPage
                    //     )
                    //     .map((row) => (
                    //       <TripSheetTableRow
                    //         key={row.id}
                    //         row={row}
                    //         selected={table.selected.includes(String(row.id))}
                    //         onSelectRow={() => table.onSelectRow(String(row.id))}
                    //         onView={() => openDetail(row)}
                    //         onEdit={() => openEditModal(row)}
                    //         onUpdated={onUpdated}
                    //       />
                    //     ))}
                    sorted.map((row) => (
                      <TripSheetTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onView={() => openDetail(row)}
                        onEdit={() => openEditModal(row)}
                        onUpdated={onUpdated}
                      />
                    ))}

                {/* <TableEmptyRows
                  height={70}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, sorted.length)}
                /> */}

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* <TablePagination
          component="div"
          count={sorted.length}
          // count={totalCount}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        /> */}
        <TablePagination
          component="div"
          count={totalCount} 
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <TripSheetViewModal open={openView} onClose={() => setOpenView(false)} item={viewItem} />
      <TripSheetEditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        item={editItem}
        onUpdated={onUpdated}
      />
    </DashboardContent>
  );
}
