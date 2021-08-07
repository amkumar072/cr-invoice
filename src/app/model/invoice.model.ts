export class Invoice {
  id: string;
  sno: number;
  orgId: String;
  customer: Customer;
  invoiceNumber: string;
  invoiceDate: Date;
  poNumber: string;
  poDate: Date;
  deliveryPlace: string;
  products: Product[];
  totalTaxableValue: number;
  totalGstValue: number;
  totalFinalValue: number;
  status: Status;
  createdDate: Date;
  updatedDate: Date;
  createdBy: string;
  updatedBy: string;
}

export class Product {
  sno: number;
  description: string;
  hsn: number;
  gstPercentage: number;
  price: number;
  quantity: number;
  taxableValue: number;
  cgstValue: number;
  sgstValue: number;
  finalValue: number;
}

export class Customer {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
  gstNumber: string;

  constructor(city?: string, state?: string, country?: string) {
    this.city = city || 'Chennai';
    this.state = state || 'Tamil Nadu';
    this.country = country || 'India';
  }
}

export class DutyCalculation {
  invoiceValue: number; // cost of machine
  exchangeRate: number; // exchange rate
  assessiableValue: number; // exchange rate * cost of machine
  basicTax: number; // assessiableValue * 10%
  cvdTax: number; // Counter value duty= ((basicTax * 5%) + basicTax)
  cvd: number; // Counter value duty= ((basicTax * 5%) + basicTax)
  socialWelfareTax: number; // ((cvd * 10%) + cvd)
  socialWelfare: number; // ((cvd * 10%) + cvd)
  IGST: number; // assessiableValue * 18%
  totalTax: number; // basicTax + cvd + socialWelfare+ IGST
  totalValue: number // assessiableValue + totalTax
}

export class FreightCalculation {
  price: number; // price per kg
  weight: number;
  weightUnit: string; // always in kg
  subTotal: number; // price * weight
  discount: number;
  total: number; // subTotal - total
}

export class Charges {
  price: number;
  discount: number;
  total: number; // price - discount
}

export enum Status {
  ALL = 'ALL',
  QUOTE = 'QUOTE',
  CANCEL = 'CANCEL',
  COMPLETED = 'COMPLETED',
}
