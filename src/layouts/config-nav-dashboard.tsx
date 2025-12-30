// changed done 04-07-2025

import { useRecoilValue } from 'recoil';
import { authState } from 'src/recoil/auth';
import { SvgColor } from 'src/components/svg-color';
import {
  AdminPanelSettingsIcon,
  BranchIcon,
  BusinessIcon,
  cvdMappingIcon,
  DashboardIcon,
  DescriptionIcon,
  DriverIcon,
  ListAltIcon,
  LockIcon,
  PeopleIcon,
  SecurityIcon,
  ShoppingBagIcon,
  tripsheetIcon,
  UserIcon,
  vehicleIcon,
} from 'src/utils/mui-icon';
import { SheetIcon } from 'lucide-react';

// Function to generate icons dynamically
const icon = (name: string): React.ReactElement => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} width={24} height={24} />
);

const getParentIcon = (IconComponent: React.ElementType) => (
  <IconComponent sx={{ fontSize: 18 }} /> // Parent icon size
);

const getChildIcon = (IconComponent: React.ElementType) => (
  <IconComponent sx={{ fontSize: 16 }} /> // Child icon size
);

// Define TypeScript type for navigation items
export type NavItem = {
  title: string;
  path?: string; // Made optional for collapsible parents
  icon: React.ReactElement;
  info?: React.ReactNode;
  permission?: string;
  children?: NavItem[]; // Changed to NavItem[] to maintain consistency
};

export const useNavData = (): NavItem[] => {
  const auth = useRecoilValue(authState);
  const routePermissions = auth?.permissions?.route || [];

  const rawNav: NavItem[] = [
    {
      title: 'Dashboard',
      path: '/',
      // icon: icon('ic-analytics'),
      icon: getParentIcon(DashboardIcon),
      permission: 'dashboard',
    },

    {
      title: 'Admin Pages',
      path: '#',
      icon: getParentIcon(PeopleIcon),
      children: [
        {
          title: 'Users',
          path: '/company-employee',
          icon: getChildIcon(UserIcon),
          permission: 'company-employee',
        },
        {
          title: 'Corporate',
          path: '/corporate-view',
          icon: getChildIcon(BusinessIcon),
          permission: 'corporate-view',
        },
        {
          title: 'Branch',
          path: '/branch-view',
          icon: getChildIcon(BranchIcon),
          permission: 'branch-view',
        },

        {
          title: 'Vehicle',
          path: '/vehicle-view',
          icon: getChildIcon(vehicleIcon),
          permission: 'vehicle-view',
        },
        {
          title: 'Driver',
          path: '/driver-view',
          icon: getChildIcon(DriverIcon),
          permission: 'driver-view',
        },
        {
          title: 'CVD Mapping',
          path: '/cvd-mapping-view',
          icon: getChildIcon(cvdMappingIcon),
          permission: 'cvd-mapping-view',
        },

        {
          title: 'Trip Sheet',
          path: '/trip-sheet-view',
          icon: getChildIcon(tripsheetIcon),
          permission: 'trip-sheet-view',
        },
        {
          title: 'Admin Sheet',
          path: '/admin-sheet-view',
          icon: getChildIcon(tripsheetIcon),
          permission: 'admin-sheet-view',
        },
      ],
    },

    {
      title: 'Permissions',
      path: '#', // Placeholder for collapsible parent
      icon: getParentIcon(AdminPanelSettingsIcon),

      children: [
        {
          title: 'Permission',
          path: '/permission-view',
          icon: getChildIcon(LockIcon),
          permission: 'permission-view',
        },
        {
          title: 'Role Permission Mapping',
          path: '/role-permission-mapping',
          icon: getChildIcon(SecurityIcon),
          permission: 'role-permission-mapping',
        },
      ],
    },
  ];

  const filterNav = (items: NavItem[]): NavItem[] => {
    if (routePermissions.includes('all')) {
      return items.map((item) => ({
        ...item,
        children: item.children ? filterNav(item.children) : undefined,
      }));
    }

    return items
      .map((item) => {
        const filteredChildren = item.children ? filterNav(item.children) : undefined;

        //  Keep parent only if it has at least one permitted child
        if (filteredChildren && filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren,
          };
        }

        //  Keep item if it's a leaf (has path) and is permitted
        if (
          !item.children &&
          item.path &&
          item.permission &&
          routePermissions.includes(item.permission)
        ) {
          return item;
        }

        //  Otherwise, remove
        return null;
      })
      .filter((item): item is NavItem => item !== null);
  };

  return filterNav(rawNav);
};
