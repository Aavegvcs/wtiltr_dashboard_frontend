// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import Divider from '@mui/material/Divider';
// import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import LoadingButton from '@mui/lab/LoadingButton';
// import InputAdornment from '@mui/material/InputAdornment';
// import { useSetRecoilState } from 'recoil';
// import { authState } from 'src/recoil/auth'; // adjust path if needed

// import { useRouter } from 'src/routes/hooks';

// import { Iconify } from 'src/components/iconify';
// import axiosInstance from 'src/config-global';
// import { Hash } from 'src/utils/hash';

// // ----------------------------------------------------------------------

// export function SignInView() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // const handleSignIn = useCallback(() => {
//   //   setLoading(true);
//   //   try{
//   //     const loginData = {
//   //       email: "hello@gmail.com",
//   //       password: "@demo1234",
//   //     };

//   //     const response =  axiosInstance.post("/login", loginData);
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   //   router.push('/');
//   // }, [router]);

//   // const handleSignIn = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const encryptPassword = await Hash.create(password);
//   //     const body = { email: email, password: encryptPassword };

//   //     // console.log("this is body part", body);
//   //     const api = '/login';
//   //     const response = await axiosInstance.post(api, body);
//   //     // console.log("response at loging api",response.data.data.token);

//   //     if (response.data.message === 'success') {
//   //       localStorage.setItem('token', response.data.data.token);
//   //       router.push('/');
//   //     } else {
//   //       alert(response.data.message);
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   //   setLoading(false);
//   //   router.push('/');
//   // };
//   const setAuth = useSetRecoilState(authState);
//   const handleSignIn = async () => {

//     setLoading(true);
//     try {
//         const encryptPassword = await Hash.create(password);
//         const body = { email, password: encryptPassword }; // Fixed object-shorthand

//         const api = '/loginInsuranceUser';
//         const response = await axiosInstance.post(api, body);
//       // console.log("response at loging api", response.data);

//         if (response.data.message === 'success') {
//           const { token, user } = response.data.data;
//             localStorage.setItem('token', token);
//             setAuth({
//               token,
//               user,
//               isAuthenticated: true,
//               allowedRoutes: [], // or user.allowedRoutes if your API sends it
//               permissions: user?.features?.map((f:any) => ({
//                 subject: f.subject,
//                 actions: f.actions,
//                 allowed: f.allowed,
//               })) ?? [],
//             });
//             router.push('/');
//         } else {
//             alert(response.data.message);
//         }
//     } catch (error) {
//         console.log(error);
//     }
//     setLoading(false);
//     router.push('/');
// };

//   const handleLogin = () => {
//     localStorage.setItem('token', '123456');
//     router.push('/');
//   };

//   const renderForm = (
//     <Box display="flex" flexDirection="column" alignItems="flex-end">
//       <TextField
//         fullWidth
//         name="email"
//         label="Email address"
//         defaultValue="hello@gmail.com"
//         InputLabelProps={{ shrink: true }}
//         sx={{ mb: 3 }}
//       />

//       <TextField
//         fullWidth
//         name="password"
//         label="Password"
//         defaultValue="@demo1234"
//         InputLabelProps={{ shrink: true }}
//         type={showPassword ? 'text' : 'password'}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                 <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//         sx={{ mb: 3 }}
//       />
//       <LoadingButton
//         fullWidth
//         size="large"
//         type="submit"
//         color="inherit"
//         variant="contained"
//         onClick={handleLogin}
//       >
//         Login
//       </LoadingButton>
//     </Box>
//   );

//   // return (
//   //   <>
//   //     <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
//   //       <Typography variant="h5">Log In</Typography>
//   //     </Box>

//   //     {renderForm}

//   //     {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
//   //       <Typography
//   //         variant="overline"
//   //         sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
//   //       >
//   //         OR
//   //       </Typography>
//   //     </Divider> */}

//   //     {/* <Box gap={1} display="flex" justifyContent="center">
//   //       <IconButton color="inherit">
//   //         <Iconify icon="logos:google-icon" />
//   //       </IconButton>
//   //       <IconButton color="inherit">
//   //         <Iconify icon="eva:github-fill" />
//   //       </IconButton>
//   //       <IconButton color="inherit">
//   //         <Iconify icon="ri:twitter-x-fill" />
//   //       </IconButton>
//   //     </Box> */}
//   //   </>
//   // );
//   return (
//     <Box display="flex" flexDirection="column" alignItems="center">
//       <Typography variant="h5" sx={{ mb: 3 }}>
//         Log In
//       </Typography>

//       <TextField
//         fullWidth
//         name="email"
//         label="Email address"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         sx={{ mb: 3 }}
//       />

//       <TextField
//         fullWidth
//         name="password"
//         label="Password"
//         type={showPassword ? 'text' : 'password'}
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                 <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//         sx={{ mb: 3 }}
//       />

//       <LoadingButton
//         fullWidth
//         size="large"
//         color="inherit"
//         variant="contained"
//         onClick={handleSignIn}
//         loading={loading}
//       >
//         Login
//       </LoadingButton>
//     </Box>
//   );
// }

//--------------------
import { useState } from 'react';

import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useSetRecoilState } from 'recoil';
import { authState } from 'src/recoil/auth';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import axiosInstance from 'src/config-global';
import { Hash } from 'src/utils/hash';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setAuth = useSetRecoilState(authState);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      //  const encryptPassword = await Hash.create(password);
      const body = { username: email, password: password };
      const api = '/loginInsuranceUser';
      const response = await axiosInstance.post(api, body);
      console.log('response', response.data.data);

      if (response.data.message === 'success') {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        setAuth({
          token,
          user,
          isAuthenticated: true,
          allowedRoutes: [],
          // permissions: user?.features?.map((f: any) => ({
          //   subject: f.subject,
          //   actions: f.actions,
          //   allowed: f.allowed,
          // })) ?? [],
          permissions: user.permissions,
        });
        toast.success('Login successful');
        router.push('/');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // const handleLogin = () => {
  //   // Temporary function for testing, replace with handleSignIn in production
  //   setAuth({
  //     token: '123456',
  //     user: null,
  //     isAuthenticated: true,
  //     allowedRoutes: [],
  //     permissions: [],
  //   });
  //   toast.success('Test login successful');
  //   router.push('/');
  // };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" sx={{ mb: 3 }}>
        Log In
      </Typography>

      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        placeholder="Email Address"
        focused
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        placeholder="Password"
        focused
      />

      <LoadingButton
        fullWidth
        size="large"
        // color="inherit"
        variant="contained"
        onClick={handleSignIn} // Use handleSignIn instead of handleLogin in production
        loading={loading}
        sx={{
          backgroundColor: '#0055A5',
          '&:hover': {
            backgroundColor: '#004080', // optional: darker shade on hover
          },
        }}
      >
        Login
      </LoadingButton>
    </Box>
  );
}