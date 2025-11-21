// import type { CardProps } from '@mui/material/Card';
// import type { ColorType } from 'src/theme/core/palette';
// import type { ChartOptions } from 'src/components/chart';
// import {
//   Card,
//   Box,
//   Typography,
//   Tooltip,
//   IconButton,
//   LinearProgress,
//   Select,
//   MenuItem,
//   FormControl,
//   Divider,
// } from '@mui/material';
// import InfoOutlined from '@mui/icons-material/InfoOutlined';

// import { useTheme } from '@mui/material/styles';

// import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';

// import { varAlpha, bgGradient } from 'src/theme/styles';

// import { Iconify } from 'src/components/iconify';
// import { SvgColor } from 'src/components/svg-color';
// import { Chart, useChart } from 'src/components/chart';
// import { CircularProgress } from '@mui/material';
// import { useState } from 'react';
// import { TimeRangeLabels } from 'src/utils/insurance.utils';
// // import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// type Props = CardProps & {
//   title: string;
//   total: number;
//   percent: number;
//   color?: ColorType;
//   icon: React.ReactNode;
//   chart: {
//     categories: string[];
//     series: number[];
//     options?: ChartOptions;
//   };
//   totalTickets: number;
//   totalOpen: number;
//   totalInProgress: number;
//   totalClosed: number;
//   growth?: number | string;
//   preTitle: string;
//   preTotalTickets: number;
//   preTotalOpen: number;
//   preTotalInProgress: number;
//   preTotalClosed: number;
// };

// export function AnalyticsWidgetSummary({
//   icon,
//   title,
//   total,
//   chart,
//   percent,
//   color = 'primary',
//   totalTickets,
//   totalOpen,
//   totalInProgress,
//   totalClosed,
//   growth,
//   preTitle,
//   preTotalTickets,
//   preTotalOpen,
//   preTotalInProgress,
//   preTotalClosed,

//   sx,
//   ...other
// }: Props) {
//   const theme = useTheme();
//   const [filter, setFilter] = useState('all'); // State for dropdown filter

//   const handleFilterChange = (event: any) => {
//     setFilter(event.target.value);
//     // Add logic to filter data based on selection if needed
//   };
//   const chartColors = [theme.palette[color].dark];

//   const chartOptions = useChart({
//     chart: { sparkline: { enabled: true } },
//     colors: chartColors,
//     xaxis: { categories: chart.categories },
//     grid: {
//       padding: {
//         top: 6,
//         left: 6,
//         right: 6,
//         bottom: 6,
//       },
//     },
//     tooltip: {
//       y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
//     },
//     ...chart.options,
//   });

//   const renderTrending = (
//     <Box
//     // sx={{
//     //   top: 16,
//     //   gap: 0.5,
//     //   right: 16,
//     //   display: 'flex',
//     //   position: 'absolute',
//     //   alignItems: 'center',
//     // }}
//     >
//       <Iconify width={20} icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />
//       <Box component="span" sx={{ typography: 'subtitle2' }}>
//         {percent > 0 && '+'}
//         {fPercent(percent)}
//       </Box>
//     </Box>
//   );

//   return (
//     <Box display="flex" flexDirection="column" gap={3}>

//       <Card
//         sx={{
//           p: 1,
//           // boxShadow: 'none',
//           position: 'relative',
//           color: 'commit.white',
//           backgroundColor: 'common.white',

//           ...sx,
//         }}
//         {...other}
//       >
//         {}
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//           }}
//         >
//           {/* Dropdown */}
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <FormControl size="small">
//               <Select
//                 name="ticketState"
//                 value={'This year'}
//                 variant="outlined"
//                 sx={{ minWidth: 100 }}
//               >
//                 {Object.keys(TimeRangeLabels).map((label, value) => (
//                   <MenuItem key={value} value={value}>
//                     {label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* Trending info */}

//             {renderTrending}
//           </Box>

//           {/* Info icon */}
//           <Box>
//             <Tooltip
//               title={
//                 <Box>
//                   <Typography variant="body2" fontWeight="bold">
//                     {preTitle}
//                   </Typography>
//                   <Typography variant="body2">Open: {preTotalOpen}</Typography>
//                   <Typography variant="body2">In Progress: {preTotalInProgress}</Typography>
//                   <Typography variant="body2">Closed: {preTotalClosed}</Typography>
//                   <Typography variant="body2">Total: {preTotalTickets}</Typography>
//                 </Box>
//               }
//               arrow
//               placement="top"
//             >
//               <IconButton size="small" sx={{ color: `${color}.darker` }}>
//                 <InfoOutlined fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>
//         <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
//           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
//             {/* Open */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Typography
//                 variant="body2"
//                 fontWeight="bold"
//                 sx={{ lineHeight: 1, fontSize: '14px' }}
//               >
//                 {Number(totalOpen).toLocaleString()}
//               </Typography>
//               <Typography variant="body2" sx={{ lineHeight: 1, fontSize: '12px' }}>
//                 Open
//               </Typography>
//             </Box>

//             {/* Closed */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Typography
//                 variant="body2"
//                 fontWeight="bold"
//                 sx={{ lineHeight: 1, fontSize: '14px' }}
//               >
//                 {Number(totalClosed).toLocaleString()}
//               </Typography>
//               <Typography variant="body2" sx={{ lineHeight: 1, fontSize: '12px' }}>
//                 Closed
//               </Typography>
//             </Box>

//             {/* In Progress */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Typography
//                 variant="body2"
//                 fontWeight="bold"
//                 sx={{ lineHeight: 1, fontSize: '14px' }}
//               >
//                 {Number(totalInProgress).toLocaleString()}
//               </Typography>
//               <Typography variant="body2" sx={{ lineHeight: 1, fontSize: '12px' }}>
//                 Inprogress
//               </Typography>
//             </Box>

//             {/* Sold */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Typography
//                 variant="body2"
//                 fontWeight="bold"
//                 sx={{ lineHeight: 1, fontSize: '14px' }}
//               >
//                 {Number(8).toLocaleString()}
//               </Typography>
//               <Typography variant="body2" sx={{ lineHeight: 1, fontSize: '12px' }}>
//                 Sold
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
//             <Typography variant="body2" fontWeight="bold" sx={{ lineHeight: 1, fontSize: '16px' }}>
//               {Number(totalOpen).toLocaleString()} {totalOpen >= 1000 ? 'K' : ''}
//             </Typography>

//             <Typography variant="body2" fontWeight="500" sx={{ lineHeight: 1, fontSize: '12px' }}>
//               Total Ticket
//             </Typography>
//           </Box>
//         </Box>

//         <SvgColor
//           src="/assets/background/shape-square.svg"
//           sx={{
//             top: 0,
//             left: -20,
//             width: 240,
//             zIndex: -1,
//             height: 240,
//             opacity: 0.24,
//             position: 'absolute',
//             color: `${color}.main`,
//           }}
//         />
//       </Card>

//     </Box>
//   );
// }

//-------------

// import type { CardProps } from '@mui/material/Card';
// import type { ColorType } from 'src/theme/core/palette';
// import type { ChartOptions } from 'src/components/chart';
// import {
//   Card,
//   Box,
//   Typography,
//   Tooltip,
//   IconButton,
//   LinearProgress,
//   Select,
//   MenuItem,
//   FormControl,
//   Divider,
//   SelectChangeEvent,
// } from '@mui/material';
// import InfoOutlined from '@mui/icons-material/InfoOutlined';

// import { useTheme } from '@mui/material/styles';

// import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';
// import { varAlpha, bgGradient } from 'src/theme/styles';
// import { Iconify } from 'src/components/iconify';
// import { SvgColor } from 'src/components/svg-color';
// import { Chart, useChart } from 'src/components/chart';
// import { useState } from 'react';
// import { TimeRangeLabels } from 'src/utils/insurance.utils';

// type Props = CardProps & {
//   title: string;
//   total: number;
//   percent: number;
//   color?: ColorType;
//   icon: React.ReactNode;
//   chart: {
//     categories: string[];
//     series: number[];
//     options?: ChartOptions;
//   };
//   totalTickets: number;
//   totalOpen: number;
//   totalInProgress: number;
//   totalClosed: number;
//   growth?: number | string;
//   preTitle: string;
//   preTotalTickets: number;
//   preTotalOpen: number;
//   preTotalInProgress: number;
//   preTotalClosed: number;
//   onFilterChange?: (value: keyof typeof TimeRangeLabels) => void;
// };

// export function AnalyticsWidgetSummary({
//   icon,
//   title,
//   total,
//   chart,
//   percent,
//   color = 'primary',
//   totalTickets,
//   totalOpen,
//   totalInProgress,
//   totalClosed,
//   growth,
//   preTitle,
//   preTotalTickets,
//   preTotalOpen,
//   preTotalInProgress,
//   preTotalClosed,
//   sx,
//   onFilterChange,
//   ...other
// }: Props) {
//   const theme = useTheme();
//   const [filter, setFilter] = useState<keyof typeof TimeRangeLabels>(
//     title as keyof typeof TimeRangeLabels
//   );

//   const handleFilterChange = (event: SelectChangeEvent<keyof typeof TimeRangeLabels>) => {
//     const newFilter = event.target.value as keyof typeof TimeRangeLabels;
//     setFilter(newFilter);
//     if (onFilterChange) {
//       onFilterChange(newFilter);
//     }
//   };

//   const chartColors = [theme.palette[color].dark];

//   const chartOptions = useChart({
//     chart: { sparkline: { enabled: true } },
//     colors: chartColors,
//     xaxis: { categories: chart.categories },
//     grid: {
//       padding: {
//         top: 6,
//         left: 6,
//         right: 6,
//         bottom: 6,
//       },
//     },
//     tooltip: {
//       y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
//     },
//     ...chart.options,
//   });

//   // const renderTrending = (
//   //   <Box>
//   //     <Iconify width={20} icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />
//   //     <Box component="span" sx={{ typography: 'subtitle2' }}>
//   //       {percent > 0 && '+'}
//   //       {fPercent(percent)}
//   //     </Box>
//   //   </Box>
//   // );

//   const renderTrending = (
//     <Box
//       sx={{
//         color: percent >= 0 ? 'green' : 'red',
//       }}
//     >
//       <Iconify width={20} icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />
//       <Box component="span" sx={{ typography: 'subtitle2' }}>
//         {percent > 0 && '+'}
//         {fPercent(percent)}
//       </Box>
//     </Box>
//   );

//   return (
//     <Box display="flex" flexDirection="column" gap={3}>
//       <Card
//         sx={{
//           p: 1,
//           position: 'relative',
//           color: 'common.white',
//           backgroundColor: 'common.white',
//           ...sx,
//         }}
//         {...other}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//           }}
//         >
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <FormControl size="small">
//               <Select
//                 name="ticketState"
//                 value={filter}
//                 onChange={handleFilterChange}
//                 variant="outlined"
//                 sx={{ minWidth: 100 }}
//               >
//                 {Object.entries(TimeRangeLabels).map(([label, value]) => (
//                   <MenuItem key={value} value={label}>
//                     {label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             {renderTrending}
//           </Box>

//           <Box>
//             <Tooltip
//               title={
//                 <Box>
//                   <Typography variant="body2" fontWeight="bold">
//                     {preTitle}
//                   </Typography>
//                   <Typography variant="body2">Open: {preTotalOpen}</Typography>
//                   <Typography variant="body2">In Progress: {preTotalInProgress}</Typography>
//                   <Typography variant="body2">Closed: {preTotalClosed}</Typography>
//                   <Typography variant="body2">Total: {preTotalTickets}</Typography>
//                 </Box>
//               }
//               arrow
//               placement="top"
//             >
//               <IconButton size="small" sx={{ color: `${color}.darker` }}>
//                 <InfoOutlined fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>
//         <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
//         {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
//           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

//               <Typography
//                 variant="body2"
//                 fontWeight="bold"
//                 sx={{ lineHeight: 1, fontSize: '14px', color: 'black' }}
//               >
//                 {Number(totalOpen).toLocaleString()}
//               </Typography>

//               <Typography
//                 variant="body2"
//                 sx={{ lineHeight: 1, fontSize: '12px', color: 'text.secondary' }}
//               >
//                 Open
//               </Typography>
//             </Box>

//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Typography
//                 variant="body2"
//                 fontWeight="bold"
//                 sx={{ lineHeight: 1, fontSize: '14px', color: 'black' }}
//               >
//                 {Number(totalClosed).toLocaleString()}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{ lineHeight: 1, fontSize: '12px', color: 'text.secondary' }}
//               >
//                 Closed
//               </Typography>
//             </Box>

//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Typography
//                 variant="body2"
//                 fontWeight="bold"
//                 sx={{ lineHeight: 1, fontSize: '14px', color: 'black' }}
//               >
//                 {Number(totalInProgress).toLocaleString()}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{ lineHeight: 1, fontSize: '12px', color: 'text.secondary' }}
//               >
//                 Inprogress
//               </Typography>
//             </Box>

//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Typography
//                 variant="body2"
//                 fontWeight="bold"
//                 sx={{ lineHeight: 1, fontSize: '14px', color: 'black' }}
//               >
//                 {Number(8).toLocaleString()}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{ lineHeight: 1, fontSize: '12px', color: 'text.secondary' }}
//               >
//                 Sold
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
//             <Typography
//               variant="body2"
//               fontWeight="bold"
//               sx={{ lineHeight: 1, fontSize: '16px', color: 'black' }}
//             >
//               {Number(totalTickets).toLocaleString()} {totalOpen >= 1000 ? 'K' : ''}
//             </Typography>
//             <Typography
//               variant="body2"
//               fontWeight="500"
//               sx={{ lineHeight: 1, fontSize: '12px', color: 'text.secondary' }}
//             >
//               Total Ticket
//             </Typography>
//           </Box>
//         </Box> */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
//           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
//             {/* Open - Red */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                 <Box
//                   sx={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: '50%',
//                     backgroundColor: 'green', // Red
//                   }}
//                 />
//                 <Typography
//                   variant="body2"
//                   fontWeight="bold"
//                   sx={{ lineHeight: 1, fontSize: '14px', color: 'text.primary' }}
//                 >
//                   {Number(totalOpen).toLocaleString()}
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="body2"
//                 sx={{ lineHeight: 1, fontSize: '12px', color: 'text.secondary' }}
//               >
//                 Open
//               </Typography>
//             </Box>

//             {/* Closed - Green */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                 <Box
//                   sx={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: '50%',
//                     backgroundColor: 'red', // Green
//                   }}
//                 />
//                 <Typography
//                   variant="body2"
//                   fontWeight="bold"
//                   sx={{ lineHeight: 1, fontSize: '14px', color: 'text.primary' }}
//                 >
//                   {Number(totalClosed).toLocaleString()}
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="body2"
//                 sx={{ lineHeight: 1, fontSize: '12px', color: 'text.secondary' }}
//               >
//                 Closed
//               </Typography>
//             </Box>

//             {/* In Progress - Yellow */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                 <Box
//                   sx={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: '50%',
//                     backgroundColor: 'blue', // Yellow
//                   }}
//                 />
//                 <Typography
//                   variant="body2"
//                   fontWeight="bold"
//                   sx={{ lineHeight: 1, fontSize: '14px', color: 'text.primary' }}
//                 >
//                   {Number(totalInProgress).toLocaleString()}
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="body2"
//                 sx={{ lineHeight: 1, fontSize: '12px', color: 'text.secondary' }}
//               >
//                 In Progress
//               </Typography>
//             </Box>

//             {/* Sold - Blue */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                 <Box
//                   sx={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: '50%',
//                     backgroundColor: 'gray', // Blue
//                   }}
//                 />
//                 <Typography
//                   variant="body2"
//                   fontWeight="bold"
//                   sx={{ lineHeight: 1, fontSize: '14px', color: 'text.primary' }}
//                 >
//                   {Number(8).toLocaleString()}
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="body2"
//                 sx={{ lineHeight: 1, fontSize: '12px', color: 'text.secondary' }}
//               >
//                 Sold
//               </Typography>
//             </Box>
//           </Box>

//           <Box
//             sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 1, mb: 2 }}
//           >
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Box
//                 sx={{
//                   width: 80,
//                   height: 80,
//                   borderRadius: '50%',
//                   border: '3px solid',
//                   color: 'red',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   padding: '10px',
//                 }}
//               >
//                 <Typography
//                   variant="body2"
//                   fontWeight="bold"
//                   sx={{ lineHeight: 1, fontSize: '18px', color: 'text.primary', mb: 1 }}
//                 >
//                   {Number(totalTickets).toLocaleString()} {totalTickets >= 1000 ? 'K' : ''}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   fontWeight="600"
//                   sx={{ lineHeight: 1, fontSize: '9px', color: 'black' }}
//                 >
//                   Total Tickets
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* <SvgColor
//           src="/assets/background/shape-square.svg"
//           sx={{
//             top: 0,
//             left: -20,
//             width: 240,
//             zIndex: -1,
//             height: 240,
//             opacity: 0.24,
//             position: 'absolute',
//             color: `${color}.main`,
//           }}
//         /> */}
//       </Card>
//     </Box>
//   );
// }

export function AnalyticsWidgetSummary2({
  icon,
  title,
  total,
  chart,
  percent,
  color = 'primary',
  totalTickets,
  totalOpen,
  totalInProgress,
  totalClosed,
  growth,
  preTitle,
  preTotalTickets,
  preTotalOpen,
  preTotalInProgress,
  preTotalClosed,
  sx,
  onFilterChange,
  ...other
}: Props) {
  const theme = useTheme();
  const [filter, setFilter] = useState<keyof typeof TimeRangeLabels>(
    title as keyof typeof TimeRangeLabels
  );

  const handleFilterChange = (event: SelectChangeEvent<keyof typeof TimeRangeLabels>) => {
    const newFilter = event.target.value as keyof typeof TimeRangeLabels;
    setFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const chartColors = [theme.palette[color].dark];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart.categories },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
    },
    ...chart.options,
  });

  const renderTrending = (
    <Box>
      <Iconify width={20} icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Card
        sx={{
          p: 1,
          position: 'relative',
          color: 'common.white',
          backgroundColor: 'common.white',
          width: '100%',
          height: '100%',
          ...sx,
        }}
        {...other}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        ></Box>
        <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}></Box>

        {/* <SvgColor
          src="/assets/background/shape-square.svg"
          sx={{
            top: 0,
            left: -20,
            width: 240,
            zIndex: -1,
            height: 240,
            opacity: 0.24,
            position: 'absolute',
            color: `${color}.main`,
          }}
        /> */}
      </Card>
    </Box>
  );
}

//------------------------

import React, { useEffect, useRef, useState } from 'react';
import type { CardProps } from '@mui/material/Card';
import type { ColorType } from 'src/theme/core/palette';
import { useChart, type ChartOptions } from 'src/components/chart';
import {
  Card,
  Box,
  Typography,
  Tooltip,
  IconButton,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/material/styles';
import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';
import { varAlpha, bgGradient } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import * as echarts from 'echarts';
import { TimeRangeLabels } from 'src/utils/insurance.utils';

type Props = CardProps & {
  title: string;
  total: number;
  percent: number;
  color?: ColorType;
  icon: React.ReactNode;
  chart: {
    categories: string[];
    series: number[];
    options?: ChartOptions;
  };
  totalTickets: number;
  totalOpen: number;
  totalInProgress: number;
  totalClosed: number;
  totalSold: number;
  growth?: number | string;
  preTitle: string;
  preTotalTickets: number;
  preTotalOpen: number;
  preTotalInProgress: number;
  preTotalClosed: number;
  preTotalSold: number;
  onFilterChange?: (value: keyof typeof TimeRangeLabels) => void;
};

export function AnalyticsWidgetSummary({
  icon,
  title,
  total,
  chart,
  percent,
  color = 'primary',
  totalTickets,
  totalOpen,
  totalInProgress,
  totalClosed,
  totalSold,
  growth,
  preTitle,
  preTotalTickets,
  preTotalOpen,
  preTotalInProgress,
  preTotalClosed,
  preTotalSold,
  sx,
  onFilterChange,
  ...other
}: Props) {
  const theme = useTheme();
  const [filter, setFilter] = useState<keyof typeof TimeRangeLabels>(
    title as keyof typeof TimeRangeLabels
  );
  const chartRef = useRef(null);

  const handleFilterChange = (event: SelectChangeEvent<keyof typeof TimeRangeLabels>) => {
    const newFilter = event.target.value as keyof typeof TimeRangeLabels;
    setFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const chartColors = [theme.palette[color].dark];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart.categories },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
    },
    ...chart.options,
  });

  const renderTrending = (
    <Box
      sx={{
        color: percent >= 0 ? 'green' : 'red',
      }}
    >
      <Iconify width={20} icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>
    </Box>
  );

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    // const option = {
    //   tooltip: {
    //     trigger: 'item',
    //   },
    //   legend: {
    //     show: false, // Hide legend to save space
    //   },
    //   series: [
    //     {
    //       name: 'Tickets',
    //       type: 'pie',
    //       radius: ['80%', '90%'], // Adjusted for compact display
    //       avoidLabelOverlap: false,
    //       label: {
    //         show: true,
    //         position: 'center',
    //         formatter: `${totalTickets.toLocaleString()}${totalTickets >= 1000 ? 'K' : ''}\n\nTotal Ticket`, // Show total in center
    //         fontSize: 12,
    //         fontWeight: 'semibold',
    //         color: 'black',
    //       },

    //       labelLine: {
    //         show: false,
    //       },
    //       data: [
    //         { value: totalOpen, name: 'Open', itemStyle: { color: 'green' } },
    //         { value: totalClosed, name: 'Closed', itemStyle: { color: 'red' } },
    //         { value: totalInProgress, name: 'Inprogress', itemStyle: { color: 'blue' } },
    //       ],
    //     },
    //   ],
    // };
const option = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    show: false,
  },
  series: [
    {
      name: 'Tickets',
      type: 'pie',
      radius: ['80%', '90%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: () => {
          return `{value|${totalTickets.toLocaleString()}${totalTickets >= 1000 ? 'K' : ''}}\n{label|Total Ticket}`;
        },
        rich: {
          value: {
            fontSize: 20, // 👈 Larger font for value
            fontWeight: 'bold',
            color: '#000',
          },
          label: {
            fontSize: 14, // 👈 Smaller font for label
            fontWeight: '500',
            color: '#666',
          },
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: totalOpen, name: 'Open', itemStyle: { color: 'green' } },
        { value: totalClosed, name: 'Closed', itemStyle: { color: 'red' } },
        { value: totalInProgress, name: 'Inprogress', itemStyle: { color: 'blue' } },
      ],
    },
  ],
};

    myChart.setOption(option);

    // Cleanup on unmount
    return () => {
      myChart.dispose();
    };
  }, [totalOpen, totalClosed, totalInProgress, totalTickets]);

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Card
        sx={{
          p: 1,
          position: 'relative',
          color: 'common.white',
          backgroundColor: 'common.white',
          ...sx,
        }}
        {...other}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small">
              <Select
                name="ticketState"
                value={filter}
                onChange={handleFilterChange}
                variant="outlined"
                sx={{ minWidth: 100 }}
              >
                {Object.entries(TimeRangeLabels).map(([label, value]) => (
                  <MenuItem key={value} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {renderTrending}
          </Box>

          <Box>
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {preTitle}
                  </Typography>
                  <Typography variant="body2">Open: {preTotalOpen}</Typography>
                  <Typography variant="body2">In Progress: {preTotalInProgress}</Typography>
                  <Typography variant="body2">Closed: {preTotalClosed}</Typography>
                  <Typography variant="body2">Total: {preTotalTickets}</Typography>
                  <Typography variant="body2">Total: {preTotalSold}</Typography>
                </Box>
              }
              arrow
              placement="top"
            >
              <IconButton size="small" sx={{ color: `${color}.darker` }}>
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
        {/* data */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
          <Box
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2, }}
          >
            {/* Open - Green */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: 'green',
                  }}
                />
                <Box className="flex flex-col gap-1">
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ lineHeight: 1, fontSize: '18px', color: 'text.primary' }}
                  >
                    {Number(totalOpen).toLocaleString()}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1, fontSize: '11px', color: 'text.secondary' }}
                  >
                    Open
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Closed - Red */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: 'red',
                  }}
                />

                <Box className="flex flex-col gap-1">
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ lineHeight: 1, fontSize: '18px', color: 'text.primary' }}
                  >
                    {Number(totalClosed).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1, fontSize: '11px', color: 'text.secondary' }}
                  >
                    Closed
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* In Progress - Blue */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: 'blue',
                  }}
                />

                <Box className="flex flex-col gap-1">
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ lineHeight: 1, fontSize: '18px', color: 'text.primary' }}
                  >
                    {Number(totalInProgress).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1, fontSize: '11px', color: 'text.secondary' }}
                  >
                    Inprogress
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Sold - Gray */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: 'gray',
                  }}
                />

                <Box className="flex flex-col gap-1">
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ lineHeight: 1, fontSize: '18px', color: 'text.primary' }}
                  >
                    {Number(totalSold).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1, fontSize: '11px', color: 'text.secondary' }}
                  >
                    Sold
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 1,
              mb: 2,
              // mr: -2,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 110,
                  height: 110,
                }}
                ref={chartRef}
              />
              {/* <Typography
                variant="body2"
                fontWeight="600"
                sx={{ lineHeight: 1, fontSize: '9px', color: 'black', mt: 1 }}
              >
                Total Tickets
              </Typography> */}
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}


export const BlankWidget = () => (
    <Card
      sx={{
        p: 1,
        position: 'relative',
        color: 'common.white',
        backgroundColor: 'common.white',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small">
            <Select
              name="ticketState"
              value=""
              variant="outlined"
              sx={{ minWidth: 100 }}
              disabled
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
            </Select>
          </FormControl>
        </Box> */}
        {/* <Box>
          <IconButton size="small" sx={{ color: 'grey.500' }} disabled>
            <InfoOutlined fontSize="small" />
          </IconButton>
        </Box> */}
      </Box>
      {/* <Divider sx={{ my: 1, borderStyle: 'dashed' }} /> */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        <Box
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                }}
              />
              <Box className="flex flex-col gap-1">
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ lineHeight: 1, fontSize: '18px', color: 'text.primary' }}
                >
                   
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1, fontSize: '11px', color: 'text.secondary' }}
                >
                   
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                }}
              />
              <Box className="flex flex-col gap-1">
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ lineHeight: 1, fontSize: '18px', color: 'text.primary' }}
                >
                   
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1, fontSize: '11px', color: 'text.secondary' }}
                >
                   
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                }}
              />
              <Box className="flex flex-col gap-1">
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ lineHeight: 1, fontSize: '18px', color: 'text.primary' }}
                >
                   
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1, fontSize: '11px', color: 'text.secondary' }}
                >
                   
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                }}
              />
              <Box className="flex flex-col gap-1">
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ lineHeight: 1, fontSize: '18px', color: 'text.primary' }}
                >
                   
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1, fontSize: '11px', color: 'text.secondary' }}
                >
                   
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 1,
            mb: 2,
          }}
        >
          <Box sx={{ width: 110, height: 110 }} />
        </Box>
      </Box>
    </Card>
  );