import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Modal,
  Switch,
  Stack,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import toast, { Toaster } from 'react-hot-toast';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import axiosInstance from 'src/config-global';
import { TableNoData } from '../table-no-data';
import { UserTableHead } from '../insurance-company-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../insurance-company-table-toolbar';
import applyFilterForCompany, { emptyRows, getComparator } from '../utils';
import { CompanyProps, InsuranceCompanyTableRow } from '../insurance-company-table-row';
import AnimatedDots from 'src/utils/animation.utils';
import { RequiredMark } from 'src/utils/commonUtils';
import CompanyBulkUploadModal from './insurance-company-bulk-upload';

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

// Columns definition
const columns = [
  { id: 'companyName', label: 'Company Name', minWidth: 170, align: 'center' },
  { id: 'contactPerson', label: 'Contact Person(1st)', minWidth: 190, align: 'center' },
  { id: 'contactNumber', label: 'Contact Number(1st)', minWidth: 190, align: 'center' },
  { id: 'email', label: 'Email(1st)', minWidth: 150, align: 'center' },
  { id: 'secondaryContactPerson', label: 'Contact Person(2nd)', minWidth: 190, align: 'center' },
  { id: 'secondaryContactNumber', label: 'Contact Number(2nd)', minWidth: 190, align: 'center' },
  { id: 'secondaryEmail', label: 'Email(2nd)', minWidth: 150, align: 'center' },
  // { id: 'address', label: 'Address', minWidth: 170, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 140, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 140, align: 'center' },
];

export function InsuranceCompanyView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [company, setCompany] = useState<CompanyProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [pageRefresh, setPageRefresh] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editCompany, setEditCompany] = useState<CompanyProps | null>(null);
  const [openBulkModal, setOpenBulkModal] = useState(false);

  const [newCompany, setNewCompany] = useState({
    companyName: '',
    companyAddress: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    secondaryContactPerson: '',
    secondaryContactNumber: '',
    secondaryEmail: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  console.log(newCompany.secondaryContactNumber);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('insurance-product/getAllCompany');
        const data = response.data.data;
        const mappedData = data.map((companyData: any) => ({
          id: companyData.id,
          companyName: companyData.companyName,
          companyAddress: companyData.companyAddress,
          contactPerson: companyData.contactPerson,
          contactNumber: companyData.contactNumber,
          email: companyData.email,
          secondaryContactPerson: companyData.secondaryContactPerson,
          secondaryContactNumber: companyData.secondaryContactNumber,
          secondaryEmail: companyData.secondaryEmail,
          isActive: companyData.isActive,
        }));
        setCompany(mappedData);
      } catch (error) {
        console.error('Error fetching users:', error);
        // toast.error('Error fetching users');
        toast.error('Internal server error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pageRefresh]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setErrors({});
    setNewCompany({
      companyName: '',
      companyAddress: '',
      contactPerson: '',
      contactNumber: '',
      email: '',
      secondaryContactPerson: '',
      secondaryContactNumber: '',
      secondaryEmail: '',
      isActive: true,
    });
    setEditCompany(null);
    setModalMode('add');
  };

  const handleAddModal = () => {
    setModalMode('add');
    handleOpenModal();
  };

  const handleEditModal = (company: CompanyProps) => {
    setModalMode('edit');
    setEditCompany(company);
    setNewCompany({
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      contactPerson: company.contactPerson || '',
      contactNumber: company.contactNumber,
      email: company.email,
      secondaryContactPerson: company.secondaryContactPerson,
      secondaryContactNumber: company.secondaryContactNumber,
      secondaryEmail: company.secondaryEmail,
      isActive: Boolean(company.isActive),
    });
    handleOpenModal();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setNewCompany((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newCompany.companyName) newErrors.companyName = 'This field is required';
    if (!newCompany.email) newErrors.email = 'This field is required';
    if (!newCompany.secondaryEmail) newErrors.secondaryEmail = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCompany = async () => {
    setButtonLoading(true);
    if (!validateForm()) {
      setButtonLoading(false);
      return;
    }
    if (!window.confirm('Are you sure?')) return;
    const payload = { ...newCompany };
    try {
      const response = await axiosInstance.post('insurance-product/createCompany', payload);
      if (response.data.message === 'success') {
        toast.success('Company created successfully');
        setPageRefresh((prev) => !prev);
      } else {
        toast.error('Failed to create company');
      }
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('Failed to create company');
    } finally {
      setButtonLoading(false);
      handleCloseModal();
    }
  };
  const handleDelete = async (row: any) => {
    const payload = {
      companyId: row.id,
    };
    if (!window.confirm('Are you sure?')) return;
    setButtonLoading(true);
    try {
      const response = await axiosInstance.post('insurance-product/deleteComany', payload);
      if (response.data.message === 'success') {
        setButtonLoading(false);
        toast.success('Company deleted successfully');
        setPageRefresh((prev) => !prev);
      } else {
        setButtonLoading(false);
        toast.error('Failed to delete company');
      }
    } catch (error) {
      setButtonLoading(false);
      console.error('Error delete company:', error);
      toast.error('Failed to delete company');
    } finally {
    }
  };

  const handleUpdateCompany = async () => {
    if (!editCompany || !validateForm()) {
      setButtonLoading(false);
      return;
    }
    if (!window.confirm('Are you sure to update?')) return;

    setButtonLoading(true);
    const payload = {
      id: editCompany.id,
      ...newCompany,
    };
    // console.log('on update fun', payload);
    try {
      const response = await axiosInstance.post('insurance-product/updateCompany', payload); // Assumed endpoint

      const resstatus = response.data.data.status;
      const resmsz = response.data.data.message;
      if (resstatus === 'success') {
        toast.success(resmsz);
        handleCloseModal();
        setPageRefresh((prev) => !prev);
      } else {
        toast.error(resmsz);
      }
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
    } finally {
      setButtonLoading(false);
      // handleCloseModal();
    }
  };

  const handleSubmit = () => {
    if (modalMode === 'add') {
      handleAddCompany();
    } else {
      handleUpdateCompany();
    }
  };

  const dataFiltered: CompanyProps[] = applyFilterForCompany({
    inputData: company,
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {buttonLoading && (
          <Typography variant="h6" flexGrow={1}>
            Please wait
            <AnimatedDots />
          </Typography>
        )}
      </div>
      {/* <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Insurance Company
        </Typography>
        <Button
         variant="contained"
         startIcon={<FileUploadIcon />}
         sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            px: 1,  
            mr: { md: 3, xs: 0 },
             backgroundColor: '#0055A5',
            '&:hover': {
              backgroundColor: '#004080', // optional: darker shade on hover
            },
          }}
          onClick={()=>{setOpenBulkModal(true)}}
        >
          Bulk Upload
        
        </Button>


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
      </Box> */}

      <Box mb={5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }} // column on mobile, row on desktop
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          {/* Title on left, auto expands */}
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              textAlign: { xs: 'center', sm: 'left' },
              mb: { xs: 2, sm: 0 },
            }}
          >
            Insurance Company
          </Typography>

          {/* Bulk Upload Button */}
          <Button
            variant="contained"
            startIcon={<FileUploadIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              px: { xs: 2, md: 3 },
              backgroundColor: '#0055A5',
              width: { xs: '100%', sm: 'auto' }, // full width on mobile
              '&:hover': { backgroundColor: '#004080' },
            }}
            onClick={() => setOpenBulkModal(true)}
          >
            Bulk Upload
          </Button>

          {/* Add More Button */}
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              px: { xs: 2, md: 3 },
              backgroundColor: '#0055A5',
              width: { xs: '100%', sm: 'auto' }, // full width on mobile
              '&:hover': { backgroundColor: '#004080' },
            }}
            onClick={handleAddModal}
          >
            Add More
          </Button>
        </Stack>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((dataFil) => String(dataFil.id))
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
                    <InsuranceCompanyTableRow
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

      {/* Modal for adding/editing company */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        BackdropProps={{ onClick: (e) => e.stopPropagation() }}
        disableEscapeKeyDown
      >
        <Box sx={modalStyle} className="w-1/2 max-md:w-[90%]">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              {modalMode === 'add' ? 'Add Company' : 'Edit Company'}
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
                  Company Name
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="companyName"
                  value={newCompany.companyName}
                  onChange={handleTextChange}
                  placeholder="Enter company name"
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Contact Person(1st)
                </Typography>
                <TextField
                  fullWidth
                  name="contactPerson"
                  value={newCompany.contactPerson}
                  onChange={handleTextChange}
                  placeholder="Enter contact person"
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Contact Number(1st)
                </Typography>
                <TextField
                  fullWidth
                  name="contactNumber"
                  value={newCompany.contactNumber}
                  onChange={handleMobileNumberChange}
                  placeholder="Enter contact number"
                  // error={!!errors.contactNumber}
                  // helperText={errors.contactNumber}
                  inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Email(1st)
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={newCompany.email}
                  onChange={handleTextChange}
                  placeholder="Enter email"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>
            </Grid>
            {/* <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Address:
                </Typography>
                <TextField
                  fullWidth
                  name="companyAddress"
                  value={newCompany.companyAddress}
                  onChange={handleTextChange}
                  placeholder="Enter address"
                  error={!!errors.companyAddress}
                  helperText={errors.companyAddress}
                />
              </Box>
            </Grid> */}

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Contact Person(2nd)
                </Typography>
                <TextField
                  fullWidth
                  name="secondaryContactPerson"
                  value={newCompany.secondaryContactPerson}
                  onChange={handleTextChange}
                  placeholder="Enter contact person"
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Contact Number(2nd)
                </Typography>
                <TextField
                  fullWidth
                  name="secondaryContactNumber"
                  value={newCompany.secondaryContactNumber}
                  onChange={handleMobileNumberChange}
                  placeholder="Enter contact number"
                  // error={!!errors.contactNumber}
                  // helperText={errors.contactNumber}
                  inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Email(2nd)
                </Typography>
                <TextField
                  fullWidth
                  name="secondaryEmail"
                  value={newCompany.secondaryEmail}
                  onChange={handleTextChange}
                  placeholder="Enter email"
                  error={!!errors.secondaryEmail}
                  helperText={errors.secondaryEmail}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Status:
                </Typography>
                <Switch
                  checked={newCompany.isActive}
                  onChange={(e) =>
                    setNewCompany((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  color="primary"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {newCompany.isActive ? 'Active' : 'Inactive'}
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
                  className="bg-[#49c401] px-4 py-3 max-md:px-3 max-md:py-3 rounded-md"
                  variant="contained"
                  style={{ minWidth: '108px' }}
                  onClick={handleSubmit}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 3,
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

      {/* bulk upload modal */}
      <CompanyBulkUploadModal
        open={openBulkModal}
        onClose={() => {
          setOpenBulkModal(false);
        }}
        refreshData={() => setPageRefresh((prev) => !prev)}
      />
    </DashboardContent>
  );
}

// useTable function (unchanged)
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
