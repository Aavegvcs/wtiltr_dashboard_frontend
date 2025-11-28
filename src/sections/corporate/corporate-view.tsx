// import { useState, useCallback, useEffect, ChangeEvent } from 'react';

// import axiosInstance from 'src/config-global';
// import {
//   CircularProgress,
//   Stack,
//   LinearProgress,
//   linearProgressClasses,
//   SelectChangeEvent,
// } from '@mui/material';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import TableBody from '@mui/material/TableBody';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';
// import FileUploadIcon from '@mui/icons-material/FileUpload';
// import Modal from '@mui/material/Modal';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import Switch from '@mui/material/Switch';

// import { varAlpha } from 'src/theme/styles';
// import toast, { Toaster } from 'react-hot-toast';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';

// import { CorporateTableHead } from './corporate-table-head';
// import { CorporateTableRow } from './corporate-table-row';
// import { CorporateTableToolbar } from './corporate-table-toolbar';
// import CorporateBulkUploadModal from './corporate-bulk-upload';

// import { applyFilterCorporate, emptyRows, getComparator } from './utils';
// import { TableEmptyRows } from './table-empty-rows';
// import { TableNoData } from './table-no-data';
// import { CorporateProps } from './types';

// // -----------------------------------------------
// // Modal styling
// // -----------------------------------------------

// const modalStyle = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   maxHeight: '90%',
//   width: '50%',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
//   overflowY: 'auto',
// };

// // -----------------------------------------------
// // Table Column Structure
// // -----------------------------------------------

// const columns = [
//   { id: 'corporateCode', label: 'Corporate Code', minWidth: 120, align: 'center' },
//   { id: 'corporateName', label: 'Corporate Name', minWidth: 140, align: 'center' },
//   { id: 'phoneNumber', label: 'Phone', minWidth: 150, align: 'center' },
//   { id: 'email', label: 'Email', minWidth: 140, align: 'center' },
//   { id: 'state', label: 'State', minWidth: 100, align: 'center' },
//   { id: 'country', label: 'Country', minWidth: 100, align: 'center' },
//   { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
//   { id: 'action', label: 'Action', minWidth: 120, align: 'center' },
// ];

// // -----------------------------------------------
// // MAIN COMPONENT
// // -----------------------------------------------

// export function CorporateView() {
//   const table = useTable();

//   const [filterName, setFilterName] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

//   const [corporates, setCorporates] = useState<CorporateProps[]>([]);
//   const [stateList, setStateList] = useState<any[]>([]);
//   const [countryList, setCountryList] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [buttonLoading, setButtonLoading] = useState(false);
//   const [refreshPage, setRefreshPage] = useState(false);

//   const [open, setOpen] = useState(false);
//   const [openBulkModal, setOpenBulkModal] = useState(false);

//   const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
//   const [editCorporate, setEditCorporate] = useState<CorporateProps | null>(null);

//   const [newCorporate, setNewCorporate] = useState<CorporateProps>({
//     corporateCode: '',
//     corporateName: '',
//     phoneNumber: '',
//     secondaryPhoneNumber: '',
//     email: '',
//     gst: '',
//     panNumber: '',
//     address: '',
//     currency: '',
//     country: '',
//     state: '',
//     isActive: true,
//   });

//   const [errors, setErrors] = useState<any>({});

//   // -----------------------------------------------
//   // Fetching Data
//   // -----------------------------------------------

//   useEffect(() => {
//     fetchCorporateList();
//     fetchLocations();
//   }, [refreshPage]);

//   const fetchCorporateList = async () => {
//     try {
//       const response = await axiosInstance.post('companies/list');

//       // console.log('API RAW RESPONSE:', response);

//       const list =
//         response?.data?.data?.items && Array.isArray(response.data.data.items)
//           ? response.data.data.items
//           : [];
//       console.log('Parsed Corporate List:', list);
//       setCorporates(
//         list.map((item: any) => ({
//           id: item.id,
//           corporateCode: item.corporateCode || '',
//           corporateName: item.corporateName || '',
//           phoneNumber: item.phoneNumber || '',
//           secondaryPhoneNumber: item.secondaryPhoneNumber || '',
//           email: item.email || '',
//           gst: item.gst || '',
//           panNumber: item.panNumber || '',
//           address: item.address || '',
//           currency: item.currency || '',
//           // Keep full object to support selection and display
//           country: item.country ? { id: item.country?.id, name: item.country?.name } : null,
//           state: item.state ? { id: item.state?.id, name: item.state?.name } : null,

//           isActive: item.isActive ?? true,
//         }))
//       );
//     } catch (error) {
//       console.error('❌ Error fetching corporate list:', error);
//       setCorporates([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const statesRes = await axiosInstance.get('/states');
//       const countriesRes = await axiosInstance.get('/countries');

//       // Log responses
//       console.log('States API:', statesRes.data);
//       console.log('Countries API:', countriesRes.data);

//       // Assign properly
//       setStateList(statesRes.data.data || []);
//       setCountryList(countriesRes.data.data || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // -----------------------------------------------
//   // Actions
//   // -----------------------------------------------

//   const handleAddModal = () => {
//     setModalMode('add');
//     setEditCorporate(null);
//     setErrors({});
//     setOpen(true);

//     setNewCorporate({
//       corporateCode: '',
//       corporateName: '',
//       phoneNumber: '',
//       secondaryPhoneNumber: '',
//       email: '',
//       gst: '',
//       panNumber: '',
//       address: '',
//       currency: '',
//       country: '',
//       state: '',
//       isActive: true,
//     });
//   };

//   const handleEditModal = (item: CorporateProps) => {
//     setModalMode('edit');
//     setEditCorporate(item);
//     setErrors({});
//     setOpen(true);

//     setNewCorporate({
//       corporateCode: item.corporateCode || '',
//       corporateName: item.corporateName || '',
//       phoneNumber: item.phoneNumber || '',
//       secondaryPhoneNumber: item.secondaryPhoneNumber || '',
//       email: item.email || '',
//       gst: item.gst || '',
//       panNumber: item.panNumber || '',
//       address: item.address || '',
//       currency: item.currency || '',
//       country: item.country?.id?.toString() || '',
//       state: item.state?.id?.toString() || '',

//       isActive: item.isActive ?? true,
//     });
//   };

//   const handleCloseModal = () => {
//     setOpen(false);
//     setEditCorporate(null);
//     setErrors({});
//   };

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
//   ) => {
//     const { name, value } = e.target as HTMLInputElement;
//     setNewCorporate((prev) => ({ ...prev, [name]: value }));
//   };

//   // -----------------------------------------------
//   // Validation + Submit
//   // -----------------------------------------------

//   const validateForm = () => {
//     const newErrors: any = {};

//     if (!newCorporate.corporateCode) newErrors.corporateCode = 'Required';
//     if (!newCorporate.corporateName) newErrors.corporateName = 'Required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     const payload = { ...newCorporate };

//     try {
//       setButtonLoading(true);

//       if (modalMode === 'add') {
//         await axiosInstance.post('companies/create', payload);
//         toast.success('Corporate Created Successfully');
//       } else if (editCorporate) {
//         await axiosInstance.put('companies/update', { id: editCorporate.id, ...payload });
//         toast.success('Corporate Updated Successfully');
//       }

//       setRefreshPage((prev) => !prev);
//       handleCloseModal();
//     } catch (err) {
//       toast.error('Error occurred');
//     } finally {
//       setButtonLoading(false);
//     }
//   };

//   const handleDelete = async (row: CorporateProps) => {
//     if (!window.confirm('Are you sure?')) return;

//     try {
//       await axiosInstance.post('companies/delete', { id: row.id });
//       toast.success('Corporate deleted');
//       setRefreshPage((prev) => !prev);
//     } catch {
//       toast.error('Delete failed!');
//     }
//   };

//   // -----------------------------------------------
//   // Filtering
//   // -----------------------------------------------

//   const filteredData = applyFilterCorporate({
//     inputData: corporates || [],
//     comparator: getComparator(table.order, table.orderBy),
//     filterName,
//     filterStatus,
//   });
//   // const filteredData = corporates;
//   // console.log('TABLE RECEIVING DATA:', filteredData);

//   const notFound = !filteredData.length && !!filterName;

//   // -----------------------------------------------
//   // Loader
//   // -----------------------------------------------

//   if (loading) {
//     return (
//       <DashboardContent>
//         <LinearProgress
//           sx={{
//             width: 1,
//             maxWidth: 320,
//             bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
//             [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
//             mx: 'auto',
//           }}
//         />
//       </DashboardContent>
//     );
//   }

//   // -----------------------------------------------
//   // UI
//   // -----------------------------------------------

//   return (
//     <DashboardContent>
//       <Toaster />

//       <Box mb={5}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
//           <Typography variant="h4" sx={{ flexGrow: 1 }}>
//             Corporate
//           </Typography>

//           <Button
//             variant="contained"
//             startIcon={<FileUploadIcon />}
//             sx={{ fontWeight: 'bold' }}
//             onClick={() => setOpenBulkModal(true)}
//           >
//             Bulk Upload
//           </Button>

//           <Button
//             variant="contained"
//             startIcon={<Iconify icon="mingcute:add-line" />}
//             sx={{ fontWeight: 'bold' }}
//             onClick={handleAddModal}
//           >
//             Add Corporate
//           </Button>
//         </Stack>
//       </Box>

//       <Card>
//         <CorporateTableToolbar
//           numSelected={table.selected.length}
//           filterName={filterName}
//           filterStatus={filterStatus}
//           onFilterName={(e) => {
//             setFilterName(e.target.value);
//             table.onResetPage();
//           }}
//           onFilterStatus={(value) => {
//             setFilterStatus(value);
//             table.onResetPage();
//           }}
//         />

//         <Scrollbar>
//           <TableContainer>
//             <Table sx={{ minWidth: 900 }}>
//               <CorporateTableHead
//                 order={table.order}
//                 orderBy={table.orderBy}
//                 rowCount={filteredData.length}
//                 numSelected={table.selected.length}
//                 onSort={table.onSort}
//                 onSelectAllRows={(checked) =>
//                   table.onSelectAllRows(
//                     checked,
//                     filteredData.map((row) => String(row.id))
//                   )
//                 }
//                 headLabel={columns}
//               />

//               <TableBody>
//                 {filteredData
//                   .slice(
//                     table.page * table.rowsPerPage,
//                     table.page * table.rowsPerPage + table.rowsPerPage
//                   )
//                   .map((row) => (
//                     <CorporateTableRow
//                       key={row.id}
//                       row={row}
//                       selected={table.selected.includes(String(row.id))}
//                       onSelectRow={() => table.onSelectRow(String(row.id))}
//                       onEdit={(row) => handleEditModal(row)}
//                       onDelete={(row) => handleDelete(row)}
//                     />
//                   ))}
//                 <TableEmptyRows
//                   emptyRows={emptyRows(table.page, table.rowsPerPage, filteredData.length)}
//                   height={70}
//                 />

//                 {notFound && <TableNoData searchQuery={filterName} />}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           component="div"
//           count={filteredData.length}
//           page={table.page}
//           rowsPerPage={table.rowsPerPage}
//           rowsPerPageOptions={[5, 10, 25]}
//           onPageChange={table.onChangePage}
//           onRowsPerPageChange={table.onChangeRowsPerPage}
//         />
//       </Card>

//       <Modal open={open} onClose={handleCloseModal}>
//         <Box sx={modalStyle}>
//           <Typography variant="h6" mb={3}>
//             {modalMode === 'add' ? 'Create Corporate' : 'Edit Corporate'}
//           </Typography>

//           <Grid container spacing={2}>
//             {/* ------------- Form Fields --------------- */}

//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="Corporate Code"
//                 name="corporateCode"
//                 value={newCorporate.corporateCode}
//                 error={!!errors.corporateCode}
//                 helperText={errors.corporateCode}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="Corporate Name"
//                 name="corporateName"
//                 value={newCorporate.corporateName}
//                 error={!!errors.corporateName}
//                 helperText={errors.corporateName}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="Phone Number"
//                 name="phoneNumber"
//                 value={newCorporate.phoneNumber}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 name="email"
//                 value={newCorporate.email}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Country</InputLabel>
//                 <Select
//                   name="country"
//                   label="Country"
//                   value={newCorporate.country}
//                   onChange={handleChange}
//                 >
//                   {countryList.map((c) => (
//                     <MenuItem key={c.id} value={c.id}>
//                       {c.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={6}>
//               <FormControl fullWidth>
//                 <InputLabel>State</InputLabel>
//                 <Select
//                   name="state"
//                   label="State"
//                   value={newCorporate.state}
//                   onChange={handleChange}
//                 >
//                   {/* {stateList.map((s) => (
//                     <MenuItem key={s.stateId} value={s.stateId}>
//                       {s.stateName}
//                     </MenuItem>
//                   ))} */}
//                   {stateList.map((s) => (
//                     <MenuItem key={s.id} value={s.id}>
//                       {s.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 name="address"
//                 label="Address"
//                 value={newCorporate.address}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <FormControl>
//                 <Typography>Status</Typography>
//                 <Switch
//                   checked={newCorporate.isActive}
//                   onChange={(e) =>
//                     setNewCorporate((prev) => ({ ...prev, isActive: e.target.checked }))
//                   }
//                 />
//               </FormControl>
//             </Grid>

//             {/* Submit Actions */}
//             <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
//               <Button variant="outlined" onClick={handleCloseModal}>
//                 Cancel
//               </Button>

//               <Button variant="contained" onClick={handleSubmit} disabled={buttonLoading}>
//                 {buttonLoading ? (
//                   <CircularProgress size={22} />
//                 ) : modalMode === 'add' ? (
//                   'Save'
//                 ) : (
//                   'Update'
//                 )}
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Modal>

//       <CorporateBulkUploadModal
//         open={openBulkModal}
//         onClose={() => setOpenBulkModal(false)}
//         refreshData={() => setRefreshPage((prev) => !prev)}
//       />
//     </DashboardContent>
//   );
// }

// // -----------------------------------------------
// // TABLE HOOK
// // -----------------------------------------------

// export function useTable() {
//   const [page, setPage] = useState(0);
//   const [orderBy, setOrderBy] = useState('corporateName');
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [order, setOrder] = useState<'asc' | 'desc'>('asc');

//   const onSort = useCallback(
//     (id: string) => {
//       const isAsc = orderBy === id && order === 'asc';
//       setOrder(isAsc ? 'desc' : 'asc');
//       setOrderBy(id);
//     },
//     [order, orderBy]
//   );

//   const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
//     setSelected(checked ? newSelecteds : []);
//   }, []);

//   const onSelectRow = useCallback((value: string) => {
//     setSelected((prev) =>
//       prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
//     );
//   }, []);

//   const onResetPage = () => setPage(0);

//   const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);

//   const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     onResetPage();
//   }, []);

//   return {
//     page,
//     order,
//     orderBy,
//     rowsPerPage,
//     selected,
//     onSort,
//     onSelectRow,
//     onResetPage,
//     onSelectAllRows,
//     onChangePage,
//     onChangeRowsPerPage,
//   };
// }
// src/views/corporate/corporate-view.tsx
// src/sections/corporate/corporate-view.tsx
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
  const [newCorporate, setNewCorporate] = useState<Omit<CorporateProps, 'id'>>({
    corporateCode: '',
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
          axiosInstance.post('companies/list'),
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
      corporateCode: '',
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
      corporateCode: row.corporateCode,
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
    if (!newCorporate.corporateCode.trim()) err.corporateCode = 'Required';
    if (!newCorporate.corporateName.trim()) err.corporateName = 'Required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...newCorporate,
      country: newCorporate.country?.id || null,
      state: newCorporate.state?.id || null,
    };

    try {
      setButtonLoading(true);
      if (modalMode === 'add') {
        await axiosInstance.post('companies/create', payload);
        toast.success('Corporate created!');
      } else {
        await axiosInstance.put('companies/update', { id: editCorporate?.id, ...payload });
        toast.success('Corporate updated!');
      }
      refreshData();
      handleClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
      console.log(err.response);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDelete = async (row: CorporateProps) => {
    if (!confirm('Delete this corporate?')) return;
    try {
      await axiosInstance.post('companies/delete', { id: row.id });
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
                          onDelete={handleDelete}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Corporate Code *"
                name="corporateCode"
                value={newCorporate.corporateCode}
                onChange={handleChange}
                error={!!errors.corporateCode}
                helperText={errors.corporateCode}
              />
            </Grid>
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
              <TextField
                fullWidth
                label="Phone"
                name="phoneNumber"
                value={newCorporate.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={newCorporate.email}
                onChange={handleChange}
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
