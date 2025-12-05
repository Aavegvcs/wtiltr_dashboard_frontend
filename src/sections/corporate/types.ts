
export interface CorporateProps {
  id?: number;
  corporateCode: string;
  corporateName: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  email: string;
  gst?: string;
  panNumber?: string;
  address?: string;
  currency?: string;
  country: { id: number; name: string } | null;
  state: { id: number; name: string } | null;
  isActive: boolean;
}