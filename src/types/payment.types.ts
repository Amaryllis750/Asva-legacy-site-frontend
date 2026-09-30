export interface PaymentObject {
  email: string;
  amount: number;
  description: string;
  purpose: "ACCOUNT_CREATION" | "DEV_CENTER_BOOKING";
}