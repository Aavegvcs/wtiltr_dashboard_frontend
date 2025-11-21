// import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

// import { useEffect } from 'react';

// import Box from '@mui/material/Box';
// import ListItem from '@mui/material/ListItem';
// import { useTheme } from '@mui/material/styles';
// import ListItemButton from '@mui/material/ListItemButton';
// import Drawer, { drawerClasses } from '@mui/material/Drawer';

// import { usePathname } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';

// import { varAlpha } from 'src/theme/styles';

// import { Logo } from 'src/components/logo';
// import { Scrollbar } from 'src/components/scrollbar';

// // import { NavUpgrade } from '../components/nav-upgrade';
// import { WorkspacesPopover } from '../components/workspaces-popover';

// import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// // ----------------------------------------------------------------------

// export type NavContentProps = {
//   data: {
//     path: string;
//     title: string;
//     icon: React.ReactNode;
//     info?: React.ReactNode;
//   }[];
//   slots?: {
//     topArea?: React.ReactNode;
//     bottomArea?: React.ReactNode;
//   };
//   workspaces: WorkspacesPopoverProps['data'];
//   sx?: SxProps<Theme>;
// };

// export function NavDesktop({
//   sx,
//   data,
//   slots,
//   workspaces,
//   layoutQuery,
// }: NavContentProps & { layoutQuery: Breakpoint }) {
//   const theme = useTheme();

//   return (
//     <Box
//       sx={{
//         pt: 2.5,
//         px: 2.5,
//         top: 0,
//         left: 0,
//         height: 1,
//         display: 'none',
//         position: 'fixed',
//         flexDirection: 'column',
//         bgcolor: 'var(--layout-nav-bg)',
//         zIndex: 'var(--layout-nav-zIndex)',
//         width: 'var(--layout-nav-vertical-width)',
//         borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
//         [theme.breakpoints.up(layoutQuery)]: {
//           display: 'flex',
//         },
//         ...sx,
//       }}
//     >
//       <NavContent data={data} slots={slots} workspaces={workspaces} />
//     </Box>
//   );
// }

// // ----------------------------------------------------------------------

// export function NavMobile({
//   sx,
//   data,
//   open,
//   slots,
//   onClose,
//   workspaces,
// }: NavContentProps & { open: boolean; onClose: () => void }) {
//   const pathname = usePathname();

//   useEffect(() => {
//     if (open) {
//       onClose();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname]);

//   return (
//     <Drawer
//       open={open}
//       onClose={onClose}
//       sx={{
//         [`& .${drawerClasses.paper}`]: {
//           pt: 2.5,
//           px: 2.5,
//           overflow: 'unset',
//           bgcolor: 'var(--layout-nav-bg)',
//           width: 'var(--layout-nav-mobile-width)',
//           ...sx,
//         },
//       }}
//     >
//       <NavContent data={data} slots={slots} workspaces={workspaces} />
//     </Drawer>
//   );
// }

// // ----------------------------------------------------------------------

// export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
//   const pathname = usePathname();

//   return (
//     <>
//      <Box mb={2}>

//      <Logo />
//      </Box>

//       {slots?.topArea}

//       {/* <WorkspacesPopover data={workspaces} sx={{ my: 2 }} />S */}

//       <Scrollbar fillContent>
//         <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
//           <Box component="ul" gap={0.5} display="flex" flexDirection="column">
//             {data.map((item) => {
//               const isActived = item.path === pathname;

//               return (
//                 <ListItem disableGutters disablePadding key={item.title}>
//                   <ListItemButton
//                     disableGutters
//                     component={RouterLink}
//                     href={item.path}
//                     sx={{
//                       pl: 2,
//                       py: 1,
//                       gap: 2,
//                       pr: 1.5,
//                       borderRadius: 0.75,
//                       typography: 'body2',
//                       fontWeight: 'fontWeightMedium',
//                       color: 'var(--layout-nav-item-color)',
//                       minHeight: 'var(--layout-nav-item-height)',
//                       ...(isActived && {
//                         fontWeight: 'fontWeightSemiBold',
//                         bgcolor: 'var(--layout-nav-item-active-bg)',
//                         color: 'var(--layout-nav-item-active-color)',
//                         '&:hover': {
//                           bgcolor: 'var(--layout-nav-item-hover-bg)',
//                         },
//                       }),
//                     }}
//                   >
//                     <Box component="span" sx={{ width: 24, height: 24 }}>
//                       {item.icon}
//                     </Box>

//                     <Box component="span" flexGrow={1}>
//                       {item.title}
//                     </Box>

//                     {item.info && item.info}
//                   </ListItemButton>
//                 </ListItem>
//               );
//             })}
//           </Box>
//         </Box>
//       </Scrollbar>

//       {slots?.bottomArea}

//       {/* <NavUpgrade /> */}
//     </>
//   );
// }

// ------------------------------------------------------------------------------
// import React from 'react';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';

import { NavItem } from 'src/layouts/config-nav-dashboard'; // Import NavItem type

import { WorkspacesPopover } from '../components/workspaces-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

export type NavContentProps = {
  data: NavItem[];
  isCollapsed?: boolean;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};
// side bar for desktop
export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
  isCollapsed = false,
}: NavContentProps & { layoutQuery: Breakpoint; isCollapsed?: boolean }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        // width: 'var(--layout-nav-vertical-width, 280px)', // Fixed width
        width: isCollapsed ? '80px' : 'var(--layout-nav-vertical-width, 280px)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} isCollapsed={isCollapsed} />
    </Box>
  );
}

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width, 280px)', // Consistent width
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

export function NavContent({ data, slots, workspaces, isCollapsed, sx }: NavContentProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    data.forEach((item) => {
      if (item.children) {
        item.children.forEach((subItem) => {
          if (subItem.path && isActive(subItem.path)) {
            setExpanded((prev) => new Set(prev).add(item.title));
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) {
      setExpanded(new Set());
    }
  }, [pathname, isActive, data]);

  const handleToggle = (title: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = hasChildren && expanded.has(item.title);
    // const isActived = item.path && isActive(item.path);
    const isActived =
      (item.path && isActive(item.path)) ||
      (hasChildren && item.children?.some((child) => child.path && isActive(child.path)));

    return (
      <>
        <ListItem disableGutters disablePadding key={item.title} sx={{ width: '100%' }}>
          <ListItemButton
            disableGutters
            component={item.path ? RouterLink : 'button'}
            href={item.path}
            onClick={(e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
              if (hasChildren) {
                e.preventDefault();
                handleToggle(item.title);
              }
            }}
            sx={{
              pl: 1 + level * 0, // Dynamic indentation
              py: 1,
              gap: 1,
              pr: 3,
              borderRadius: 0.75,
              // typography: 'body2',
              fontSize: level === 0 ? '0.85rem' : '0.80rem',
              lineHeight: 1.5,
              fontWeight: 'fontWeightMedium',
              color: 'var(--layout-nav-item-color, #637381)',
              minHeight: level === 0 ? '40px' : '32px',
              width: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'var(--layout-nav-item-hover-bg, rgba(0, 0, 0, 0.04))',
                color: 'var(--layout-nav-item-hover-color, #212B36)',
              },
              ...(isActived &&
                (level === 0
                  ? {
                      // Parent styling
                      fontWeight: 'fontWeightSemiBold',
                      bgcolor: 'var(--layout-nav-item-active-bg, #E6F7FF)',
                      color: 'var(--layout-nav-item-active-color, #1890FF)',
                      '&:hover': {
                        bgcolor: 'var(--layout-nav-item-active-hover-bg, #D9F0FF)',
                      },
                    }
                  : {
                      // Child styling – only text color
                      fontWeight: 'fontWeightSemiBold',
                      color: 'var(--layout-nav-item-active-color, #1890FF)',
                    })),
            }}
          >
            <Box
              component="span"
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </Box>
            {!isCollapsed && (
              <Box
                component="span"
                flexGrow={1}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  opacity: level === 0 ? 1 : 0.9,
                }}
              >
                {item.title}
              </Box>
            )}

            {hasChildren && (
              <Iconify
                icon={isExpanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                width={16}
                height={16}
                sx={{
                  ml: 1,
                  color: 'var(--layout-nav-item-color, #637381)',
                  transition: 'transform 0.2s ease',
                }}
              />
            )}
          </ListItemButton>
        </ListItem>

        {/* Child below with correct indent */}
        {isExpanded && hasChildren && (
          <Box sx={{ ml: 2,mb:1 }}>{item.children?.map((child) => renderNavItem(child, level + 1))}</Box>
        )}

      </>
    );
  };

  return (
    <>
      <Box mb={2}>
        <Logo />
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column" sx={{ p: 0, m: 0 }}>
            {/* {data.map((item) => renderNavItem(item))} */}
            {data.map((item) => renderNavItem(item))}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
