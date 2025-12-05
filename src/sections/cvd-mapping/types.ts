

// export interface CvdMappingProps {
//   id?: number;
//   corporate?: { id: number; corporateName?: string } | null;
//   branch: { id: number; name: string } | null;
//   vehicle: { id: number; vehicleNumber?: string; vehicleName?: string } | null;
//   driver: { id: number; name?: string; mobileNumber?: string } | null;
//   isActive: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }
export interface CvdMappingProps {
  id?: number;

  corporate?: {
    id: number;
    corporateName?: string;
  } | null;

  branch?: {
    id: number;
    name?: string;
    corporateId?: number;
  } | null;

  vehicle?: {
    id: number;
    vehicleNumber?: string;
    vehicleName?: string;
  } | null;

  driver?: {
    id: number;
    name?: string;
    mobileNumber?: string;
  } | null;

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}
