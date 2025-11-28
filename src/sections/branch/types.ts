export type BranchItem = {
  id: number;
  branchCode: string;
  corporateId?: string | number | null;
  corporateName?: string | null;
  name: string;
  stateId?: string | number | null;
  stateName?: string | null;
  city?: string | null;
  pincode?: number | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  isActive?: boolean;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
};
