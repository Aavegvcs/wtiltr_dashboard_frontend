
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

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}


// Updated enums with PascalCase names and UPPER_CASE values
// export enum Current_Step {
//   InitialReview = 'INITIAL_REVIEW',
//   DocumentCollection = 'DOCUMENT_COLLECTION',
//   DocumentVerification = 'DOCUMENT_VERIFICATION',
//   AssignedToTelecaller = 'ASSIGNED_TO_TELECALLER',
//   QuotationGeneration = 'QUOTATION_GENERATION',
//   QuotationReview = 'QUOTATION_REVIEW',
//   QuotationSent = 'QUOTATION_SENT',
//   CustomerApproval = 'CUSTOMER_APPROVAL',
//   PaymentPending = 'PAYMENT_PENDING',
//   PaymentProcessing = 'PAYMENT_PROCESSING',
//   PaymentCompleted = 'PAYMENT_COMPLETED',
//   PolicyIssuance = 'POLICY_ISSUANCE',
//   PolicyDelivered = 'POLICY_DELIVERED',
//   FollowUp = 'FOLLOW_UP',
// }
// export enum Current_Step {
//   INITIAL_REVIEW = 'INITIAL_REVIEW', // Ticket is under initial review
//   DOCUMENT_COLLECTION = 'DOCUMENT_COLLECTION', // Collecting documents from the customer
//   DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION', // Verifying the submitted documents
//   ASSIGNED_TO_TELECALLER = 'ASSIGNED_TO_TELECALLER', // Assigned to a telecaller for follow-up
//   QUOTATION_SENT = 'QUOTATION_SENT', // Quotation sent to the customer
//   QUOTATION_GENERATED = 'QUOTATION_GENERATED', // Generating insurance quotation
//   QUOTATION_REVIEWED = 'QUOTATION_REVIEWED', // Reviewing the quotation
//   SUBMITTED_FOR_REVISION = 'SUBMITTED_FOR_REVISION', // Submitted for revision by the customer
//   REVISED_AND_UPDATE = 'REVISED_AND_UPDATE', // Revision required by the customer
//   CUSTOMER_APPROVED = 'CUSTOMER_APPROVED', // Waiting for customer approval of quotation
//   PAYMENT_PENDING = 'PAYMENT_PENDING', // Waiting for payment from the customer
//   PAYMENT_PROCESSING = 'PAYMENT_PROCESSING', // Processing the payment
//   PAYMENT_COMPLETED = 'PAYMENT_COMPLETED', // Payment successfully completed
//   POLICY_ISSUED = 'POLICY_ISSUED', // Issuing the insurance policy
//   POLICY_REVIEWED = 'POLICY_REVIEWED', // Reviewing the issued policy
//   POLICY_DELIVERED = 'POLICY_DELIVERED', // Policy delivered to the customer
//   FOLLOW_UP = 'FOLLOW_UP' // Post-issuance follow-up with the customer
// }

export enum Current_Step {
  INITIAL_REVIEW = 'INITIAL_REVIEW', // Ticket is under initial review
  DOCUMENT_COLLECTED = 'DOCUMENT_COLLECTED', // Collecting documents from the customer
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION', // Verifying the submitted documents
  QUOTATION_GENERATED = 'QUOTATION_GENERATED', // Generating insurance quotation
  QUOTATION_SENT = 'QUOTATION_SENT', // Quotation sent to the customer
  QUOTATION_REVIEWED = 'QUOTATION_REVIEWED', // Reviewing the quotation
  SUBMITTED_FOR_REVISION = 'SUBMITTED_FOR_REVISION', // Submitted for revision by the customer
  REVISED_AND_UPDATE = 'REVISED_AND_UPDATE', // Revision required by the customer
  CUSTOMER_APPROVED = 'CUSTOMER_APPROVED', // Waiting for customer approval of quotation
  PAYMENT_LINK_GENERATED = 'PAYMENT_LINK_GENERATED', // Waiting for payment from the customer
  PAYMENT_DENIED = 'PAYMENT_DENIED', // Payment denied by the customer//
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED', // Payment successfully completed
  POLICY_ISSUED = 'POLICY_ISSUED', // Issuing the insurance policy
  POLICY_RECEIVED = 'POLICY_RECEIVED', // Reviewing the issued policy
  POLICY_DELIVERED = 'POLICY_DELIVERED', // Policy delivered to the customer
  CLOSED = 'CLOSED'
}
export enum Quotation_Status{
  QUOTATION_GENERATED = 'QUOTATION_GENERATED', // Generating insurance quotation
  QUOTATION_REVIEWED = 'QUOTATION_REVIEWED', // Reviewing the quotation
  QUOTATION_SENT = 'QUOTATION_SENT', // Quotation sent to the customer
  SUBMITTED_FOR_REVISION = 'SUBMITTED_FOR_REVISION', // Submitted for revision by the customer
  REVISED_AND_UPDATE = 'REVISED_AND_UPDATE', // Revision required by the customer
  CUSTOMER_APPROVED = 'CUSTOMER_APPROVED', // Waiting for customer approval of quotation
  EXPIRED  = 'EXPIRED', // Expired
}

export enum Ticket_Log_Events {
  TicketCreated = 'CREATED',
  TicketCreatedAndAssigned = 'CREATED_AND_ASSIGNED',
  TicketAssigned = 'ASSIGNED',
  TicketReassigned = 'REASSIGNED',
  TicketUpdated = 'UPDATED',
  TicketClosed = 'CLOSED',
  TicketCancelled = 'CANCELLED',
  TicketCommented = 'COMMENTED',
  TicketEscalated = 'ESCALATED',
  TicketDeleted = 'DELETED',
  TicketStatusChanged = 'STATUS_CHANGED',
  TicketStepChanged = 'STEP_CHANGED',
}

export enum Ticket_Status {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  OnHold = 'ON_HOLD',
  Resolved = 'RESOLVED',
  Closed = 'CLOSED',
  Cancelled = 'CANCELLED',
}

export enum Insurance_Type {
  Health = 'HEALTH',
  Life = 'LIFE',
  Motor = 'MOTOR',
  Other = 'OTHER',
}

export enum Ticket_Type {
  Fresh = 'FRESH',
  Port = 'PORT',
  // Renewal = 'RENEWAL',
}

export enum Policy_Holder_Type {
  Individual = 'INDIVIDUAL',
  Family = 'FAMILY',
}

export enum Coverage_Type {
  Full = 'FULL',
  ThirdParty = 'THIRD_PARTY',
  B2b = 'B2B',
}

export enum Family_Member_Type {
  Self = 'SELF',
  Spouse = 'SPOUSE',
  Son = 'SON',
  Daughter = 'DAUGHTER',
  Mother = 'MOTHER',
  Father = 'FATHER',
  Brother = 'BROTHER',
  Sister = 'SISTER',
  Grandparent = 'GRANDPARENT',
  Other = 'OTHER',
}

export enum Insurance_Purpose {
  Term = 'TERM',
  Savings = 'SAVINGS',
  Ulip = 'ULIP',
  Endowment = 'ENDOWMENT',
  Protection = 'PROTECTION',
  GuaranteedReturns = 'GUARANTEED_RETURNS'
} 

export enum Client_Type {
  NewClient = 'NEW_CLIENT',
  ExistingClient = 'EXISTING_CLIENT',
  PortClient = 'PORT_CLIENT',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum Employment_Type {
  Salaried = 'SALARIED',
  Business = 'BUSINESS',
}

export enum Notification_Type {
  NewTicket = 'NEW_TICKET',
  RenewalReminder = 'RENEWAL_REMINDER',
  PaymentReminder = 'PAYMENT_REMINDER',
  ClaimUpdate = 'CLAIM_UPDATE',
}

export enum Insurance_Product_Status {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  Expired = 'EXPIRED',
}

export enum Vehicle_Type {
  Car = 'CAR',
  Bike = 'BIKE',
  Scooter = 'SCOOTER',
  Auto = 'AUTO',
  Bus = 'BUS',
  Others = 'OTHERS',
}

export enum Vehicle_Category {
  TwoWheeler = 'TWO_WHEELER',
  PrivateCar = 'PRIVATE_CAR',
  GoodsCarryingVehicle = 'GOODS_CARRYING_VEHICLE',
  PassengerCarryingVehicle = 'PASSENGER_CARRYING_VEHICLE',
  Miscellaneous = 'MISCELLANEOUS',
}


export enum Pre_Existing_Diseases {
  None = 'NONE',
  Asthma = 'ASTHMA',
  Bp = 'BP',
  Cholesterol = 'CHOLESTEROL',
  DiabetesObesity = 'DIABETES_OBESITY',
  Others = 'OTHERS',
}

export enum Blood_Group {
  'A+' = 'A+',
  'A-' = 'A-',
  'B+' = 'B+',
  'B-' = 'B-',
  'AB+' = 'AB+',
  'AB-' = 'AB-',
  'O+' = 'O+',
  'O-' = 'O-',
}

export enum TimeRangeLabels {
  'Today'= 'today',
  'This Week'= 'week',
  'This Month'= 'month',
  'This Year'= 'year'
}
export enum Policy_Status {
    Active = 'ACTIVE',
    Lapsed = 'LAPSED',
    Expired = 'EXPIRED',
    Cancelled = 'CANCELLED'
}

export enum Claim_Status {
  REGISTERED = 'REGISTERED',
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ESCALATED = 'ESCALATED',
  CLOSED = 'CLOSED',
}

export enum Claim_Type {
  CASHLESS = 'CASHLESS',
  REIMBURSEMENT = 'REIMBURSEMENT',
}

export enum Claim_Final_Status {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}