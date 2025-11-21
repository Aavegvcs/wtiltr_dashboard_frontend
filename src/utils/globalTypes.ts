
export const validDocumentTypes = {
  ticketDocument: 'ticket-document',
  insuranceUser: 'insurance-user',
  userMedical: 'user-medical',
  insuranceDependent: 'insurance-dependent',
  dependentMedical: 'dependent-medical',
  insuredPerson: 'insured-person',
  insuredMedical: 'insured-medical',
  vehicleDocument: 'vehicle-document',
} as const;


export interface insuranceUserDetails {
  insuranceUserId: number;
  insuranceUserName: string;
  userMobileNumber: string;
  userEmailId: string;
  userGender: string;
  userDateOfBirth: string;
  userEmploymentType: string;
  documents: {
    name: string;
    url: string;
  }[];
}
export interface insuredDetails {
    id?: number;
    name?: string;
    dateOfBirth?: string;
    gender?: string;
    primaryContactNumber?: string; 
    secondaryContactNumber?: string;
    emailId?: string;
    relation?: string;
    permanentAddress?: string;
    permanentCity?: string;
    permanentState?: string;
    permanentPinCode?: string;
    isActive?: boolean;
}



export interface VehicleDetails {
  id:string;
  vehicleType: string;
  vehicleNumber: string;
  makingYear?: string;
  vehicleName?: string;
  modelNumber?: string;
  rcOwnerName?: string;
  engineNumber?: string;
  chassisNumber?: string;
  dateOfReg?: string;
  madeBy?: string;
  vehicleCategory?: string;
  othersVehicleCategory?: string;
  seatingCapacity?: string;
  grossVehicleWeight?: string;
  overTurning?: boolean;
  noClaimBonus?: boolean;
  noClaimBonusOnPrePolicy?: string;

  documents: {
    name: string;
    url: string;
  }[];
}

export interface documents {
    name: string;
    url: string;
  }[];


  export interface medicalDetails {
    height?: number;
    weight?: number;
    // preExistDiseases?: string;
    preExistDiseases?: string[];
    medication?: string;
    isPastSurgery?: boolean;
    dischargeSummary?: string;
    isChronicCondition?: boolean;
    diagnosticReport?: string;
    isSmoker?: boolean;
    isDrinker?: boolean;
    bloodGroup?: string;
  }

  export interface dependents {
    id?: number;
    name: string;
    dateOfBirth?: string;
    gender?: string;
    primaryContactNumber?: string;
    relation?: string;
    medicalDetails?: {
      height?: number;
      weight?: number;
      // preExistDiseases?: string;
      preExistDiseases?: string[];
      medication?: string;
      isPastSurgery?: boolean;
      dischargeSummary?: string;
      isChronicCondition?: boolean;
      diagnosticReport?: string;
      isSmoker?: boolean;
      isDrinker?: boolean;
      bloodGroup?: string;
    };
  }[];



  export interface nomineeDetails {
    id?:string;
    name?:string;
    gender?:string;
    relation?:string;
    contactNumber?:string;
    dateOfBirth?:string;
  }
