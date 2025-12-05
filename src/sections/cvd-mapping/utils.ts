

// export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
//     return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
// }

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//     if (b[orderBy] < a[orderBy]) return -1;
//     if (b[orderBy] > a[orderBy]) return 1;
//     return 0;
// }

// export function getComparator<Key extends keyof any>(
//     order: 'asc' | 'desc',
//     orderBy: Key
// ): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
//     return order === 'desc'
//         ? (a, b) => descendingComparator(a, b, orderBy)
//         : (a, b) => -descendingComparator(a, b, orderBy);
// }

// export const visuallyHidden = {
//     border: 0,
//     margin: -1,
//     padding: 0,
//     width: '1px',
//     height: '1px',
//     overflow: 'hidden',
//     position: 'absolute',
//     whiteSpace: 'nowrap',
//     clip: 'rect(0 0 0 0)',
// } as const;

// type ApplyFilterProps = {
//     inputData: any[];
//     comparator: (a: any, b: any) => number;
//     filterName: string;
//     filterStatus: 'all' | 'active' | 'inactive';
// };

// export function applyFilterCvd({
//     inputData,
//     comparator,
//     filterName,
//     filterStatus,
// }: ApplyFilterProps) {
//     const stabilized = inputData.map((el, index) => [el, index] as const);
//     stabilized.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) return order;
//         return a[1] - b[1];
//     });

//     let data = stabilized.map((el) => el[0]);

//     if (filterName) {
//         const keyword = filterName.toLowerCase();
//         data = data.filter((item: any) => {
//             const vehicleText = `${item.vehicle?.vehicleNumber || ''} ${item.vehicle?.vehicleName || ''}`;
//             const driverText = `${item.driver?.name || ''} ${item.driver?.mobileNumber || ''}`;
//             const branchText = item.branch?.name || '';
//             const corporateText = item.corporate?.corporateName || '';

//             const combined = `${vehicleText} ${driverText} ${branchText} ${corporateText}`.toLowerCase();

//             return combined.includes(keyword);
//         });

//     }

//     if (filterStatus !== 'all') {
//         const isActive = filterStatus === 'active';
//         data = data.filter((item: any) => item.isActive === isActive);
//     }

//     return data;
// }
// ------------------------------------------------------
// EMPTY ROWS FOR TABLE PAGINATION
// ------------------------------------------------------
export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ------------------------------------------------------
// SORT HELPERS
// ------------------------------------------------------

// Safe nested value accessor
function getNested(obj: any, path: string) {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (!current || typeof current !== 'object') return '';
    current = current[key];
  }
  return current ?? '';
}

// Comparator for nested fields such as:
// corporate.corporateName, branch.name, driver.name, vehicle.vehicleNumber
function descendingComparator<T>(a: T, b: T, orderBy: keyof T | string) {
  const aValue = typeof orderBy === 'string' ? getNested(a, orderBy) : a[orderBy];
  const bValue = typeof orderBy === 'string' ? getNested(b, orderBy) : b[orderBy];

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key | string
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ------------------------------------------------------
// VISUALLY HIDDEN (For SortLabel)
// ------------------------------------------------------
export const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute' as const,
  whiteSpace: 'nowrap' as const,
  width: '1px',
};

// ------------------------------------------------------
// FILTER LOGIC
// ------------------------------------------------------
type ApplyFilterProps = {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: 'all' | 'active' | 'inactive';
};

export function applyFilterCvd({
  inputData,
  comparator,
  filterName,
  filterStatus,
}: ApplyFilterProps) {

  // -----------------------------
  // 1. SORT
  // -----------------------------
  const stabilized = inputData.map((el, index) => [el, index] as const);

  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let data = stabilized.map((el) => el[0]);

  // -----------------------------
  // 2. FILTER BY SEARCH TEXT
  // -----------------------------
  if (filterName) {
    const keyword = filterName.toLowerCase().trim();

    data = data.filter((item: any) => {
      const corporate = item.corporate?.corporateName || '';
      const branch = item.branch?.name || '';
      const vehicle = `${item.vehicle?.vehicleNumber || ''} ${item.vehicle?.vehicleName || ''}`;
      const driver = `${item.driver?.name || ''} ${item.driver?.mobileNumber || ''}`;

      const combined = `${corporate} ${branch} ${vehicle} ${driver}`.toLowerCase();

      return combined.includes(keyword);
    });
  }

  // -----------------------------
  // 3. FILTER BY STATUS
  // -----------------------------
  if (filterStatus !== 'all') {
    const active = filterStatus === 'active';
    data = data.filter((item) => item.isActive === active);
  }

  return data;
}
