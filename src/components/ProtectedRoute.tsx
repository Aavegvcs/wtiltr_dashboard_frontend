// import { Navigate, useLocation } from 'react-router-dom';
// import { useRecoilValue } from 'recoil';
// import { authState } from 'src/recoil/auth';
// import { NavItem, useNavData } from 'src/layouts/config-nav-dashboard';
// // import { NavItem, navData } from 'src/layouts/useNavData';


// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { isAuthenticated, allowedRoutes, permissions } = useRecoilValue(authState);
//   const navData = useNavData();
//   const location = useLocation();

//   const currentPath = location.pathname;

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }
//   // Map allowedRoutes to full paths by matching titles
//   const allowedPaths = navData
//     .flatMap((item: NavItem) => {
//       const matchesTitle = allowedRoutes.some((route) =>
//         route.toLowerCase() === item.title.toLowerCase()
//       );
//       const childMatches = item.children?.filter((child: NavItem) =>
//         allowedRoutes.some((route) => route.toLowerCase() === child.title.toLowerCase())
//       ) || [];
//       return matchesTitle ? [item.path] : childMatches.map((child: NavItem) => child.path);
//     })
//     .filter((path:any): path is string => !!path);

//   // Normalize current path and check if allowed
//   const normalizedPath = currentPath === '/' ? '/' : currentPath;
//   const isAllowed = allowedPaths.includes(normalizedPath);

//   return isAllowed ? <>{children}</> : <Navigate to="/404" replace />;
// }


//-----------
import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/recoil/auth';
import { NavItem, useNavData } from 'src/layouts/config-nav-dashboard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, allowedRoutes, permissions } = useRecoilValue(authState);
  const navData = useNavData();
  const location = useLocation();

  const currentPath = location.pathname;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If permissions.route includes 'all', allow all routes
  if (permissions?.route?.includes('all')) {
    return <>{children}</>;
  }

  // Map allowedRoutes to full paths based on permission
  const allowedPaths = navData
    .flatMap((item: NavItem) => {
      const matchesPermission = item.permission && allowedRoutes.includes(item.permission);
      const childMatches = item.children?.filter((child: NavItem) =>
        child.permission && allowedRoutes.includes(child.permission)
      ) || [];
      return matchesPermission ? [item.path] : childMatches.map((child: NavItem) => child.path);
    })
    .filter((path: any): path is string => !!path);

  // Check if current path is allowed
  const isAllowed = allowedPaths.includes(currentPath);

  return isAllowed ? <>{children}</> : <Navigate to="/404" replace />;
}