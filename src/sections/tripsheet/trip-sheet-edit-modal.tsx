// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { useState, useEffect } from 'react';
// import axiosInstance from 'src/config-global';
// import toast from 'react-hot-toast';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: '95%', md: 800 },
//   bgcolor: 'background.paper',
//   p: 3,
//   borderRadius: 2,
// };

// export default function TripSheetEditModal({ open, onClose, item, onUpdated }: any) {
//   const [form, setForm] = useState<any>({});

//   useEffect(() => {
//     if (item) setForm({ ...item });
//   }, [item]);

//   const updateField = (k: string, v: any) => {
//     setForm((prev: any) => ({ ...prev, [k]: v }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         id: form.id,
//         tripDate: form.tripDate,
//         startTime: form.startTime,
//         endTime: form.endTime,
//         startOdometer: form.startOdometer,
//         endOdometer: form.endOdometer,
//         totalKm: form.endOdometer && form.startOdometer
//           ? Number(form.endOdometer) - Number(form.startOdometer)
//           : form.totalKm,
//         sourceName: form.sourceName,
//         destinationName: form.destinationName,
//         documents: form.documents || null,
//         isActive: true,
//       };

//       await axiosInstance.patch('/tripsheet/updateTripSheetByAdmin', payload);
//       toast.success('Trip sheet updated');

//       onUpdated();
//       onClose();
//     } catch (err: any) {
//       toast.error('Update failed');
//     }
//   };

//   if (!item) return null;

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={style}>
//         <Typography variant="h6" mb={2}>Edit Trip Sheet #{item.id}</Typography>

//         <Grid container spacing={2}>
//           {/* Trip Date */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Trip Date"
//               type="datetime-local"
//               value={form.tripDate ? form.tripDate.substring(0, 16) : ''}
//               onChange={(e) => updateField('tripDate', e.target.value)}
//             />
//           </Grid>

//           {/* Start Time */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Start Time"
//               type="time"
//               value={form.startTime || ''}
//               onChange={(e) => updateField('startTime', e.target.value)}
//             />
//           </Grid>

//           {/* End Time */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="End Time"
//               type="time"
//               value={form.endTime || ''}
//               onChange={(e) => updateField('endTime', e.target.value)}
//             />
//           </Grid>

//           {/* Odometers */}
//           <Grid item xs={12} sm={4}>
//             <TextField
//               fullWidth
//               label="Start KM"
//               type="number"
//               value={form.startOdometer || ''}
//               onChange={(e) => updateField('startOdometer', e.target.value)}
//             />
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <TextField
//               fullWidth
//               label="End KM"
//               type="number"
//               value={form.endOdometer || ''}
//               onChange={(e) => updateField('endOdometer', e.target.value)}
//             />
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <TextField
//               fullWidth
//               label="Total KM"
//               value={
//                 form.startOdometer && form.endOdometer
//                   ? Number(form.endOdometer) - Number(form.startOdometer)
//                   : form.totalKm
//               }
//               disabled
//             />
//           </Grid>

//           {/* Source / Destination */}
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Source Location"
//               value={form.sourceName || ''}
//               onChange={(e) => updateField('sourceName', e.target.value)}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Destination Location"
//               value={form.destinationName || ''}
//               onChange={(e) => updateField('destinationName', e.target.value)}
//             />
//           </Grid>
//         </Grid>

//         <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
//           <Button variant="outlined" onClick={onClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit}>Save</Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }
// trip-sheet-edit-modal.tsx
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import axiosInstance from 'src/config-global';
import toast from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', md: 900 },
  bgcolor: 'background.paper',
  p: 3,
  borderRadius: 2,
};

export default function TripSheetEditModal({ open, onClose, item, onUpdated }: any) {
  const [form, setForm] = useState<any>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      // copy only allowed fields
      setForm({
        tripSheetId: item.id, // IMPORTANT: backend expects tripSheetId
        tripDate: item.tripDate ? item.tripDate : null,
        startTime: item.startTime || '',
        endTime: item.endTime || '',
        startOdometer: item.startOdometer ?? '',
        endOdometer: item.endOdometer ?? '',
        sourceName: item.sourceName || '',
        destinationName: item.destinationName || '',
        documents: item.documents || null,
        isActive: item.isActive ?? true,
      });
    } else {
      setForm({});
    }
  }, [item]);

  const updateField = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }));

  const computeTotalKm = () => {
    if (form.startOdometer !== '' && form.endOdometer !== '' && !isNaN(Number(form.startOdometer)) && !isNaN(Number(form.endOdometer))) {
      const s = Number(form.startOdometer);
      const e = Number(form.endOdometer);
      if (e >= s) return e - s;
    }
    return '';
  };

  const handleSaveClick = () => setConfirmOpen(true);

  const handleConfirmClose = () => setConfirmOpen(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload: any = {
        tripSheetId: form.tripSheetId,
        tripDate: form.tripDate,
        startTime: form.startTime,
        endTime: form.endTime,
        startOdometer: form.startOdometer === '' ? null : Number(form.startOdometer),
        endOdometer: form.endOdometer === '' ? null : Number(form.endOdometer),
        totalKm: computeTotalKm() === '' ? null : computeTotalKm(),
        sourceName: form.sourceName,
        destinationName: form.destinationName,
        documents: form.documents || null,
        isActive: form.isActive,
      };

      await axiosInstance.patch('/tripsheet/updateTripSheetByAdmin', payload);
      toast.success('Trip sheet updated');
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error('updateTripSheetByAdmin error', err);
      toast.error('Update failed');
    } finally {
      setSaving(false);
      handleConfirmClose();
    }
  };

  if (!item) return null;

  return (
    <>
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Edit Trip Sheet #{item.id}</Typography>

        <Grid container spacing={2}>
          {/* Trip Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Trip Date"
              type="datetime-local"
              value={form.tripDate ? String(form.tripDate).substring(0, 16) : ''}
              onChange={(e) => updateField('tripDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Start Time */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              value={form.startTime || ''}
              onChange={(e) => updateField('startTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* End Time */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Time"
              type="time"
              value={form.endTime || ''}
              onChange={(e) => updateField('endTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Odometers */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Start KM"
              type="number"
              value={form.startOdometer ?? ''}
              onChange={(e) => updateField('startOdometer', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="End KM"
              type="number"
              value={form.endOdometer ?? ''}
              onChange={(e) => updateField('endOdometer', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Total KM"
              value={computeTotalKm() === '' ? (item.totalKm ?? '') : computeTotalKm()}
              disabled
            />
          </Grid>

          {/* Source / Destination */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Source Location"
              value={form.sourceName || ''}
              onChange={(e) => updateField('sourceName', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Destination Location"
              value={form.destinationName || ''}
              onChange={(e) => updateField('destinationName', e.target.value)}
            />
          </Grid>

          {/* Documents (simple json string) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Documents (JSON)"
              value={form.documents ? JSON.stringify(form.documents) : ''}
              onChange={(e) => {
                try {
                  const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                  updateField('documents', parsed);
                } catch {
                  // don't break - keep raw
                  updateField('documents', null);
                }
              }}
              helperText="Provide documents as JSON object (key: filename). Leave blank to keep none."
              multiline
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveClick}>Save</Button>
        </Box>
      </Box>
    </Modal>

    {/* Confirm before saving */}
    <Dialog open={confirmOpen} onClose={handleConfirmClose}>
      <DialogTitle>Confirm Update</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to update Trip Sheet #{item.id}? This will create an edit history entry.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Yes, Update'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
