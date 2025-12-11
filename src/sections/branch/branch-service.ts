import axiosInstance from 'src/config-global';
import type { BranchItem } from './types';

export async function listBranches(skip = 0, limit = 10) {
  const body = { QUERY_STRING: { skip, limit } };
  const res = await axiosInstance.post('/branches/list', body);
  // backend returns { total, items }
  console.log("this is branch data  ", res.data);
  return res.data.data;
}

export async function getBranch(id: string) {
  const res = await axiosInstance.get(`/branches/${id}`);
  return res.data.data;
}

export async function createBranch(payload: Partial<BranchItem>) {
  const res = await axiosInstance.post('/branches/create', payload);
  return res.data.data;
}

export async function updateBranch(id: string, payload: Partial<BranchItem>) {
  const res = await axiosInstance.patch(`/branches/${id}`, payload);
  return res.data.data;
}

export async function deleteBranch(id: string) {
  const res = await axiosInstance.delete(`/branches/${id}`);
  return res.data.data;
}


export async function toggleBranchStatus(id: string) {
  const res = await axiosInstance.post('/branches/toggle-status', { id });
  return res.data.data;
}

export async function getAllBranchesForDropdown() {
  const res = await axiosInstance.post('/branches/get-all-branches');
  return res.data.data;
}

export async function getCorporatesForDropdown() {
  const res = await axiosInstance.post('/corporate/list');
   return res.data.data; 
}
export async function getStatesForDropdown() {
  const res = await axiosInstance.get('/states');
  return res.data.data;
} 