// src/utils/tripSheet.ts
import { alpha } from '@mui/material/styles';
export enum TripSheetStatusEnum {
  CREATED = 0,
  SUBMITTED = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

export const TripSheetStatusMap: Record<TripSheetStatusEnum, { text: string; color: 'info'|'warning'|'success'|'error'|'default' }> = {
  [TripSheetStatusEnum.CREATED]:    { text: 'Created',   color: 'info'    },
  [TripSheetStatusEnum.SUBMITTED]:  { text: 'Submitted', color: 'warning' },
  [TripSheetStatusEnum.APPROVED]:   { text: 'Approved',  color: 'success' },
  [TripSheetStatusEnum.REJECTED]:   { text: 'Rejected',  color: 'error'   },
  [TripSheetStatusEnum.CANCELLED]:  { text: 'Cancelled', color: 'default' },
};

/**
 * Returns a readable label text for a status (safe for unknown values).
 */
export function getStatusText(status: number | string | undefined): string {
  if (status === undefined || status === null) return 'Unknown';
  const n = typeof status === 'string' ? Number(status) : status;
  return TripSheetStatusMap[n as TripSheetStatusEnum]?.text || 'Unknown';
}

/**
 * Returns the "semantic" color key used by Label component or MUI (info, warning, success, error, default)
 */
export function getStatusColor(status: number | string | undefined) {
  const n = typeof status === 'string' ? Number(status) : status;
  return TripSheetStatusMap[n as TripSheetStatusEnum]?.color ?? 'default';
}

/**
 * Row background helper — returns a CSS object (or classname) to style the TableRow background
 * You can use this with sx prop (MUI): <TableRow sx={getRowBg(row.tripStatus)}>
 */
// export function getRowBg(status: number | string | undefined) {
//   const color = getStatusColor(status);
//   switch (color) {
//     case 'success':
//       return { bgcolor: (theme: any) => theme.palette.success.light + '22' }; // subtle
//     case 'warning':
//       return { bgcolor: (theme: any) => theme.palette.warning.light + '14' };
//     case 'error':
//       return { bgcolor: (theme: any) => theme.palette.error.light + '14' };
//     case 'info':
//       return { bgcolor: (theme: any) => theme.palette.info.light + '10' };
//     default:
//       return {}; // no special bg
//   }
// }

 export function getRowBg(status: number | string | undefined) {
  const color = getStatusColor(status);

  return {
    bgcolor: (theme: any) => {
      switch (color) {
        case 'success':
          return alpha(theme.palette.success.main, 0.15);
        case 'warning':
          return alpha(theme.palette.warning.main, 0.15);
        case 'error':
          return alpha(theme.palette.error.main, 0.15);
        case 'info':
          return alpha(theme.palette.info.main, 0.15);
        default:
          return 'inherit';
      }
    }
  };
}
