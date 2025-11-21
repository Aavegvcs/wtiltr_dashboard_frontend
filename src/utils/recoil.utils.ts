import { atom } from 'recoil';

export type Permission = {
  subject: string;
  actions: string[];
  allowed: boolean;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  role: { name: string; id: number };
  features: { permissions: { subject: string; action: string }[]; allowed: boolean }[];
  company: { companyName: string };
  employee: { designation: string };
};

export type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permission[];
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    token: null,
    user: null,
    isAuthenticated: false,
    permissions: [],
  },
});