// // export interface CorporateProps {
// //   id?: number;
// //   corporateCode: string;
// //   corporateName: string;
// //   phoneNumber: string;
// //   secondaryPhoneNumber?: string;
// //   email: string;
// //   gst?: string;
// //   panNumber?: string;
// //   address?: string;
// //   currency?: string;
// //   state?: any;
// //   country?: any;
// //   isActive: boolean;
// // }
// export interface CorporateProps {
//     id?: number;
//     corporateCode: string;
//     corporateName: string;
//     phoneNumber: string;
//     secondaryPhoneNumber?: string;
//     email: string;
//     gst?: string;
//     panNumber?: string;
//     address?: string;
//     currency?: string;

//     // These two can be OBJECT or STRING during edit mode
//     country: any;
//     state: any;

//     isActive: boolean;
// }
// src/views/corporate/types.ts
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