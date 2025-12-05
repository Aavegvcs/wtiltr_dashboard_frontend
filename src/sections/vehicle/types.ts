export interface VehicleDocumentProps {
  rcBook?: string;
  insurance?: string;
  pollutionCertificate?: string;
}

export interface VehicleProps {
  id?: number;
  vehicleNumber: string;
  vehicleName: string;
  vehicleModel: string;
  documents: VehicleDocumentProps;
  isActive: boolean;
}
