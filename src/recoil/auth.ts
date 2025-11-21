// import { atom } from 'recoil';

// export type Permission = {
//   subject: string;
//   actions: string[];
//   allowed: boolean;
// };

// export type User = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   userType: string;
//   role: { name: string; id: number };
//   features: { permissions: { subject: string; action: string }[]; allowed: boolean }[];
//   company: { companyName: string };
//   employee: { designation: string };
// };

// export type AuthState = {
//   token: string | null;
//   user: User | null;
//   isAuthenticated: boolean;
//   allowedRoutes: string[]; // List of allowed routes from backend
//   permissions: Permission[];
// };

// export const authState = atom<AuthState>({
//   key: 'authState',
//   default: {
//     token: null,
//     user: null,
//     isAuthenticated: false,
//     allowedRoutes: [],
//     permissions: [],
//   },
// });

// ----------
import { atom, AtomEffect } from 'recoil';

// Define types
// export type Permission = {
//   subject: string;
//   actions: string[];
//   allowed: boolean;
// };
export type Permission = {
  all: string[];
  route: string[];
  button: string[];
  pdf: string[];
  api: string[];
  menu: string[];
  field: string[];
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
  allowedRoutes: string[];
  permissions: Permission | null;
};

// Persistence effect for localStorage
const localStorageEffect: AtomEffect<AuthState> = ({ setSelf, onSet }) => {
  // Initialize state from localStorage on app load
  const savedAuth = localStorage.getItem('authState');
  if (savedAuth) {
    try {
      const parsedAuth = JSON.parse(savedAuth);
      // Validate the parsed data to ensure it matches AuthState structure
      if (
        parsedAuth &&
        typeof parsedAuth === 'object' &&
        'token' in parsedAuth &&
        'user' in parsedAuth &&
        'isAuthenticated' in parsedAuth &&
        'allowedRoutes' in parsedAuth &&
        'permissions' in parsedAuth
      ) {
        setSelf(parsedAuth);
      }
    } catch (error) {
      console.error('Error parsing authState from localStorage:', error);
    }
  }

  // Save state to localStorage whenever it changes
  onSet((newValue, _, isReset) => {
    if (isReset) {
      localStorage.removeItem('authState');
    } else {
      localStorage.setItem('authState', JSON.stringify(newValue));
    }
  });
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    token: null,
    user: null,
    isAuthenticated: false,
    allowedRoutes: [],
    // permissions: {
    //   all: [],
    //   route: [],
    //   button: [],
    //   pdf: [],
    //   api: [],
    //   menu: [],
    //   field: []
    // } ,
     permissions: null,
  },
  effects: [localStorageEffect], // Add the persistence effect
});
