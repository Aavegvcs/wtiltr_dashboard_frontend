// import { useEffect, useState } from 'react';
// import {
//   Modal,
//   Box,
//   Typography,
//   Grid,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Stack,
//   Button,
//   CircularProgress,
// } from '@mui/material';
// import axiosInstance from 'src/config-global';
// import toast from 'react-hot-toast';

// import type { CvdMappingProps } from './types';

// const modalStyle = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
//   maxHeight: '90%',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
//   overflowY: 'auto',
// };

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSaved?: () => void; // refresh parent
//   mode?: 'add' | 'edit';
//   editItem?: CvdMappingProps | null;

//   // optional: parent can pass lists to avoid re-fetching
//   corporates?: { id: number; corporateName?: string }[];
//   branches?: { id: number; branchName?: string; corporateId?: number }[];
//   vehicles?: { id: number; vehicleNumber?: string; vehicleName?: string }[];
//   drivers?: { id: number; name?: string; mobileNumber?: string }[];

//   refreshData?: () => void;
// };

// export default function CvdAddEditModal({
//   open,
//   onClose,
//   onSaved,
//   mode = 'add',
//   editItem,
//   corporates: parentCorporates,
//   branches: parentBranches,
//   vehicles: parentVehicles,
//   drivers: parentDrivers,
//   refreshData,
// }: Props) {
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // lists
//   const [corporates, setCorporates] = useState<{ id: number; corporateName: string }[]>([]);
//   const [branches, setBranches] = useState<{ id: number; branchName: string; corporateId?: number }[]>([]);
//   const [vehicles, setVehicles] = useState<any[]>([]);
//   const [drivers, setDrivers] = useState<any[]>([]);
//   const [mappings, setMappings] = useState<any[]>([]); // all mappings to compute used vehicles/drivers

//   // computed free lists
//   const [freeVehicles, setFreeVehicles] = useState<any[]>([]);
//   const [freeDrivers, setFreeDrivers] = useState<any[]>([]);

//   // form
//   const [form, setForm] = useState<{
//     corporateId?: number | '';
//     branchId?: number | '';
//     vehicleId?: number | '';
//     driverId?: number | '';
//     isActive?: boolean;
//   }>({
//     corporateId: '',
//     branchId: '',
//     vehicleId: '',
//     driverId: '',
//     isActive: true,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // ----------------- fetch master data -----------------
//   useEffect(() => {
//     if (!open) return;

//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         // If parent provided lists, use them; otherwise fetch
//         const corpReq = parentCorporates ? null : axiosInstance.post('companies/list');
//         const branchReq = parentBranches ? null : axiosInstance.post('/branch/list');
//         const vehicleReq = parentVehicles ? null : axiosInstance.get('/vehicle/list?page=1&limit=1000');
//         const driverReq = parentDrivers ? null : axiosInstance.get('/driver/list?page=1&limit=1000');
//         const mappingReq = axiosInstance.get('/cvd-mapping/list');

//         const results = await Promise.all([
//           corpReq,
//           branchReq,
//           vehicleReq,
//           driverReq,
//           mappingReq,
//         ].map((p) => p)); // keep types consistent

//         const extract = (res: any) => {
//           if (!res) return [];
//           if (res.data?.result?.data) return res.data.result.data;
//           if (res.data?.data?.result?.data) return res.data.data.result.data;
//           if (Array.isArray(res.data?.data)) return res.data.data;
//           if (Array.isArray(res.data?.result)) return res.data.result;
//           if (Array.isArray(res.data)) return res.data;
//           if (Array.isArray(res.result?.data)) return res.result.data;
//           return [];
//         };

//         // results array aligns with the order of promises; but some entries might be null (if parent provided)
//         const corpRes = parentCorporates ? null : results[0];
//         const branchRes = parentBranches ? null : results[1];
//         const vehicleRes = parentVehicles ? null : results[2];
//         const driverRes = parentDrivers ? null : results[3];
//         const mappingRes = results[4];

//         const corpItems = parentCorporates ?? extract(corpRes);
//         const branchItems = parentBranches ?? extract(branchRes);
//         const vehicleItems = parentVehicles ?? extract(vehicleRes);
//         const driverItems = parentDrivers ?? extract(driverRes);
//         const mappingItems = extract(mappingRes) as any[];

//         setCorporates(
//           (corpItems || []).map((c: any) => ({ id: c.id, corporateName: c.corporateName || c.name || `Corporate ${c.id}` }))
//         );

//         setBranches(
//           (branchItems || []).map((b: any) => ({ id: b.id, branchName: b.branchName || b.name || `Branch ${b.id}`, corporateId: b.corporateId }))
//         );

//         setVehicles((vehicleItems || []).map((v: any) => ({ id: v.id, vehicleNumber: v.vehicleNumber, vehicleName: v.vehicleName })));

//         setDrivers((driverItems || []).map((d: any) => ({ id: d.id, name: d.name, mobileNumber: d.mobileNumber })));

//         setMappings(mappingItems || []);
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load master data for mapping');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, parentCorporates, parentBranches, parentVehicles, parentDrivers]);

//   // ----------------- compute free vehicles & drivers (Option 1) -----------------
//   useEffect(() => {
//     // only consider active mappings as occupied
//     const occupiedVehicleIds = new Set<number>();
//     const occupiedDriverIds = new Set<number>();

//     (mappings || []).forEach((m: any) => {
//       if (m.isActive) {
//         if (m.vehicle?.id) occupiedVehicleIds.add(m.vehicle.id);
//         if (m.driver?.id) occupiedDriverIds.add(m.driver.id);
//       }
//     });

//     // freeVehicles = vehicles not in occupiedVehicleIds
//     const freeV = (vehicles || []).filter((v: any) => !occupiedVehicleIds.has(v.id));
//     const freeD = (drivers || []).filter((d: any) => !occupiedDriverIds.has(d.id));

//     // In edit mode, ensure current mapping's vehicle/driver appear in the list even if occupied
//     if (mode === 'edit' && editItem) {
//       const vehicleId = editItem.vehicle?.id;
//       const driverId = editItem.driver?.id;

//       if (vehicleId) {
//         if (!freeV.find((x) => x.id === vehicleId)) {
//           const curV = vehicles.find((x) => x.id === vehicleId);
//           if (curV) freeV.unshift(curV);
//           else freeV.unshift({ id: vehicleId, vehicleNumber: editItem.vehicle?.vehicleNumber || '', vehicleName: editItem.vehicle?.vehicleName || '' });
//         }
//       }

//       if (driverId) {
//         if (!freeD.find((x) => x.id === driverId)) {
//           const curD = drivers.find((x) => x.id === driverId);
//           if (curD) freeD.unshift(curD);
//           else freeD.unshift({ id: driverId, name: editItem.driver?.name || '', mobileNumber: editItem.driver?.mobileNumber || '' });
//         }
//       }
//     }

//     setFreeVehicles(freeV);
//     setFreeDrivers(freeD);
//   }, [vehicles, drivers, mappings, editItem, mode]);

//   // ----------------- prepare form when editItem changes -----------------
//   useEffect(() => {
//     if (!open) return;
//     if (mode === 'edit' && editItem) {
//       setForm({
//         corporateId: editItem.corporate?.id ?? '',
//         branchId: editItem.branch?.id ?? '',
//         vehicleId: editItem.vehicle?.id ?? '',
//         driverId: editItem.driver?.id ?? '',
//         isActive: editItem.isActive ?? true,
//       });
//     } else {
//       setForm({
//         corporateId: '',
//         branchId: '',
//         vehicleId: '',
//         driverId: '',
//         isActive: true,
//       });
//     }
//     setErrors({});
//   }, [open, mode, editItem]);

//   // ----------------- handle change -----------------
//   const handleChange = (key: string, value: any) => {
//     setForm((p) => ({ ...p, [key]: value }));
//   };

//   // ----------------- validate -----------------
//   const validate = () => {
//     const err: Record<string, string> = {};
//     if (!form.corporateId) err.corporateId = 'Required';
//     if (!form.branchId) err.branchId = 'Required';
//     if (!form.vehicleId) err.vehicleId = 'Required';
//     if (!form.driverId) err.driverId = 'Required';
//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   // ----------------- submit -----------------
//   const handleSubmit = async () => {
//     if (!validate()) return;

//     try {
//       setSaving(true);

//       const payload = {
//         corporateId: Number(form.corporateId),
//         branchId: Number(form.branchId),
//         vehicleId: Number(form.vehicleId),
//         driverId: Number(form.driverId),
//         isActive: Boolean(form.isActive),
//       };

//       if (mode === 'add') {
//         await axiosInstance.post('/cvd-mapping/create', payload);
//         toast.success('Mapping created');
//       } else if (mode === 'edit' && editItem?.id) {
//         await axiosInstance.patch(`/cvd-mapping/update/${editItem.id}`, payload);
//         toast.success('Mapping updated');
//       }

//       onSaved?.();
//       refreshData?.();
//       onClose();
//     } catch (err: any) {
//       console.error(err);
//       const msg = err?.response?.data?.message || err?.message || 'Operation failed';
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCorporateChange = (corpId: number | '') => {
//     handleChange('corporateId', corpId);
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" mb={2}>
//           {mode === 'add' ? 'Create CVD Mapping' : 'Edit CVD Mapping'}
//         </Typography>

//         {loading ? (
//           <Box sx={{ textAlign: 'center', py: 6 }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel id="corp-label">Corporate</InputLabel>
//                 <Select
//                   labelId="corp-label"
//                   value={form.corporateId ?? ''}
//                   label="Corporate"
//                   onChange={(e) => handleCorporateChange(Number(e.target.value) || '')}
//                 >
//                   <MenuItem value="">None</MenuItem>
//                   {corporates.map((c) => (
//                     <MenuItem key={c.id} value={c.id}>
//                       {c.corporateName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.corporateId && <Typography color="error">{errors.corporateId}</Typography>}
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel id="branch-label">Branch</InputLabel>
//                 <Select
//                   labelId="branch-label"
//                   value={form.branchId ?? ''}
//                   label="Branch"
//                   onChange={(e) => handleChange('branchId', Number(e.target.value) || '')}
//                 >
//                   <MenuItem value="">None</MenuItem>
//                   {branches
//                     .filter((b) => !form.corporateId || b.corporateId === form.corporateId)
//                     .map((b) => (
//                       <MenuItem key={b.id} value={b.id}>
//                         {b.branchName}
//                       </MenuItem>
//                     ))}
//                 </Select>
//                 {errors.branchId && <Typography color="error">{errors.branchId}</Typography>}
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel id="vehicle-label">Vehicle</InputLabel>
//                 <Select
//                   labelId="vehicle-label"
//                   value={form.vehicleId ?? ''}
//                   label="Vehicle"
//                   onChange={(e) => handleChange('vehicleId', Number(e.target.value) || '')}
//                 >
//                   <MenuItem value="">None</MenuItem>
//                   {freeVehicles.map((v) => (
//                     <MenuItem key={v.id} value={v.id}>
//                       {v.vehicleNumber} {v.vehicleName ? `(${v.vehicleName})` : ''}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.vehicleId && <Typography color="error">{errors.vehicleId}</Typography>}
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel id="driver-label">Driver</InputLabel>
//                 <Select
//                   labelId="driver-label"
//                   value={form.driverId ?? ''}
//                   label="Driver"
//                   onChange={(e) => handleChange('driverId', Number(e.target.value) || '')}
//                 >
//                   <MenuItem value="">None</MenuItem>
//                   {freeDrivers.map((d) => (
//                     <MenuItem key={d.id} value={d.id}>
//                       {d.name} {d.mobileNumber ? `(${d.mobileNumber})` : ''}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.driverId && <Typography color="error">{errors.driverId}</Typography>}
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
//               <Stack direction="row" spacing={2}>
//                 <Button variant="outlined" onClick={onClose} disabled={saving}>
//                   Cancel
//                 </Button>

//                 <Button variant="contained" onClick={handleSubmit} disabled={saving}>
//                   {saving ? <CircularProgress size={20} /> : mode === 'add' ? 'Create' : 'Update'}
//                 </Button>
//               </Stack>

//               <FormControl>
//                 <Stack direction="row" alignItems="center" spacing={1}>
//                   <Typography>Active</Typography>
//                   <Select
//                     value={form.isActive ? 'true' : 'false'}
//                     onChange={(e) => handleChange('isActive', e.target.value === 'true')}
//                     size="small"
//                   >
//                     <MenuItem value="true">Yes</MenuItem>
//                     <MenuItem value="false">No</MenuItem>
//                   </Select>
//                 </Stack>
//               </FormControl>
//             </Grid>
//           </Grid>
//         )}
//       </Box>
//     </Modal>
//   );
// }
// import { useEffect, useMemo, useState } from 'react';
// import {
//   Modal,
//   Box,
//   Typography,
//   Grid,
//   Button,
//   Switch,
//   CircularProgress,
//   TextField,
//   Stack,
//   FormControl,
// } from '@mui/material';

// import Autocomplete from '@mui/material/Autocomplete';
// import axiosInstance from 'src/config-global';
// import toast from 'react-hot-toast';

// import type { CvdMappingProps } from './types';

// const modalStyle = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
//   maxHeight: '90%',
//   bgcolor: 'background.paper',
//   p: 4,
//   borderRadius: 2,
//   overflowY: 'auto',
// };

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSaved?: () => void;

//   mode?: 'add' | 'edit';
//   editItem?: CvdMappingProps | null;

//   corporates?: any[];
//   branches?: any[];
//   vehicles?: any[];
//   drivers?: any[];
//   mappings?: any[];

//   refreshData?: () => void;
// };

// export default function CvdAddEditModal({
//   open,
//   onClose,
//   onSaved,
//   mode = 'add',
//   editItem,
//   corporates: parentCorporates = [],
//   branches: parentBranches = [],
//   vehicles: parentVehicles = [],
//   drivers: parentDrivers = [],
//   mappings = [],
//   refreshData,
// }: Props) {
//   const [loadingLists, setLoadingLists] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [corporates, setCorporates] = useState<any[]>(parentCorporates);
//   const [branches, setBranches] = useState<any[]>(parentBranches);
//   const [vehicles, setVehicles] = useState<any[]>(parentVehicles);
//   const [drivers, setDrivers] = useState<any[]>(parentDrivers);

//   const [form, setForm] = useState({
//     corporateId: null as number | null,
//     branchId: null as number | null,
//     vehicleId: null as number | null,
//     driverId: null as number | null,
//     isActive: true,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Load lists if parent did not pass them
//   useEffect(() => {
//     if (!open) return;

//     const fetchLists = async () => {
//       setLoadingLists(true);
//       try {
//         if (!parentCorporates.length) {
//           const res = await axiosInstance.post('/companies/list');
//           setCorporates(res.data?.data?.items || []);
//         }

//         if (!parentBranches.length) {
//           const res = await axiosInstance.post('/branches/list');
//           setBranches(res.data?.data?.items || []);
//         }

//         if (!parentVehicles.length) {
//           const res = await axiosInstance.get('/vehicle/list');
//           setVehicles(res.data?.data?.result?.data || []);
//           // console.log("parent didn not pass ", res.data)
//         }

//         if (!parentDrivers.length) {
//           const res = await axiosInstance.get('/driver/list');
//           setDrivers(res.data?.data?.data?.result?.data || []);
//           // console.log("parent did not pass driver", res.data);
//         }
//       } catch (err) {
//         toast.error('Failed to load data');
//       } finally {
//         setLoadingLists(false);
//       }
//     };

//     fetchLists();
//   }, [open]);

//   // Free Vehicle & Free Driver sets
//   const occupiedVehicleIds = useMemo(
//     () => new Set(mappings.filter((m) => m.isActive).map((m) => m.vehicle?.id)),
//     [mappings]
//   );

//   const occupiedDriverIds = useMemo(
//     () => new Set(mappings.filter((m) => m.isActive).map((m) => m.driver?.id)),
//     [mappings]
//   );

//   const freeVehicles = useMemo(() => {
//     const free = vehicles.filter((v) => !occupiedVehicleIds.has(v.id));

//     if (mode === 'edit' && editItem?.vehicle?.id) {
//       const currentId = editItem.vehicle.id;
//       if (!free.find((v) => v.id === currentId)) {
//         const current = vehicles.find((v) => v.id === currentId);
//         if (current) free.unshift(current);
//       }
//     }

//     return free;
//   }, [vehicles, occupiedVehicleIds, mode, editItem]);

//   const freeDrivers = useMemo(() => {
//     const free = drivers.filter((d) => !occupiedDriverIds.has(d.id));

//     if (mode === 'edit' && editItem?.driver?.id) {
//       const currentId = editItem.driver.id;
//       if (!free.find((d) => d.id === currentId)) {
//         const current = drivers.find((d) => d.id === currentId);
//         if (current) free.unshift(current);
//       }
//     }

//     return free;
//   }, [drivers, occupiedDriverIds, mode, editItem]);

//   // Branches for selected corporate
//   const filteredBranches = useMemo(() => {
//     if (!form.corporateId) return branches;
//     return branches.filter(
//       (b) =>
//         b.corporateId === form.corporateId ||
//         b.corporate?.id === form.corporateId
//     );
//   }, [branches, form.corporateId]);

//   // Prefill form when editing
//   useEffect(() => {
//     if (!open) return;

//     if (mode === 'edit' && editItem) {
//       setForm({
//         corporateId: editItem.corporate?.id ?? null,
//         branchId: editItem.branch?.id ?? null,
//         vehicleId: editItem.vehicle?.id ?? null,
//         driverId: editItem.driver?.id ?? null,
//         isActive: editItem.isActive,
//       });
//     } else {
//       setForm({
//         corporateId: null,
//         branchId: null,
//         vehicleId: null,
//         driverId: null,
//         isActive: true,
//       });
//     }

//     setErrors({});
//   }, [open, mode, editItem]);

//   const validate = () => {
//     const e: Record<string, string> = {};

//     if (!form.corporateId) e.corporateId = 'Required';
//     if (!form.branchId) e.branchId = 'Required';
//     if (!form.vehicleId) e.vehicleId = 'Required';
//     if (!form.driverId) e.driverId = 'Required';

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;

//     // client side safety
//     if (
//       occupiedVehicleIds.has(form.vehicleId as number) &&
//       !(mode === 'edit' && editItem?.vehicle?.id === form.vehicleId)
//     ) {
//       toast.error('Vehicle already mapped');
//       return;
//     }

//     if (
//       occupiedDriverIds.has(form.driverId as number) &&
//       !(mode === 'edit' && editItem?.driver?.id === form.driverId)
//     ) {
//       toast.error('Driver already mapped');
//       return;
//     }

//     const payload: any = {
//       corporateId: Number(form.corporateId),
//       branchId: Number(form.branchId),
//       vehicleId: Number(form.vehicleId),
//       driverId: Number(form.driverId),
//     };

//     try {
//       setSaving(true);

//       if (mode === 'add') {
//         await axiosInstance.post('/cvd-mapping/create', payload);
//         toast.success('Mapping created');
//       } else if (mode === 'edit') {
//         payload.isActive = form.isActive;
//         await axiosInstance.patch(`/cvd-mapping/update/${editItem?.id}`, payload);
//         toast.success('Mapping updated');
//       }

//       refreshData?.();
//       onSaved?.();
//       onClose();
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || 'Operation failed');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" mb={2}>
//           {mode === 'add' ? 'Create CVD Mapping' : 'Edit CVD Mapping'}
//         </Typography>

//         {loadingLists ? (
//           <Box textAlign="center" py={5}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Grid container spacing={2}>

//             {/* CORPORATE */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={corporates}
//                   getOptionLabel={(o) => o.corporateName || o.name || ''}
//                   value={corporates.find((c) => c.id === form.corporateId) || null}
//                   onChange={(_, v) =>
//                     setForm({ ...form, corporateId: v?.id || null, branchId: null })
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Corporate"
//                       error={!!errors.corporateId}
//                       helperText={errors.corporateId}
//                     />
//                   )}
//                 />
//               </FormControl>
//             </Grid>

//             {/* BRANCH */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={filteredBranches}
//                   getOptionLabel={(o) => o.name || o.branchName || ''}
//                   value={filteredBranches.find((b) => b.id === form.branchId) || null}
//                   onChange={(_, v) =>
//                     setForm({ ...form, branchId: v?.id || null })
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Branch"
//                       error={!!errors.branchId}
//                       helperText={errors.branchId}
//                     />
//                   )}
//                 />
//               </FormControl>
//             </Grid>

//             {/* VEHICLE */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={freeVehicles}
//                   getOptionLabel={(o) =>
//                     `${o.vehicleNumber || ''}  ${
//                       o.vehicleName ? `(${o.vehicleName})` : ''
//                     }`
//                   }
//                   value={freeVehicles.find((v) => v.id === form.vehicleId) || null}
//                   onChange={(_, v) =>
//                     setForm({ ...form, vehicleId: v?.id || null })
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Vehicle"
//                       error={!!errors.vehicleId}
//                       helperText={errors.vehicleId}
//                     />
//                   )}
//                 />
//               </FormControl>
//             </Grid>

//             {/* DRIVER */}
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <Autocomplete
//                   options={freeDrivers}
//                   getOptionLabel={(o) =>
//                     `${o.name || ''}  ${
//                       o.mobileNumber ? `(${o.mobileNumber})` : ''
//                     }`
//                   }
//                   value={freeDrivers.find((d) => d.id === form.driverId) || null}
//                   onChange={(_, v) =>
//                     setForm({ ...form, driverId: v?.id || null })
//                   }
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Driver"
//                       error={!!errors.driverId}
//                       helperText={errors.driverId}
//                     />
//                   )}
//                 />
//               </FormControl>
//             </Grid>

//             {/* ACTION + STATUS SWITCH */}
//             <Grid
//               item
//               xs={12}
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Stack direction="row" spacing={2}>
//                 <Button variant="outlined" onClick={onClose} disabled={saving}>
//                   Cancel
//                 </Button>
//                 <Button variant="contained" onClick={handleSubmit} disabled={saving}>
//                   {saving ? <CircularProgress size={20} /> : mode === 'add' ? 'Create' : 'Update'}
//                 </Button>
//               </Stack>

//               <Stack direction="row" spacing={1} alignItems="center">
//                 <Typography>Active</Typography>
//                 <Switch
//                   checked={form.isActive}
//                   onChange={(_, v) => setForm({ ...form, isActive: v })}
//                 />
//               </Stack>
//             </Grid>

//           </Grid>
//         )}
//       </Box>
//     </Modal>
//   );
// }
// import { useEffect, useMemo, useState } from 'react';
// import {
//   Modal,
//   Box,
//   Typography,
//   Grid,
//   Button,
//   Switch,
//   CircularProgress,
//   TextField,
//   Stack,
//   FormControl,
// } from '@mui/material';

// import Autocomplete from '@mui/material/Autocomplete';
// import axiosInstance from 'src/config-global';
// import toast from 'react-hot-toast';

// import type { CvdMappingProps } from './types';

// // -----------------------------
// // MODAL STYLE
// // -----------------------------
// const modalStyle = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
//   maxHeight: '90%',
//   bgcolor: 'background.paper',
//   p: 4,
//   borderRadius: 2,
//   overflowY: 'auto',
// };

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSaved?: () => void;

//   mode?: 'add' | 'edit';
//   editItem?: CvdMappingProps | null;

//   corporates?: any[];
//   branches?: any[];
//   vehicles?: any[];
//   drivers?: any[];
//   mappings?: any[];

//   refreshData?: () => void;
// };

// // -----------------------------
// // MODAL COMPONENT
// // -----------------------------
// export default function CvdAddEditModal({
//   open,
//   onClose,
//   onSaved,
//   mode = 'add',
//   editItem,
//   corporates: parentCorporates = [],
//   branches: parentBranches = [],
//   vehicles: parentVehicles = [],
//   drivers: parentDrivers = [],
//   mappings = [],
//   refreshData,
// }: Props) {
//   const [loadingLists, setLoadingLists] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [corporates, setCorporates] = useState<any[]>(parentCorporates);
//   const [branches, setBranches] = useState<any[]>(parentBranches);
//   const [vehicles, setVehicles] = useState<any[]>(parentVehicles);
//   const [drivers, setDrivers] = useState<any[]>(parentDrivers);

//   const [form, setForm] = useState({
//     corporateId: null as number | null,
//     branchId: null as number | null,
//     vehicleId: null as number | null,
//     driverId: null as number | null,
//     isActive: true,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // -----------------------------
//   // LOAD LISTS IF NOT PROVIDED
//   // -----------------------------
//   useEffect(() => {
//     if (!open) return;

//     const fetchLists = async () => {
//       setLoadingLists(true);
//       try {
//         if (!parentCorporates.length) {
//           const res = await axiosInstance.post('/companies/list');
//           setCorporates(res.data?.data?.items || []);
//         }

//         if (!parentBranches.length) {
//           const res = await axiosInstance.post('/branches/list');
//           setBranches(res.data?.data?.items || []);
//         }

//         if (!parentVehicles.length) {
//           const res = await axiosInstance.get('/vehicle/list');
//           setVehicles(res.data?.data?.result?.data ?? []);
//         }

//         if (!parentDrivers.length) {
//           const res = await axiosInstance.get('/driver/list');
//           setDrivers(res.data?.data?.result?.data || []);
//         }
//       } catch (err) {
//         toast.error('Failed to load data');
//       } finally {
//         setLoadingLists(false);
//       }
//     };

//     fetchLists();
//   }, [open]);

//   // -----------------------------
//   // REINSERT CURRENT VEHICLE AFTER LOAD
//   // -----------------------------
//   useEffect(() => {
//     if (mode !== 'edit' || !editItem?.vehicle?.id) return;

//     if (vehicles.length > 0) {
//       const exists = vehicles.some((v) => v.id === editItem.vehicle!.id);
//       if (!exists) {
//         setVehicles((prev) => [editItem.vehicle!, ...prev]);
//       }
//     }
//   }, [vehicles, mode, editItem]);

//   // -----------------------------
//   // REINSERT CURRENT DRIVER AFTER LOAD
//   // -----------------------------
//   useEffect(() => {
//     if (mode !== 'edit' || !editItem?.driver?.id) return;

//     if (drivers.length > 0) {
//       const exists = drivers.some((d) => d.id === editItem.driver!.id);
//       if (!exists) {
//         setDrivers((prev) => [editItem.driver!, ...prev]);
//       }
//     }
//   }, [drivers, mode, editItem]);

//   // -----------------------------
//   // OCCUPIED VEHICLES/DRIVERS
//   // -----------------------------
//   const occupiedVehicleIds = useMemo(
//     () => new Set(mappings.filter((m) => m.isActive).map((m) => m.vehicle?.id)),
//     [mappings]
//   );

//   const occupiedDriverIds = useMemo(
//     () => new Set(mappings.filter((m) => m.isActive).map((m) => m.driver?.id)),
//     [mappings]
//   );

//   // -----------------------------
//   // FREE VEHICLES
//   // -----------------------------
//   const freeVehicles = useMemo(() => {
//     const free = vehicles.filter((v) => !occupiedVehicleIds.has(v.id));

//     if (mode === 'edit' && editItem?.vehicle?.id) {
//       if (!free.find((v) => v.id === editItem.vehicle!.id)) {
//         free.unshift(editItem.vehicle!);
//       }
//     }

//     return free;
//   }, [vehicles, occupiedVehicleIds, mode, editItem]);

//   // -----------------------------
//   // FREE DRIVERS
//   // -----------------------------
//   const freeDrivers = useMemo(() => {
//     const free = drivers.filter((d) => !occupiedDriverIds.has(d.id));

//     if (mode === 'edit' && editItem?.driver?.id) {
//       if (!free.find((d) => d.id === editItem.driver!.id)) {
//         free.unshift(editItem.driver!);
//       }
//     }

//     return free;
//   }, [drivers, occupiedDriverIds, mode, editItem]);

//   // -----------------------------
//   // FILTER BRANCHES BY CORPORATE
//   // -----------------------------
//   const filteredBranches = useMemo(() => {
//     if (!form.corporateId) return branches;

//     return branches.filter(
//       (b) => b.corporateId === form.corporateId || b.corporate?.id === form.corporateId
//     );
//   }, [branches, form.corporateId]);

//   // -----------------------------
//   // PREFILL EDIT FORM
//   // -----------------------------
//   useEffect(() => {
//     if (!open) return;

//     if (mode === 'edit' && editItem) {
//       setForm({
//         corporateId: editItem.corporate?.id ?? null,
//         branchId: editItem.branch?.id ?? null,
//         vehicleId: editItem.vehicle?.id ?? null,
//         driverId: editItem.driver?.id ?? null,
//         isActive: editItem.isActive,
//       });
//     } else {
//       setForm({
//         corporateId: null,
//         branchId: null,
//         vehicleId: null,
//         driverId: null,
//         isActive: true,
//       });
//     }

//     setErrors({});
//   }, [open, mode, editItem]);

//   // -----------------------------
//   // VALIDATION
//   // -----------------------------
//   const validate = () => {
//     const e: Record<string, string> = {};

//     if (!form.corporateId) e.corporateId = 'Required';
//     if (!form.branchId) e.branchId = 'Required';
//     if (!form.vehicleId) e.vehicleId = 'Required';
//     if (!form.driverId) e.driverId = 'Required';

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // -----------------------------
//   // SUBMIT
//   // -----------------------------
//   const handleSubmit = async () => {
//     if (!validate()) return;

//     if (
//       occupiedVehicleIds.has(form.vehicleId as number) &&
//       !(mode === 'edit' && editItem?.vehicle?.id === form.vehicleId)
//     ) {
//       toast.error('Vehicle already mapped');
//       return;
//     }

//     if (
//       occupiedDriverIds.has(form.driverId as number) &&
//       !(mode === 'edit' && editItem?.driver?.id === form.driverId)
//     ) {
//       toast.error('Driver already mapped');
//       return;
//     }

//     const payload: any = {
//       corporateId: Number(form.corporateId),
//       branchId: Number(form.branchId),
//       vehicleId: Number(form.vehicleId),
//       driverId: Number(form.driverId),
//     };

//     try {
//       setSaving(true);

//       if (mode === 'add') {
//         await axiosInstance.post('/cvd-mapping/create', payload);
//         toast.success('Mapping created');
//       } else {
//         payload.isActive = form.isActive;
//         await axiosInstance.patch(`/cvd-mapping/update/${editItem?.id}`, payload);
//         toast.success('Mapping updated');
//       }

//       refreshData?.();
//       onSaved?.();
//       onClose();
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || 'Operation failed');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // -----------------------------
//   // UI
//   // -----------------------------
//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" mb={2}>
//           {mode === 'add' ? 'Create CVD Mapping' : 'Edit CVD Mapping'}
//         </Typography>

//         {loadingLists ? (
//           <Box textAlign="center" py={5}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Grid container spacing={2}>
//             {/* CORPORATE */}
//             <Grid item xs={12} sm={6}>
//               <Autocomplete
//                 options={corporates}
//                 getOptionLabel={(o) => o.corporateName || ''}
//                 value={corporates.find((c) => c.id === form.corporateId) || null}
//                 onChange={(_, v) =>
//                   setForm({ ...form, corporateId: v?.id || null, branchId: null })
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Corporate"
//                     error={!!errors.corporateId}
//                     helperText={errors.corporateId}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* BRANCH */}
//             <Grid item xs={12} sm={6}>
//               <Autocomplete
//                 options={filteredBranches}
//                 getOptionLabel={(o) => o.name || ''}
//                 value={filteredBranches.find((b) => b.id === form.branchId) || null}
//                 onChange={(_, v) => setForm({ ...form, branchId: v?.id || null })}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Branch"
//                     error={!!errors.branchId}
//                     helperText={errors.branchId}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* VEHICLE */}
//             <Grid item xs={12} sm={6}>
//               <Autocomplete
//                 options={freeVehicles}
//                 getOptionLabel={(o) => `${o.vehicleNumber || ''} (${o.vehicleName || ''})`}
//                 value={freeVehicles.find((v) => v.id === form.vehicleId) || null}
//                 onChange={(_, v) => setForm({ ...form, vehicleId: v?.id || null })}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Vehicle"
//                     error={!!errors.vehicleId}
//                     helperText={errors.vehicleId}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* DRIVER */}
//             <Grid item xs={12} sm={6}>
//               <Autocomplete
//                 options={freeDrivers}
//                 getOptionLabel={(o) => `${o.name || ''} (${o.mobileNumber || ''})`}
//                 value={freeDrivers.find((d) => d.id === form.driverId) || null}
//                 onChange={(_, v) => setForm({ ...form, driverId: v?.id || null })}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Driver"
//                     error={!!errors.driverId}
//                     helperText={errors.driverId}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* ACTION + STATUS */}
//             <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
//               <Stack direction="row" spacing={2}>
//                 <Button variant="outlined" onClick={onClose} disabled={saving}>
//                   Cancel
//                 </Button>

//                 <Button variant="contained" onClick={handleSubmit} disabled={saving}>
//                   {saving ? <CircularProgress size={20} /> : mode === 'add' ? 'Create' : 'Update'}
//                 </Button>
//               </Stack>

//               <Stack direction="row" spacing={1} alignItems="center">
//                 <Typography>Active</Typography>
//                 <Switch
//                   checked={form.isActive}
//                   onChange={(_, v) => setForm({ ...form, isActive: v })}
//                 />
//               </Stack>
//             </Grid>
//           </Grid>
//         )}
//       </Box>
//     </Modal>
//   );
// }

// ----------------------------------------------------
// CVD ADD/EDIT MODAL  (FINAL WORKING VERSION)
// ----------------------------------------------------
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  Switch,
  CircularProgress,
  TextField,
  Stack,
} from '@mui/material';

import Autocomplete from '@mui/material/Autocomplete';
import axiosInstance from 'src/config-global';
import toast from 'react-hot-toast';

import { CvdMappingProps } from './types';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
  maxHeight: '90%',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 2,
  overflowY: 'auto',
};

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: 'add' | 'edit';
  editItem?: CvdMappingProps | null;

  corporates: any[];
  branches: any[];
  vehicles: any[];
  drivers: any[];
  mappings: any[];

  refreshData?: () => void;
};

export default function CvdAddEditModal({
  open,
  onClose,
  mode = 'add',
  editItem,
  corporates,
  branches,
  vehicles,
  drivers,
  mappings,
  refreshData,
}: Props) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    corporateId: null as number | null,
    branchId: null as number | null,
    vehicleId: null as number | null,
    driverId: null as number | null,
    isActive: true,
  });

  const [errors, setErrors] = useState<any>({});

  // ----------------------------------------------------
  // PREFILL FOR EDIT
  // ----------------------------------------------------
  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && editItem) {
      setForm({
        corporateId: editItem.corporate?.id ?? null,
        branchId: editItem.branch?.id ?? null,
        vehicleId: editItem.vehicle?.id ?? null,
        driverId: editItem.driver?.id ?? null,
        isActive: editItem.isActive,
      });
    } else {
      setForm({
        corporateId: null,
        branchId: null,
        vehicleId: null,
        driverId: null,
        isActive: true,
      });
    }

    setErrors({});
  }, [open, mode, editItem]);

  // ----------------------------------------------------
  // OCCUPIED VEHICLES/DRIVERS
  // ----------------------------------------------------
  const occupiedVehicleIds = useMemo(
    () => new Set(mappings.filter((m) => m.isActive).map((m) => m.vehicle?.id)),
    [mappings]
  );

  const occupiedDriverIds = useMemo(
    () => new Set(mappings.filter((m) => m.isActive).map((m) => m.driver?.id)),
    [mappings]
  );

  // ----------------------------------------------------
  // FREE VEHICLES
  // ----------------------------------------------------
  const freeVehicles = useMemo(() => {
    let free = vehicles.filter((v) => !occupiedVehicleIds.has(v.id));

    // Allow current value during edit
    if (mode === 'edit' && editItem?.vehicle) {
      const exists = free.some((v) => v.id === editItem.vehicle!.id);
      if (!exists) free = [editItem.vehicle!, ...free];
    }

    return free;
  }, [vehicles, occupiedVehicleIds, mode, editItem]);

  // ----------------------------------------------------
  // FREE DRIVERS
  // ----------------------------------------------------
  const freeDrivers = useMemo(() => {
    let free = drivers.filter((d) => !occupiedDriverIds.has(d.id));

    // Allow current value during edit
    if (mode === 'edit' && editItem?.driver) {
      const exists = free.some((d) => d.id === editItem.driver!.id);
      if (!exists) free = [editItem.driver!, ...free];
    }

    return free;
  }, [drivers, occupiedDriverIds, mode, editItem]);

  // ----------------------------------------------------
  // FILTER BRANCHES BY CORPORATE
  // ----------------------------------------------------
  const filteredBranches = useMemo(() => {
    if (!form.corporateId) return branches;
    return branches.filter(
      (b) => b.corporateId === form.corporateId || b.corporate?.id === form.corporateId
    );
  }, [form.corporateId, branches]);

  // ----------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------
  const validate = () => {
    const e: any = {};
    if (!form.corporateId) e.corporateId = 'Required';
    if (!form.branchId) e.branchId = 'Required';
    if (!form.vehicleId) e.vehicleId = 'Required';
    if (!form.driverId) e.driverId = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ----------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: any = {
      corporateId: form.corporateId,
      branchId: form.branchId,
      vehicleId: form.vehicleId,
      driverId: form.driverId,
    };

    try {
      setSaving(true);

      if (mode === 'add') {
        await axiosInstance.post('/cvd-mapping/create', payload);
        toast.success('Mapping created');
      } else {
        payload.isActive = form.isActive;
        await axiosInstance.patch(`/cvd-mapping/update/${editItem?.id}`, payload);
        toast.success('Mapping updated');
      }

      refreshData?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {mode === 'add' ? 'Create CVD Mapping' : 'Edit CVD Mapping'}
        </Typography>

        <Grid container spacing={2}>
          {/* CORPORATE */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={corporates}
              getOptionLabel={(o) => o.corporateName || ''}
              value={corporates.find((c) => c.id === form.corporateId) || null}
              onChange={(_, v) => setForm({ ...form, corporateId: v?.id || null, branchId: null })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Corporate"
                  error={!!errors.corporateId}
                  helperText={errors.corporateId}
                />
              )}
            />
          </Grid>

          {/* BRANCH */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={filteredBranches}
              getOptionLabel={(o) => o.name || ''}
              value={filteredBranches.find((b) => b.id === form.branchId) || null}
              onChange={(_, v) => setForm({ ...form, branchId: v?.id || null })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Branch"
                  error={!!errors.branchId}
                  helperText={errors.branchId}
                />
              )}
            />
          </Grid>

          {/* VEHICLE */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={freeVehicles}
              getOptionLabel={(o) => `${o.vehicleNumber} (${o.vehicleName})`}
              value={freeVehicles.find((v) => v.id === form.vehicleId) || null}
              onChange={(_, v) => setForm({ ...form, vehicleId: v?.id || null })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vehicle"
                  error={!!errors.vehicleId}
                  helperText={errors.vehicleId}
                />
              )}
            />
          </Grid>

          {/* DRIVER */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={freeDrivers}
              getOptionLabel={(o) => `${o.name} (${o.mobileNumber})`}
              value={freeDrivers.find((d) => d.id === form.driverId) || null}
              onChange={(_, v) => setForm({ ...form, driverId: v?.id || null })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Driver"
                  error={!!errors.driverId}
                  helperText={errors.driverId}
                />
              )}
            />
          </Grid>

          {/* ACTIONS */}
          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={onClose} disabled={saving}>
                Cancel
              </Button>

              <Button variant="contained" onClick={handleSubmit} disabled={saving}>
                {saving ? <CircularProgress size={20} /> : mode === 'add' ? 'Create' : 'Update'}
              </Button>
            </Stack>

            {mode === 'edit' && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Active</Typography>
                <Switch
                  checked={form.isActive}
                  onChange={(_, v) => setForm({ ...form, isActive: v })}
                />
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
