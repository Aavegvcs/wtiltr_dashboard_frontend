export interface DriverDocumentProps {
  profilePhoto?: string;
  aadharFront?: string;
  aadharBack?: string;
  dlFront?: string;
  dlBack?: string;
  panCard?: string;
}

export interface DriverProps {
  id?: number;
  name: string;
  mobileNumber: string;
  panNumber?: string;
  cancelCheque?: string;   // image URL
  documents: DriverDocumentProps;
  isActive: boolean;
}
