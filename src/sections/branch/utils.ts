import { BranchItem } from './types';

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

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

export function filterBranches(data: BranchItem[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return data;
  return data.filter((b) =>
    (b.name ?? '').toString().toLowerCase().includes(q) ||
    (b.branchCode ?? '').toString().toLowerCase().includes(q) ||
    (b.id ?? '').toString().toLowerCase().includes(q) ||
    (b.corporateName ?? '').toString().toLowerCase().includes(q) ||
    (b.stateName ?? '').toString().toLowerCase().includes(q)
  );
}
