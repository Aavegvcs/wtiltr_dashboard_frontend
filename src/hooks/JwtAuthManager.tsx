import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import toast, { Toaster } from 'react-hot-toast';
import { authState } from 'src/recoil/auth'; // Your authState import
import { Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

//------------------------------------------------------------------------------------------------------

// interface DecodedToken {
//   exp: number;
//   [key: string]: any;
// }

// export const useJwtAuth = () => {
//   const [auth, setAuth] = useRecoilState(authState);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [countdown, setCountdown] = useState<number | null>(null);

//   // Function to verify token
//   const verifyToken = (token: string | null): boolean => {
//     if (!token) {
//     //   handleLogout();
//       return false;
//     }

//     try {
//       const decoded: DecodedToken = jwtDecode(token);
//       const currentTime = Math.floor(Date.now() / 1000);

//       // Check if token is expired
//       if (decoded.exp < currentTime) {
//         // handleLogout();
//     toast.error('Session is expired. Please login again.');
//         return false;
//       }

//       // Check if token is within 2 minutes of expiry
//       const twoMinutesInSeconds = 1 * 60;
//       if (decoded.exp - currentTime <= twoMinutesInSeconds) {
//         setCountdown(decoded.exp - currentTime);
//       } else {
//         setCountdown(null);
//       }

//       return true;
//     } catch (error) {
//       console.error('Token verification failed:', error);
//       handleLogout();
//       return false;
//     }
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('refreshToken');
//     setAuth({
//       token: null,
//       user: null,
//       isAuthenticated: false,
//       allowedRoutes: [],
//       permissions: null,
//     });
//     localStorage.removeItem('authState');
//     toast.error('Session is expired. Please login again.', {
//       position: 'top-right',
//       duration: 5000, // Use duration for react-toastify
//     });
//     navigate('/', { replace: true }); // Redirect to sign-in page
//   };

//   // Verify token on route change or initial render
//   useEffect(() => {
//     if (auth.isAuthenticated && auth.token) {
//       verifyToken(auth.token);
//     } else {
//     //   handleLogout();
//         toast.error('Internal server error.');
//       console.error('Internal server error in jwtAuthManager.tsx');
//     }
//   }, [location.pathname, auth.token, auth.isAuthenticated]);

//   // Periodic token check to trigger countdown automatically
//   useEffect(() => {
//     if (!auth.isAuthenticated || !auth.token) return;

//     const interval = setInterval(() => {
//       verifyToken(auth.token);
//     }, 10000); // Check every 10 seconds

//     return () => clearInterval(interval);
//   }, [auth.token, auth.isAuthenticated]);

//   // Countdown timer effect
//   useEffect(() => {
//     let timer: NodeJS.Timeout | null = null;

//     if (countdown !== null && countdown > 0) {
//       timer = setInterval(() => {
//         setCountdown((prev) => {
//           if (prev === null || prev <= 1) {
//             if (timer) clearInterval(timer);
//             handleLogout();
//             return null;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       if (timer) clearInterval(timer);
//     };
//   }, [countdown]);

//   return { countdown };
// };

// // Countdown display component
// export const CountdownTimer: React.FC<{ countdown: number | null }> = ({ countdown }) => {
//   if (countdown === null || countdown <= 0) return null;

//   const minutes = Math.floor(countdown / 60);
//   const seconds = countdown % 60;

//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         bottom: 16,
//         right: 16,
//         bgcolor: 'error.main',
//         color: 'common.white',
//         p: 2,
//         borderRadius: 1,
//         boxShadow: 3,
//         zIndex: 9999,
//       }}
//     >
//       Session expires in {minutes}:{seconds.toString().padStart(2, '0')}
//     </Box>
//   );
// };

// ------------------------------------------------------------------------------------------------------

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const useJwtAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState<number | null>(null);

  // Function to verify token
  const verifyToken = (token: string | null): boolean => {
    if (!token) {
      //   handleLogout();
      return false;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token is expired
      if (decoded.exp < currentTime) {
        // handleLogout();
        toast.error('Session is expired. Please login again.');
        return false;
      }

      // Check if token is within 2 minutes of expiry
      const twoMinutesInSeconds = 1 * 60;
      if (decoded.exp - currentTime <= twoMinutesInSeconds) {
        setCountdown(decoded.exp - currentTime);
      } else {
        setCountdown(null);
      }

      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  // Verify token on route change or initial render
  useEffect(() => {
    if (auth.isAuthenticated && auth.token) {
      verifyToken(auth.token);
    } else {
      //   handleLogout();
      toast.error('Internal server error.');
      console.error('Internal server error in jwtAuthManager.tsx');
    }
  }, [location.pathname, auth.token, auth.isAuthenticated]);
};

// Countdown display component
// export const CountdownTimer: React.FC<{ countdown: number | null }> = ({ countdown }) => {
//   if (countdown === null || countdown <= 0) return null;

//   const minutes = Math.floor(countdown / 60);
//   const seconds = countdown % 60;

//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         bottom: 16,
//         right: 16,
//         bgcolor: 'error.main',
//         color: 'common.white',
//         p: 2,
//         borderRadius: 1,
//         boxShadow: 3,
//         zIndex: 9999,
//       }}
//     >
//       Session expires in {minutes}:{seconds.toString().padStart(2, '0')}
//     </Box>
//   );
// };
