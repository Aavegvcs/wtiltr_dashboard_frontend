
// import type { CorporateProps } from './types';

// // ----------------------------------------------------------------------

// export const visuallyHidden = {
//   border: 0,
//   margin: -1,
//   padding: 0,
//   width: '1px',
//   height: '1px',
//   overflow: 'hidden',
//   position: 'absolute',
//   whiteSpace: 'nowrap',
//   clip: 'rect(0 0 0 0)',
// } as const;

// // ----------------------------------------------------------------------

// export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
//   return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
// }

// // ----------------------------------------------------------------------

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) return -1;
//   if (b[orderBy] > a[orderBy]) return 1;
//   return 0;
// }

// // ----------------------------------------------------------------------

// export function getComparator<Key extends keyof any>(
//   order: 'asc' | 'desc',
//   orderBy: Key
// ) {
//   return order === 'desc'
//     ? (a: any, b: any) => descendingComparator(a, b, orderBy)
//     : (a: any, b: any) => -descendingComparator(a, b, orderBy);
// }

// // ----------------------------------------------------------------------

// type ApplyFilterProps = {
//   inputData: CorporateProps[];
//   filterName: string;
//   filterStatus: 'all' | 'active' | 'inactive';
//   comparator: (a: any, b: any) => number;
// };

// export function applyFilterCorporate({
//   inputData = [],
//   comparator,
//   filterName,
//   filterStatus,
// }: ApplyFilterProps) {

//   // Sort with stable index
//   const stabilized = inputData.map((el, index) => [el, index] as const);
//   stabilized.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   let filteredData = stabilized.map((el) => el[0]);

//   // 🔍 Text Search Filter
//   if (filterName.trim() !== '') {
//     const keyword = filterName.toLowerCase();

//     filteredData = filteredData.filter(
//       (item) =>
//         item.corporateName?.toLowerCase().includes(keyword) ||
//         item.corporateCode?.toLowerCase().includes(keyword)
//     );
//   }

//   // 🟩 Status Filter
//   if (filterStatus !== 'all') {
//     filteredData = filteredData.filter((item) =>
//       filterStatus === 'active' ? item.isActive === true : item.isActive === false
//     );
//   }

//   return filteredData;
// }
// src/views/corporate/utils.ts
export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

type ApplyFilterProps = {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: 'all' | 'active' | 'inactive';
};

export function applyFilterCorporate({
  inputData,
  comparator,
  filterName,
  filterStatus,
}: ApplyFilterProps) {
  const stabilized = inputData.map((el, index) => [el, index] as const);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  let data = stabilized.map((el) => el[0]);

  if (filterName) {
    const keyword = filterName.toLowerCase();
    data = data.filter(
      (item: any) =>
        item.corporateName?.toLowerCase().includes(keyword) ||
        item.corporateCode?.toLowerCase().includes(keyword) ||
        item.phoneNumber?.includes(keyword) ||
        item.email?.toLowerCase().includes(keyword)
    );
  }

  if (filterStatus !== 'all') {
    const isActive = filterStatus === 'active';
    data = data.filter((item: any) => item.isActive === isActive);
  }

  return data;
}