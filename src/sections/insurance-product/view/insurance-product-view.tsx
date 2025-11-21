import { useState, useCallback, useEffect } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import axiosInstance from 'src/config-global';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Modal from '@mui/material/Modal';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { formatToCamelCase } from 'src/utils/utils';
import toast, { Toaster } from 'react-hot-toast';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { InsuranceProductTableRow } from '../insurance-product-table-row';
import { InsuranceProductTableHead } from '../insurance-product-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../insurance-product-table-toolbar';

import { applyFilterForInsuranceProduct, emptyRows, getComparator } from '../utils';

import type { InsuranceProductProps } from '../insurance-product-table-row';
import { Switch } from '@mui/material';
import { Insurance_Type } from 'src/utils/insurance.utils';
import { RequiredMark } from 'src/utils/commonUtils';
import ProductBulkUploadModal from './insurance-product-bulk-upload';
import QuotationPDF from './quotation-pdf';
import PdfTableGenerator from './quotation-pdf';

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

// ----------------------------------------------------------------------
const columns = [
  {
    id: 'name',
    label: 'Name',
    minWidth: 170,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'type',
    label: 'Type',
    minWidth: 140,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'insuranceCompany',
    label: 'Insurance Company',
    minWidth: 170,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  // {
  //   id: 'price',
  //   label: 'Price',
  //   minWidth: 120,
  //   align: 'center',
  //   format: (value: any) => value.toLocaleString('en-US'),
  // },
  {
    id: 'features',
    label: 'Features',
    minWidth: 200,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'advantages',
    label: 'Advantages',
    minWidth: 200,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'benefits',
    label: 'Benefits',
    minWidth: 200,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'payoutPercentage',
    label: 'Payout (%)',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },

  {
    id: 'shortDescription',
    label: 'Description',
    minWidth: 200,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },

  {
    id: 'status',
    label: 'Status',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value.toLocaleString('en-US'),
  },
];

export function InsuranceProductView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [products, setProducts] = useState<InsuranceProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [branch, setBranch] = useState<{ id: string; name: string }[]>([]);
  const [refreshPage, setRefreshPage] = useState(false);
  const [insuranceCompany, setInsuranceCompany] = useState<
    { insuranceCompanyId: number; insuranceCompanyName: string }[]
  >([]);
  const [insuranceType, setInsuranceType] = useState<string[]>([]);

  const [addUpdateModal, setAddUpdateModal] = useState({
    updateModal: false,
    addModal: true,
  });
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [newProduct, setNewProduct] = useState({
    name: '',
    insuranceType: '' as string | undefined,
    insuranceCompanyId: 0,
    branchId: '',
    insurancePrice: 0,
    incentivePercentage: 0,
    durationMonths: 0,
    shortDescription: '',
    features: '',
    advantages: '',
    benefits: '',
    payoutPercentage: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editProduct, setEditProduct] = useState<InsuranceProductProps | null>(null);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get('/insurance-product/getAllProduct');
        const data = response.data.data;

        const mappedData = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          insurancePrice: product.insurancePrice,
          incentivePercentage: product.incentivePercentage,
          durationMonths: product.durationMonths,
          insuranceType: product.insuranceType,
          insuranceCompanyId: product.insuranceCompanyId,
          insuranceCompanyName: product.insuranceCompanyName,
          shortDescription: product.shortDescription || '',
          features: product.features || '',
          advantages: product.advantages || '',
          benefits: product.benefits || '',
          payoutPercentage: product.payoutPercentage || '',
          isActive: product.isActive,
        }));
        setProducts(mappedData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [refreshPage]);

  const fetchInsuranceCompany = async () => {
    try {
      const response = await axiosInstance.get('insurance-product/getInsuranceCompany');
      setInsuranceCompany(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchInsuranceType = async () => {
    try {
      const response = await axiosInstance.get('insurance-product/insuranceType');
      setInsuranceType(response.data.data || []);
      console.log('all insurance type  is here ', response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleAddModal = () => {
    fetchInsuranceCompany();
    fetchInsuranceType();
    setAddUpdateModal({ ...addUpdateModal, addModal: true, updateModal: false });
    handleOpenModal();
    setModalMode('add');
  };

  const handleEditModal = (item: InsuranceProductProps) => {
    setModalMode('edit');
    setEditProduct(item);

    setNewProduct({
      name: item.name,
      insuranceCompanyId: item.insuranceCompanyId,
      insuranceType: item.insuranceType || '',
      branchId: item.branchId || '',
      insurancePrice: item.insurancePrice,
      incentivePercentage: item.incentivePercentage,
      durationMonths: item.durationMonths,
      shortDescription: item.shortDescription,
      features: item.features,
      advantages: item.advantages,
      benefits: item.benefits,
      payoutPercentage: item.payoutPercentage,
      isActive: item.isActive,
    });
    fetchInsuranceCompany();
    handleOpenModal();
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
    setErrors({});
    setNewProduct({
      name: '',
      insuranceType: '',
      insuranceCompanyId: 0,
      branchId: '',
      insurancePrice: 0,
      incentivePercentage: 0,
      durationMonths: 0,
      shortDescription: '',
      features: '',
      advantages: '',
      benefits: '',
      payoutPercentage: 0,
      isActive: true,
    });
    setEditProduct(null);
    setModalMode('add');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: value ? '' : 'This field is required' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newProduct.name) newErrors.name = 'This field is required';
    if (!newProduct.insuranceType) newErrors.insuranceType = 'This field is required';
    if (!newProduct.insuranceCompanyId) newErrors.insuranceCompanyId = 'This field is required';
    // if (!newProduct.incentivePercentage) newErrors.incentivePercentage = 'This field is required';
    if (!newProduct.shortDescription) newErrors.shortDescription = 'This field is required';
    if (!newProduct.features) newErrors.features = 'This field is required';
    if (!newProduct.advantages) newErrors.advantages = 'This field is required';
    if (!newProduct.benefits) newErrors.benefits = 'This field is required';
    if (!newProduct.payoutPercentage) newErrors.payoutPercentage = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = async () => {
    setButtonLoading(true);
    // console.log('add product is here', newProduct);
    if (!validateForm()) {
      setButtonLoading(false);
      return;
    }
    if (!window.confirm('Are you sure?')) {
      return;
    }
    const payload = {
      ...newProduct,
    };
    console.log('payload is here', payload);

    try {
      const response = await axiosInstance.post('insurance-product/createProduct', payload);
      const responsedata = response.data;

      if (responsedata.message === 'success') {
        toast.success('Product saved successfully');
        setButtonLoading(false);
        setRefreshPage(true);
      } else {
        toast.error('Failed! to save product');
        setButtonLoading(false);
      }
      handleCloseModal();
      setRefreshPage(true);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed! to save product');
      setButtonLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editProduct || !validateForm()) {
      setButtonLoading(false);
      return;
    }
    if (!window.confirm('Are you sure?')) return;

    setButtonLoading(true);
    const payload = {
      id: editProduct.id,
      ...newProduct,
    };
    // console.log('on update fun', payload);
    try {
      const response = await axiosInstance.patch('insurance-product/updateProduct', payload); // Assumed endpoint

      const resstatus = response.data.data.status;
      const resmsz = response.data.data.message;
      if (resstatus === 'success') {
        toast.success(resmsz);
        setRefreshPage((prev) => !prev);
      } else {
        toast.error(resmsz);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setButtonLoading(false);
      handleCloseModal();
    }
  };

  const handleDelete = async (row: any) => {
    const payload = {
      productId: row.id,
    };
    if (!window.confirm('Are you sure?')) return;
    setButtonLoading(true);
    try {
      const response = await axiosInstance.post('insurance-product/deleteProduct', payload);
      if (response.data.message === 'success') {
        setButtonLoading(false);
        toast.success('Product deleted successfully');
        setRefreshPage((prev) => !prev);
      } else {
        setButtonLoading(false);
        toast.error('Failed to delete Product');
      }
    } catch (error) {
      setButtonLoading(false);
      console.error('Error delete company:', error);
      toast.error('Failed to delete company');
    } finally {
    }
  };
  const handleSubmit = () => {
    if (modalMode === 'add') {
      handleAddProduct();
    } else {
      handleUpdateProduct();
    }
  };

  const dataFiltered: InsuranceProductProps[] = applyFilterForInsuranceProduct({
    inputData: products,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const handleOpenBulkModal = () => {
    fetchInsuranceCompany();
    setOpenBulkModal(true);
  };
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
            Insurance Products

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
            onClick={handleOpenBulkModal}
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
              <InsuranceProductTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((filterdata) => String(filterdata.id))
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
                    <InsuranceProductTableRow
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

      {/* Modal for adding new user */}

      {/* new modal is opened */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        BackdropProps={{ onClick: (e) => e.stopPropagation() }}
        disableEscapeKeyDown
      >
        <Box sx={modalStyle} className="w-1/2 max-md:w-[90%]">
          <Box display={'flex'} justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              {modalMode === 'add' ? 'Add Product' : 'Edit Product'}
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
                  Insurance Company
                  <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.insuranceCompanyId}>
                  <Select
                    name="insuranceCompanyId"
                    value={newProduct.insuranceCompanyId}
                    onChange={handleSelectChange}
                    placeholder="Select insurance company"
                    displayEmpty
                  >
                    <MenuItem value="0" disabled>
                      Select Company
                    </MenuItem>
                    {insuranceCompany.map((data) => (
                      <MenuItem key={data.insuranceCompanyId} value={data.insuranceCompanyId}>
                        {data.insuranceCompanyName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.insuranceCompanyId && (
                    <Typography color="error" variant="caption">
                      {errors.insuranceCompanyId}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Insurance Type
                  <RequiredMark />
                </Typography>
                <FormControl fullWidth error={!!errors.insuranceType}>
                  <Select
                    name="insuranceType"
                    value={newProduct.insuranceType}
                    onChange={handleSelectChange}
                    placeholder="Select insurance type"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Insurance Type
                    </MenuItem>
                    {Object.values(Insurance_Type).map((type) => (
                      <MenuItem key={type} value={type}>
                        {formatToCamelCase(type)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.insuranceType && (
                    <Typography color="error" variant="caption">
                      {errors.insuranceType}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Name
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={newProduct.name}
                  onChange={handleTextChange}
                  placeholder="Enter product name"
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Payout Percentage
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="payoutPercentage"
                  type="number"
                  value={newProduct.payoutPercentage}
                  onChange={handleTextChange}
                  placeholder="Enter payout percentage"
                  inputProps={{ min: 0, max: 100 }}
                  error={!!errors.payoutPercentage}
                  helperText={errors.payoutPercentage}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </Box>
            </Grid>

            {/* <Grid item xs={6}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Price:
                </Typography>
                <TextField
                  fullWidth
                  name="insurancePrice"
                  type="number"
                  value={newProduct.insurancePrice}
                  onChange={handleTextChange}
                  placeholder="Enter price"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </Box>
            </Grid> */}

            <Grid item xs={12}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Features (comma-separated)
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="features"
                  value={newProduct.features}
                  onChange={handleTextChange}
                  placeholder="Enter features"
                  multiline
                  rows={2}
                  error={!!errors.features}
                  helperText={errors.features}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Advantages (comma-separated)
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="advantages"
                  value={newProduct.advantages}
                  onChange={handleTextChange}
                  placeholder="Enter advantages"
                  multiline
                  rows={2}
                  error={!!errors.advantages}
                  helperText={errors.advantages}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Benefits (comma-separated)
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="benefits"
                  value={newProduct.benefits}
                  onChange={handleTextChange}
                  placeholder="Enter benefits"
                  multiline
                  rows={2}
                  error={!!errors.benefits}
                  helperText={errors.benefits}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Short Description
                  <RequiredMark />
                </Typography>
                <TextField
                  fullWidth
                  name="shortDescription"
                  value={newProduct.shortDescription}
                  onChange={handleTextChange}
                  placeholder="Enter short description"
                  multiline
                  rows={4}
                  error={!!errors.shortDescription}
                  helperText={errors.shortDescription}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Status
                </Typography>
                <Switch
                  checked={Boolean(newProduct.isActive)}
                  onChange={(e) =>
                    setNewProduct((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  color="primary"
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {newProduct?.isActive ? 'Active' : 'Inactive'}
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
                  // className="bg-[#49c401] px-4 py-3 max-md:px-3 max-md:py-3 rounded-md"
                  variant="contained"
                  style={{ minWidth: '108px' }}
                  onClick={handleSubmit}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 2,
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

      <ProductBulkUploadModal
        open={openBulkModal}
        onClose={() => {
          setOpenBulkModal(false);
        }}
        refreshData={() => setRefreshPage((prev) => !prev)}
        insuranceCompany={insuranceCompany}
      />
    </DashboardContent>
  );
}

// [useTable function remains unchanged]
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
