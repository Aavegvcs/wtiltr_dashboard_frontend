

// the follwoing code is for the new protected route this is for url protection and upper commented code is for without protected

import { lazy, Suspense } from 'react';

import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { useRecoilValue } from 'recoil';

import { authState } from 'src/recoil/auth';

import Box from '@mui/material/Box';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';

import { AuthLayout } from 'src/layouts/auth';

import { DashboardLayout } from 'src/layouts/dashboard';
// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const CompanyUserPage = lazy(() => import('src/pages/administration/company-user'));
export const InsurancePage = lazy(() => import('src/pages/insurance-company'));
export const InsuranceProductPage = lazy(() => import('src/pages/insurance-product'));

export const UserProfileViewPage = lazy(() => import('src/pages/user-profile-view'));
export const AgentDashboardPage = lazy(() => import('src/pages/agent-dashboard'));
export const RolePermissionMappingViewPage = lazy(() => import('src/pages/role-permission-mapping'));
export const PermissionViewPage = lazy(() => import('src/pages/permission-view'));
export const BranchViewPage = lazy(()=> import('src/pages/branch'));
export const CorporateViewPage = lazy(()=> import('src/pages/corporate'));
export const VehicleViewPage = lazy(()=> import('src/pages/vehicle'));
export const DriverViewPage = lazy(()=> import('src/pages/driver'));
export const CvdViewPage = lazy(()=> import('src/pages/cvd-mapping'));
export const TripSheetViewPage = lazy(()=> import('src/pages/trip-sheet'));
export const AdminSheetViewPage = lazy(()=> import('src/pages/admin-sheet'));
export function RestrictedRoute({
  children,
  permission,
}: {
  children: JSX.Element;
  permission: string;
}) {
  const auth = useRecoilValue(authState);
  if (auth?.permissions?.route?.includes('all')) {
    return children;
  }
  const routePermissions = auth?.permissions?.route || [];
  // console.log("permissions----", routePermissions, '------', permission)
  const hasPermission = routePermissions.includes(permission);
  // console.log("is there permission", hasPermission)
  
  if (!hasPermission) {
    console.warn(`Access denied. Required permission: '${permission}' not found in user's permissions:`, routePermissions);
  }
  return hasPermission ? children : <Navigate to="/404" replace />;
}

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  const auth = useRecoilValue(authState);
  // const { countdown } = useJwtAuth();

    // console.log('in section router ', auth?.user?.userType);

  const isAuthenticated = auth.isAuthenticated;
  const token = auth.token;


  return useRoutes(
    isAuthenticated && token
      ? [
          {
            element: (
              <DashboardLayout>
                <Suspense fallback={renderFallback}>
                  <Outlet />
                </Suspense>
                {/* <CountdownTimer countdown={countdown} /> */}
              </DashboardLayout>
            ),
            children: [
              // {
              //   element: (
              //     <RestrictedRoute permission="dashboard">
              //       <HomePage />
              //     </RestrictedRoute>
              //   ),
              //   index: true,
              // },

              {
                index: true,
                element: auth?.permissions?.route?.includes('all') ? (
                  <RestrictedRoute permission="all">
                    <HomePage />
                  </RestrictedRoute>
                ): auth?.user?.role.name == 'teleCaller' ?(
                   <RestrictedRoute permission="dashboard">
                    <HomePage />
                  </RestrictedRoute>
                )
                : (
                  <RestrictedRoute permission="agent-dashboard">
                    <AgentDashboardPage />
                  </RestrictedRoute>
                ),
              },

              {
                path: 'user',
                element: (
                  <RestrictedRoute permission="user">
                    <UserPage />
                  </RestrictedRoute>
                ),
              },
              {
                path: 'products',
                element: (
                  <RestrictedRoute permission="products">
                    <ProductsPage />
                  </RestrictedRoute>
                ),
              },
              {
                path: 'blog',
                element: (
                  <RestrictedRoute permission="blog">
                    <BlogPage />
                  </RestrictedRoute>
                ),
              },
              {
                path: 'company-employee',
                element: (
                  <RestrictedRoute permission="company-employee">
                    <CompanyUserPage />
                  </RestrictedRoute>
                ),
              },
              {
                path: 'insurance-company',
                element: (
                  <RestrictedRoute permission="insurance-company">
                    <InsurancePage />
                  </RestrictedRoute>
                ),
              },
              {
                path: 'insurance-product',
                element: (
                  <RestrictedRoute permission="insurance-product">
                    <InsuranceProductPage />
                  </RestrictedRoute>
                ),
              },
            
             
              {
                path: 'user-profile-view',
                element: (
                  <RestrictedRoute permission="user-profile-view">
                    <UserProfileViewPage />
                  </RestrictedRoute>
                ),
              },

              {
                path: 'role-permission-mapping',
                element: (
                  <RestrictedRoute permission="role-permission-mapping">
                    <RolePermissionMappingViewPage />
                  </RestrictedRoute>
                ),
              },
              {
                path: 'permission-view',
                element: (
                  <RestrictedRoute permission="permission-view">
                    <PermissionViewPage />
                  </RestrictedRoute>
                ),
              },

               {
                path: 'branch-view',
                element: (
                  <RestrictedRoute permission="branch-view">
                    <BranchViewPage />
                  </RestrictedRoute>
                ),
              },
               {
                path: 'corporate-view',
                element: (
                  <RestrictedRoute permission="corporate-view">
                    <CorporateViewPage />
                  </RestrictedRoute>
                ),
              },
             
              {
                path: 'vehicle-view',
                element: (
                  <RestrictedRoute permission="vehicle-view">
                    <VehicleViewPage />
                  </RestrictedRoute>
                ),
              },
              {
                path: 'driver-view',
                element: (
                  <RestrictedRoute permission="driver-view">
                    <DriverViewPage />
                  </RestrictedRoute>
                ),
              },
              {
                path: 'cvd-mapping-view',
                element: (
                  <RestrictedRoute permission="cvd-mapping-view">
                    <CvdViewPage />
                  </RestrictedRoute>
                ),
              },
              {
                path: 'trip-sheet-view',
                element: (
                  <RestrictedRoute permission="trip-sheet-view">
                    <TripSheetViewPage />
                  </RestrictedRoute>
                ),
              },
               {
                path: 'admin-sheet-view',
                element: (
                  <RestrictedRoute permission="admin-sheet-view">
                    <AdminSheetViewPage />
                  </RestrictedRoute>
                ),
              },
            ],
          },
          {
            path: '404',
            element: <Page404 />,
          },
          {
            path: '*',
            element: <Navigate to="/404" replace />,
          },
        ]
      : [
          {
            path: '/',
            element: (
              <AuthLayout>
                <SignInPage />
              </AuthLayout>
            ),
            index: true,
          },
          {
            path: '*',
            element: <Navigate to="/" replace />,
          },
        ]
  );
}
