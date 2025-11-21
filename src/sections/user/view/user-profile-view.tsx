// import { useNavigate, useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import {
//   Card,
//   Typography,
//   Avatar,
//   Box,
//   Button,
//   Modal,
//   TextField,
//   Grid,
//   IconButton,
//   InputAdornment,
//   CircularProgress,
// } from '@mui/material';
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
// import { varAlpha } from 'src/theme/styles';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import axiosInstance from 'src/config-global';
// import { useRecoilValue } from 'recoil';
// import { authState } from 'src/recoil/auth';
// import toast, { Toaster } from 'react-hot-toast';
// import { Iconify } from 'src/components/iconify';
// import AnimatedDots from 'src/utils/animation.utils';
// import { formatToCamelCase } from 'src/utils/utils';
// import { DashboardContent } from 'src/layouts/dashboard';

// const style = {
//   position: 'absolute' as const,
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   borderRadius: 3,
//   boxShadow: 24,
//   p: 4,
// };

// export default function UserProfileView() {
//   const { user } = useRecoilValue(authState);
//   const [users, setUsers] = useState<any>(null);
//   const navigate = useNavigate();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [buttonLoading, setButtonLoading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [newCredentials, setNewCredentials] = useState({
//     email: '',
//     newPassword: '',
//     confirmPassword: '',
//     otp: '',
//   });
//   const [otpSent, setOtpSent] = useState(false);
//   const [passwordError, setPasswordError] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');
//   const [emptyFieldError, setEmptyFieldError] = useState('');
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const body = { userId: user?.id };
//         const res = await axiosInstance.post('users/getUserById', body);
//         const allUsers = res.data.data;
//         const found = allUsers.find((u: any) => u.user_id === user?.id);
//         console.log('user details is here', allUsers);
//         if (found) {
//           setUsers({
//             ...found,
//             name: `${found.firstName} ${found.lastName}`,
//           });
//         }
//       } catch (error) {
//         toast.error('Error fetching user data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [user?.id]);

//   const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setNewCredentials((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (name === 'newPassword' || name === 'confirmPassword') {
//       setEmptyFieldError('');
//       setConfirmPasswordError('');

//       if (!newCredentials.newPassword && !value && name === 'confirmPassword') {
//         setEmptyFieldError('Fields cannot be empty');
//         return;
//       }
//       if (!value && name === 'newPassword' && !newCredentials.confirmPassword) {
//         setEmptyFieldError('Fields cannot be empty');
//         return;
//       }

//       if (name === 'confirmPassword' && value !== newCredentials.newPassword) {
//         setConfirmPasswordError('Passwords do not match');
//       }
//     }
//   };

//   const handleOpenModal = () => {
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setNewCredentials({ email: '', newPassword: '', confirmPassword: '', otp: '' });
//     setOtpSent(false);
//     setEmptyFieldError('');
//     setConfirmPasswordError('');
//     setButtonLoading(false);
//   };

//   // Function to send OTP
//   const sendOtp = async (email: string) => {
//     try {
//       setButtonLoading(true);
//       const response = await axiosInstance.post('/otpForResetPassword', { email });
//       const { status, message } = response.data.data;

//       if (status === 'success') {
//         setOtpSent(true);
//         toast.success(message || 'OTP sent successfully');
//         return true;
//       } else {
//         toast.error(message || 'Failed to send OTP');
//         return false;
//       }
//     } catch (error) {
//       toast.error('Error sending OTP');
//       return false;
//     } finally {
//       setButtonLoading(false);
//     }
//   };

//   // Function to change password
//   const changePassword = async (email: string, newPassword: string, otp: string) => {
//     try {
//       setButtonLoading(true);
//       const payload = { email, newPassword, otp };
//       const response = await axiosInstance.post('/changePassword', payload);
//       const { status, message } = response.data.data;

//       if (status === 'success') {
//         handleCloseModal();
//         navigate(0);
//         toast.success(message || 'Password changed successfully');
//         return true;
//       } else {
//         toast.error(message || 'Failed to change password');
//         return false;
//       }
//     } catch (error) {
//       toast.error('Error changing password');
//       return false;
//     } finally {
//       setButtonLoading(false);
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (!newCredentials.newPassword || !newCredentials.confirmPassword) {
//       setEmptyFieldError('Fields cannot be empty');
//       return;
//     }
//     if (newCredentials.newPassword !== newCredentials.confirmPassword) {
//       setConfirmPasswordError('Passwords do not match');
//       return;
//     }

//     if (!otpSent) {
//       await sendOtp(users.email);
//     } else {
//       await changePassword(users.email, newCredentials.newPassword, newCredentials.otp);
//     }
//   };

//   const handleToggleNewPasswordVisibility = () => {
//     setShowNewPassword((prev) => !prev);
//   };

//   const handleToggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword((prev) => !prev);
//   };

//   if (!users)
//     return (
//       <DashboardContent>
//         <Typography>User Not Found</Typography>
//       </DashboardContent>
//     );
//   if (loading) {
//     return (
//       <DashboardContent>
//         <LinearProgress
//           sx={{
//             width: 1,
//             maxWidth: 320,
//             bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
//             [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
//             align: 'center',
//             mx: 'auto',
//           }}
//         />
//       </DashboardContent>
//     );
//   }

//   return (
//     <>
//       <div>
//         <Toaster />
//       </div>

//       <Box p={3}>
//         <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item>
//               <Avatar src={users.avatarUrl} sx={{ width: 40, height: 40 }} />
//             </Grid>
//             <Grid item>
//               <Typography variant="h5" fontWeight="bold">
//                 {users.name}
//               </Typography>
//               <Typography color="text.secondary">{users.designation}</Typography>
//             </Grid>
//           </Grid>

//           <Grid container spacing={2} mt={2}>
//             <Grid item xs={6}>
//               <Typography>Email: {users.email}</Typography>
//               <Typography>Phone: {users.phoneNumber}</Typography>
//               <Typography>DOB: {users.dateOfBirth}</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography>Company: {users.companyName}</Typography>
//               <Typography>Department: {users.departmentName}</Typography>
//               <Typography>Role: {formatToCamelCase(users.roleName)}</Typography>
//             </Grid>
//           </Grid>
//           <Box mt={3} display="flex" justifyContent="flex-end">
//             <Button
//               variant="contained"
//               onClick={() => handleOpenModal()}
//               sx={{
//                 textTransform: 'none',
//                 fontWeight: 'bold',
//                 px: 2,
//                 mr: { md: 3, xs: 0 },
//                 backgroundColor: '#0055A5',
//                 '&:hover': {
//                   backgroundColor: '#004080', // optional: darker shade on hover
//                 },
//               }}
//             >
//               Change Password
//             </Button>
//           </Box>
//         </Card>

//         <Modal open={modalOpen}>
//           <Box sx={style}>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               {buttonLoading && (
//                 <Typography variant="h6" flexGrow={1}>
//                   Please wait
//                   <AnimatedDots />
//                 </Typography>
//               )}
//             </div>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//               <Typography variant="h6" mb={2} fontWeight="bold">
//                 Change Password
//               </Typography>
//               <Button
//                 variant="text"
//                 color="inherit"
//                 onClick={handleCloseModal}
//                 sx={{ minWidth: 'auto', p: 0 }}
//               >
//                 <Iconify icon="eva:close-fill" width={30} height={30} />
//               </Button>
//             </Box>
//             {!otpSent && (
//               <>
//                 <TextField
//                   label="New Password"
//                   fullWidth
//                   margin="normal"
//                   type={showNewPassword ? 'text' : 'password'}
//                   name="newPassword"
//                   value={newCredentials.newPassword}
//                   onChange={handleTextChange}
//                   error={!!emptyFieldError}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton onClick={handleToggleNewPasswordVisibility} edge="end">
//                           {showNewPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//                 <TextField
//                   label="Confirm Password"
//                   fullWidth
//                   margin="normal"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={newCredentials.confirmPassword}
//                   onChange={handleTextChange}
//                   error={!!confirmPasswordError || !!emptyFieldError}
//                   helperText={confirmPasswordError}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
//                           {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//                 {emptyFieldError && (
//                   <Typography color="error" variant="caption">
//                     {emptyFieldError}
//                   </Typography>
//                 )}
//               </>
//             )}
//             {otpSent && (
//               <>
//                 <TextField
//                   label="Enter Otp"
//                   fullWidth
//                   margin="normal"
//                   name="otp"
//                   value={newCredentials.otp}
//                   onChange={handleTextChange}
//                 />
//               </>
//             )}
//             <Box mt={2} display="flex" justifyContent="flex-end">
//               <Button
//                 variant="contained"
//                 onClick={handlePasswordChange}
//                 disabled={buttonLoading}
//                 sx={{
//                   textTransform: 'none',
//                   fontWeight: 'bold',
//                   px: 2,
//                   // mr: { md: 3, xs: 0 },
//                   ml: { md: 5, xs: 2 },
//                   backgroundColor: '#0055A5',
//                   '&:hover': {
//                     backgroundColor: '#004080', // optional: darker shade on hover
//                   },
//                 }}
//               >
//                 {buttonLoading ? (
//                   <CircularProgress size={22} color="inherit" />
//                 ) : otpSent ? (
//                   'Submit'
//                 ) : (
//                   'Send OTP'
//                 )}
//               </Button>
//             </Box>
//           </Box>
//         </Modal>
//       </Box>
//     </>
//   );
// }

// --------------

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Avatar,
  Box,
  Button,
  Modal,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade,
  Divider,
} from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import { Visibility, VisibilityOff, EventAvailable } from '@mui/icons-material';
import axiosInstance from 'src/config-global';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/recoil/auth';
import toast, { Toaster } from 'react-hot-toast';
import { Iconify } from 'src/components/iconify';
import AnimatedDots from 'src/utils/animation.utils';
import { formatToCamelCase } from 'src/utils/utils';
import { DashboardContent } from 'src/layouts/dashboard';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
};

export default function UserProfileView() {
  const { user } = useRecoilValue(authState);
  const [users, setUsers] = useState<any>(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCredentials, setNewCredentials] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emptyFieldError, setEmptyFieldError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const body = { userId: user?.id };
        const res = await axiosInstance.post('users/getUserById', body);
        const allUsers = res.data.data;
        const found = allUsers.find((u: any) => u.user_id === user?.id);
        if (found) {
          setUsers({
            ...found,
            name: `${found.firstName} ${found.lastName}`,
          });
        }
      } catch (error) {
        toast.error('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user?.id]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'newPassword' || name === 'confirmPassword') {
      setEmptyFieldError('');
      setConfirmPasswordError('');

      if (!newCredentials.newPassword && !value && name === 'confirmPassword') {
        setEmptyFieldError('Fields cannot be empty');
        return;
      }
      if (!value && name === 'newPassword' && !newCredentials.confirmPassword) {
        setEmptyFieldError('Fields cannot be empty');
        return;
      }

      if (name === 'confirmPassword' && value !== newCredentials.newPassword) {
        setConfirmPasswordError('Passwords do not match');
      }
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setNewCredentials({ email: '', newPassword: '', confirmPassword: '', otp: '' });
    setOtpSent(false);
    setEmptyFieldError('');
    setConfirmPasswordError('');
    setButtonLoading(false);
  };

  const sendOtp = async (email: string) => {
    try {
      setButtonLoading(true);
      const response = await axiosInstance.post('/otpForResetPassword', { email });
      const { status, message } = response.data.data;

      if (status === 'success') {
        setOtpSent(true);
        toast.success(message || 'OTP sent successfully');
        return true;
      } else {
        toast.error(message || 'Failed to send OTP');
        return false;
      }
    } catch (error) {
      toast.error('Error sending OTP');
      return false;
    } finally {
      setButtonLoading(false);
    }
  };

  const changePassword = async (email: string, newPassword: string, otp: string) => {
    try {
      setButtonLoading(true);
      const payload = { email, newPassword, otp };
      const response = await axiosInstance.post('/changePassword', payload);
      const { status, message } = response.data.data;

      if (status === 'success') {
        handleCloseModal();
        navigate(0);
        toast.success(message || 'Password changed successfully');
        return true;
      } else {
        toast.error(message || 'Failed to change password');
        return false;
      }
    } catch (error) {
      toast.error('Error changing password');
      return false;
    } finally {
      setButtonLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newCredentials.newPassword || !newCredentials.confirmPassword) {
      setEmptyFieldError('Fields cannot be empty');
      return;
    }
    if (newCredentials.newPassword !== newCredentials.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    if (!otpSent) {
      await sendOtp(users.email);
    } else {
      await changePassword(users.email, newCredentials.newPassword, newCredentials.otp);
    }
  };

  if (!users)
    return (
      <DashboardContent>
        <Typography>User Not Found</Typography>
      </DashboardContent>
    );

  if (loading) {
    return (
      <DashboardContent>
        <Fade in={loading}>
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
        </Fade>
      </DashboardContent>
    );
  }

  return (
    <Box p={3}>
      <Toaster />

      <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={users.avatarUrl} sx={{ width: 50, height: 50 }} />
          </Grid>
          <Grid item>
            <Typography variant="h5" fontWeight="bold">
              {users.name}
            </Typography>
            <Typography color="text.secondary">{users.designation}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 500 }}>Email: </span>
              {users.email}
            </Typography>

            <Typography sx={{ fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 500 }}>Phone: </span>
              {users.phoneNumber}
            </Typography>

            <Typography sx={{ fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 500 }}>DOB: </span>
              {users.dateOfBirth}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 500 }}>Company: </span>
              {users.companyName}
            </Typography>

            <Typography sx={{ fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 500 }}>Department: </span>
              {users.departmentName}
            </Typography>

            <Typography sx={{ fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 500 }}>Role: </span>
              {formatToCamelCase(users.roleName)}
            </Typography>
          </Grid>
        </Grid>

        {/* <Box mt={2} className="flex items-center gap-2">
          <EventAvailable fontSize="small" /> Due: 10-09-2025
        </Box> */}

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleOpenModal}>
            Change Password
          </Button>
        </Box>
      </Card>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Fade in={modalOpen}>
          <Card sx={modalStyle}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              Change Password
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {!otpSent ? (
              <>
                <TextField
                  label="New Password"
                  fullWidth
                  margin="normal"
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={newCredentials.newPassword}
                  onChange={handleTextChange}
                  error={!!emptyFieldError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm Password"
                  fullWidth
                  margin="normal"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={newCredentials.confirmPassword}
                  onChange={handleTextChange}
                  error={!!confirmPasswordError || !!emptyFieldError}
                  helperText={confirmPasswordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {emptyFieldError && (
                  <Typography color="error" variant="caption">
                    {emptyFieldError}
                  </Typography>
                )}
              </>
            ) : (
              <TextField
                label="Enter OTP"
                fullWidth
                margin="normal"
                name="otp"
                value={newCredentials.otp}
                onChange={handleTextChange}
              />
            )}

            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handlePasswordChange} disabled={buttonLoading}>
                {buttonLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : otpSent ? (
                  'Submit'
                ) : (
                  'Send OTP'
                )}
              </Button>
            </Box>
          </Card>
        </Fade>
      </Modal>
    </Box>
  );
}
