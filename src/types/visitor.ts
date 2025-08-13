export interface Visitor {
  id: string;
  name: string;
  address: string;
  mobileNumber: string;
  purpose: string;
  reference: string;
  checkInTime: string;
  checkOutTime: string | null;
}

export interface FormData {
  name: string;
  address: string;
  mobileNumber: string;
  purpose: string;
  reference: string;
}