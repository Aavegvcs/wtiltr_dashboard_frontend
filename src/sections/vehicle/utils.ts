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

type ApplyFilterVehicleProps = {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: 'all' | 'active' | 'inactive';
};

export function applyFilterVehicle({
  inputData,
  comparator,
  filterName,
  filterStatus,
}: ApplyFilterVehicleProps) {
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
        item.vehicleNumber?.toLowerCase().includes(keyword) ||
        item.vehicleName?.toLowerCase().includes(keyword) ||
        item.vehicleModel?.toLowerCase().includes(keyword)
    );
  }

  if (filterStatus !== 'all') {
    const isActive = filterStatus === 'active';
    data = data.filter((item: any) => item.isActive === isActive);
  }

  return data;
}
