// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import { Scrollbar } from 'src/components/scrollbar';
// import Stack from '@mui/material/Stack';

// const modalStyle = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: '95%', md: 950 },
//   maxHeight: '90vh',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 3,
//   borderRadius: 2,
//   overflow: 'auto',     // ✅ FIXED
// };

// export default function TripSheetViewModal({ open, onClose, item }: any) {
//   if (!item) return null;

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" mb={2}>
//           Trip Sheet #{item.id}
//         </Typography>

//         <Divider sx={{ mb: 2 }} />

//         <Scrollbar>
//           <Box sx={{ pr: 2 }}>

//             {/* ====================== GENERAL INFO ====================== */}
//             <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
//               General Information
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Corporate</Typography>
//                 <Typography>{item.corporate?.corporateName || '-'}</Typography>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Branch</Typography>
//                 <Typography>{item.branch?.name || item.branch?.branchName || '-'}</Typography>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Driver</Typography>
//                 <Typography>{item.driver?.name} ({item.driver?.mobileNumber})</Typography>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Vehicle</Typography>
//                 <Typography>
//                   {item.vehicle?.vehicleNumber}{' '}
//                   {item.vehicle?.vehicleName ? `(${item.vehicle.vehicleName})` : ''}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <Typography variant="subtitle2">Trip Date</Typography>
//                 <Typography>{item.tripDate ? new Date(item.tripDate).toLocaleString() : '-'}</Typography>
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <Typography variant="subtitle2">Start Time</Typography>
//                 <Typography>{item.startTime || '-'}</Typography>
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <Typography variant="subtitle2">End Time</Typography>
//                 <Typography>{item.endTime || '-'}</Typography>
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 3 }} />

//             {/* ====================== ODOMETER ====================== */}
//             <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
//               Odometer Details
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={4}>
//                 <Typography variant="subtitle2">Start KM</Typography>
//                 <Typography>{item.startOdometer ?? '-'}</Typography>
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <Typography variant="subtitle2">End KM</Typography>
//                 <Typography>{item.endOdometer ?? '-'}</Typography>
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <Typography variant="subtitle2">Total KM</Typography>
//                 <Typography>{item.totalKm ?? '-'}</Typography>
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 3 }} />

//             {/* ====================== LOCATION ====================== */}
//             <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
//               Location Details
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Source</Typography>
//                 <Typography>{item.sourceName ?? '-'}</Typography>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Destination</Typography>
//                 <Typography>{item.destinationName ?? '-'}</Typography>
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 3 }} />

//             {/* ====================== SIGNATURES ====================== */}
//             <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
//               Signatures
//             </Typography>

//             <Grid container spacing={3}>
//               {/* DRIVER SIGN */}
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Driver Sign</Typography>
//                 {item.driverSign ? (
//                   <img
//                     src={item.driverSign}
//                     alt="Driver Sign"
//                     style={{
//                       width: '100%',
//                       maxWidth: 250,
//                       borderRadius: 8,
//                       marginTop: 8,
//                       border: '1px solid #ddd',
//                     }}
//                   />
//                 ) : (
//                   <Typography>-</Typography>
//                 )}

//                 <Typography variant="caption" display="block" sx={{ mt: 1 }}>
//                   Lat: {item.driverSignLat ?? '-'}
//                 </Typography>
//                 <Typography variant="caption" display="block">
//                   Lng: {item.driverSignLng ?? '-'}
//                 </Typography>
//               </Grid>

//               {/* USER SIGN */}
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">User Sign</Typography>
//                 {item.userSign ? (
//                   <img
//                     src={item.userSign}
//                     alt="User Sign"
//                     style={{
//                       width: '100%',
//                       maxWidth: 250,
//                       borderRadius: 8,
//                       marginTop: 8,
//                       border: '1px solid #ddd',
//                     }}
//                   />
//                 ) : (
//                   <Typography>-</Typography>
//                 )}

//                 <Typography variant="caption" display="block" sx={{ mt: 1 }}>
//                   Lat: {item.userSignLat ?? '-'}
//                 </Typography>
//                 <Typography variant="caption" display="block">
//                   Lng: {item.userSignLng ?? '-'}
//                 </Typography>
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 3 }} />

//             {/* ====================== DOCUMENTS ====================== */}
//             {/* <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
//               Documents
//             </Typography> */}

//             {/* {item.documents ? (
//               <Stack spacing={1}>
//                 {Object.entries(item.documents).map(([key, val]: any) => (
//                   <a
//                     key={key}
//                     href={val}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{ textDecoration: 'none', color: '#1976d2' }}
//                   >
//                     {key}
//                   </a>
//                 ))}
//               </Stack>
//             ) : (
//               <Typography>-</Typography>
//             )} */}

//             <Divider sx={{ my: 3 }} />

//             {/* ====================== EDIT HISTORY ====================== */}
//             {item.edits && item.edits.length > 0 && (
//               <>
//                 <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
//                   Edit History ({item.edits.length})
//                 </Typography>

//                 <Stack spacing={1}>
//                   {item.edits.map((h: any, idx: number) => (
//                     <Box
//                       key={idx}
//                       sx={{
//                         p: 2,
//                         borderRadius: 1,
//                         border: '1px solid',
//                         borderColor: 'divider',
//                         bgcolor: 'background.default',
//                       }}
//                     >
//                       <Typography variant="body2">
//                         Edited by: {h.changedBy?.firstName || 'Unknown'}
//                       </Typography>
//                       <Typography variant="caption">
//                         {new Date(h.changedAt).toLocaleString()}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Stack>
//               </>
//             )}
//           </Box>
//         </Scrollbar>

//         <Box mt={3} display="flex" justifyContent="flex-end">
//           <Button onClick={onClose} variant="outlined">
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import { Scrollbar } from 'src/components/scrollbar';
// import { alpha } from '@mui/material/styles';

// const modalStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: '95%', md: 780 },
//   maxHeight: '90vh',
//   bgcolor: 'background.paper',
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 2,
//   overflow: 'auto',
// };

// // 🔹 Reusable Compact Row Component
// function DetailGrid({ data }: any) {
//   return (
//     <Grid container spacing={1.2} sx={{ mb: 1 }}>
//       {data.map((item: any, i: number) => (
//         <Grid item xs={6} key={i}>
//           <Typography variant="caption" sx={{ opacity: 0.7 }}>
//             {item.label}
//           </Typography>
//           <Typography variant="body2" sx={{ fontWeight: 500 }}>
//             {item.value || '-'}
//           </Typography>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }

// // 🔹 Reusable Card Section
// function Section({ title, children }: any) {
//   return (
//     <Box
//       sx={{
//         p: 1.5,
//         mb: 1.5,
//         borderRadius: 1.5,
//         bgcolor: (t) => alpha(t.palette.grey[100], 0.5),
//       }}
//     >
//       <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
//         {title}
//       </Typography>
//       {children}
//     </Box>
//   );
// }

// export default function TripSheetViewModal({ open, onClose, item }: any) {
//   if (!item) return null;

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         {/* Header */}
//         <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
//           Trip Sheet #{item.id}
//         </Typography>

//         <Scrollbar>
//           <Box sx={{ pr: 1 }}>
//             {/* GENERAL INFO */}
//             <Section title="General Information">
//               <DetailGrid
//                 data={[
//                   { label: 'Corporate', value: item.corporate?.corporateName },
//                   { label: 'Branch', value: item.branch?.name || item.branch?.branchName },
//                   {
//                     label: 'Driver',
//                     value: item.driver ? `${item.driver.name} (${item.driver.mobileNumber})` : '-',
//                   },
//                   {
//                     label: 'Vehicle',
//                     value: item.vehicle
//                       ? `${item.vehicle.vehicleNumber} ${
//                           item.vehicle.vehicleName ? `(${item.vehicle.vehicleName})` : ''
//                         }`
//                       : '-',
//                   },
//                   {
//                     label: 'Trip Date',
//                     value: item.tripDate ? new Date(item.tripDate).toLocaleString() : '-',
//                   },
//                   { label: 'Start Time', value: item.startTime },
//                   { label: 'End Time', value: item.endTime },
//                 ]}
//               />
//             </Section>

//             {/* ODOMETER */}
//             <Section title="Odometer Details">
//               <DetailGrid
//                 data={[
//                   { label: 'Start KM', value: item.startOdometer },
//                   { label: 'End KM', value: item.endOdometer },
//                   { label: 'Total KM', value: item.totalKm },
//                 ]}
//               />
//             </Section>

//             {/* LOCATION */}
//             <Section title="Location Details">
//               <DetailGrid
//                 data={[
//                   { label: 'Source', value: item.sourceName },
//                   { label: 'Destination', value: item.destinationName },
//                 ]}
//               />
//             </Section>

//             {/* SIGNATURES */}
//             {/* ========================= SIGNATURES ========================= */}
//             <Section title="Signatures">
//               <Grid container spacing={2}>
//                 {/* DRIVER SIGN */}
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                     Driver Sign
//                   </Typography>

//                   {item.driverSign ? (
//                     <img
//                       src={item.driverSign}
//                       alt="Driver Sign"
//                       style={{
//                         width: 200,
//                         height: 120,
//                         objectFit: 'contain',
//                         borderRadius: 6,
//                         border: '1px solid #ddd',
//                         marginTop: 6,
//                         background: '#fff',
//                         padding: 4,
//                       }}
//                     />
//                   ) : (
//                     <Typography variant="body2">-</Typography>
//                   )}

//                   <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
//                     Lat: {item.driverSignLat ?? '-'}
//                   </Typography>
//                   <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
//                     Lng: {item.driverSignLng ?? '-'}
//                   </Typography>
//                 </Grid>

//                 {/* USER SIGN */}
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                     User Sign
//                   </Typography>

//                   {item.userSign ? (
//                     <img
//                       src={item.userSign}
//                       alt="User Sign"
//                       style={{
//                         width: 200,
//                         height: 120,
//                         objectFit: 'contain',
//                         borderRadius: 6,
//                         border: '1px solid #ddd',
//                         marginTop: 6,
//                         background: '#fff',
//                         padding: 4,
//                       }}
//                     />
//                   ) : (
//                     <Typography variant="body2">-</Typography>
//                   )}

//                   <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
//                     Lat: {item.userSignLat ?? '-'}
//                   </Typography>
//                   <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
//                     Lng: {item.userSignLng ?? '-'}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Section>

//             {/* EDIT HISTORY */}
//             {item.edits?.length > 0 && (
//               <Section title={`Edit History (${item.edits.length})`}>
//                 <Stack spacing={1}>
//                   {item.edits.map((h: any, idx: number) => (
//                     <Box
//                       key={idx}
//                       sx={{
//                         p: 1.2,
//                         borderRadius: 1,
//                         bgcolor: (t) => alpha(t.palette.grey[200], 0.4),
//                       }}
//                     >
//                       <Typography variant="body2" fontWeight={600}>
//                         {h.changedBy?.firstName || 'Unknown'}
//                       </Typography>
//                       <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                         {new Date(h.changedAt).toLocaleString()}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Stack>
//               </Section>
//             )}
//           </Box>
//         </Scrollbar>

//         {/* Footer */}
//         <Box mt={2} display="flex" justifyContent="flex-end">
//           <Button onClick={onClose} variant="contained">
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Scrollbar } from 'src/components/scrollbar';
import { alpha } from '@mui/material/styles';

// --------------------------------------------------
// 🔹 Safe Date Formatter (Fix Invalid Date)
// --------------------------------------------------
function formatDate(date: any) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

// --------------------------------------------------
// 🔹 Get Only Changed Fields
// --------------------------------------------------
function getChangedFields(oldValues: any, newValues: any) {
  if (!oldValues || !newValues) return [];

  const changes: any[] = [];
  for (const key of Object.keys(newValues)) {
    if (oldValues[key] !== newValues[key]) {
      changes.push({
        field: key,
        oldValue: oldValues[key],
        newValue: newValues[key],
      });
    }
  }
  return changes;
}

// --------------------------------------------------
// 🔹 Compact Detail Grid (2-column display)
// --------------------------------------------------
function DetailGrid({ data }: any) {
  return (
    <Grid container spacing={1.2} sx={{ mb: 1 }}>
      {data.map((item: any, i: number) => (
        <Grid item xs={6} key={i}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {item.label}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {item.value || '-'}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}

// --------------------------------------------------
// 🔹 Section Wrapper
// --------------------------------------------------
function Section({ title, children }: any) {
  return (
    <Box
      sx={{
        p: 1.5,
        mb: 1.5,
        borderRadius: 1.5,
        bgcolor: (t) => alpha(t.palette.grey[100], 0.5),
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

// --------------------------------------------------
// 🔹 MAIN COMPONENT
// --------------------------------------------------
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', md: 780 },
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
  overflow: 'auto',
};

export default function TripSheetViewModal({ open, onClose, item }: any) {
  if (!item) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={1}>
          Trip Sheet #{item.id}
        </Typography>

        <Scrollbar>
          <Box pr={1}>
            {/* GENERAL INFO */}
            <Section title="General Information">
              <DetailGrid
                data={[
                  { label: 'Corporate', value: item.corporate?.corporateName },
                  { label: 'Branch', value: item.branch?.name || item.branch?.branchName },
                  {
                    label: 'Driver',
                    value: item.driver ? `${item.driver.name} (${item.driver.mobileNumber})` : '-',
                  },
                  {
                    label: 'Vehicle',
                    value: item.vehicle
                      ? `${item.vehicle.vehicleNumber} ${item.vehicle.vehicleName ? `(${item.vehicle.vehicleName})` : ''}`
                      : '-',
                  },
                  { label: 'Trip Date', value: formatDate(item.tripDate) },
                  { label: 'Start Time', value: item.startTime },
                  { label: 'End Time', value: item.endTime },
                ]}
              />
            </Section>

            {/* ODOMETER */}
            <Section title="Odometer Details">
              <DetailGrid
                data={[
                  { label: 'Start KM', value: item.startOdometer },
                  { label: 'End KM', value: item.endOdometer },
                  { label: 'Total KM', value: item.totalKm },
                ]}
              />
            </Section>

            {/* LOCATION */}
            <Section title="Location Details">
              <DetailGrid
                data={[
                  { label: 'Source', value: item.sourceName },
                  { label: 'Destination', value: item.destinationName },
                ]}
              />
            </Section>

            {/* SIGNATURES */}
            <Section title="Signatures">
              <Grid container spacing={2}>
                {/* Driver Sign */}
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Driver Sign
                  </Typography>

                  {item.driverSign ? (
                    <img
                      src={item.driverSign}
                      alt="Driver Sign"
                      style={{
                        width: 200,
                        height: 120,
                        objectFit: 'contain',
                        background: '#fff',
                        padding: 4,
                        borderRadius: 6,
                        marginTop: 6,
                        border: '1px solid #ddd',
                      }}
                    />
                  ) : (
                    <Typography>-</Typography>
                  )}

                  <Typography variant="caption">Lat: {item.driverSignLat ?? '-'}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Lng: {item.driverSignLng ?? '-'}
                  </Typography>
                </Grid>

                {/* User Sign */}
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    User Sign
                  </Typography>

                  {item.userSign ? (
                    <img
                      src={item.userSign}
                      alt="User Sign"
                      style={{
                        width: 200,
                        height: 120,
                        objectFit: 'contain',
                        background: '#fff',
                        padding: 4,
                        borderRadius: 6,
                        marginTop: 6,
                        border: '1px solid #ddd',
                      }}
                    />
                  ) : (
                    <Typography>-</Typography>
                  )}

                  <Typography variant="caption">Lat: {item.userSignLat ?? '-'}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Lng: {item.userSignLng ?? '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Section>

            {/* HISTORY */}
           {item.edits?.length > 0 && (
  <Section title={`Edit History (${item.edits.length})`}>
    <Stack spacing={1.5}>
      {item.edits.map((h: any, idx: number) => {
        const changes = getChangedFields(h.oldValues, h.newValues);

        return (
          <Box
            key={idx}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          >
            {/* User Name */}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              {h.changedBy?.firstName || "Unknown User"}
            </Typography>

            {/* Changed Fields */}
            {changes.length > 0 ? (
              <Stack spacing={0.6} sx={{ mb: 1 }}>
                {changes.map((c, i) => (
                  <Typography key={i} variant="body2" sx={{ fontSize: "13px" }}>
                    <strong>{c.field}</strong>: {c.oldValue ?? "-"} →{" "}
                    <strong>{c.newValue ?? "-"}</strong>
                  </Typography>
                ))}
              </Stack>
            ) : (
              <Typography variant="caption" sx={{ opacity: 0.7, mb: 1 }}>
                No changes recorded.
              </Typography>
            )}

            {/* Updated At (Bottom) */}
            {/* <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Updated At: {formatDate(h.changed_at)}
            </Typography> */}
          </Box>
        );
      })}
    </Stack>
  </Section>
)}

          </Box>
        </Scrollbar>

        <Box mt={2} textAlign="right">
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
