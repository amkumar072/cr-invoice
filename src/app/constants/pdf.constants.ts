import { Content } from 'pdfmake';

// Constants file for pdf service
const pdfConstants = {
  AMOUNT_IN_WORDS_LABEL: 'Amount in words:',
  AUTHORIZED_SIGNATURE_LABEL: 'Authorized Signature',
  BILLING_FROM_LABEL: 'Bill From:',
  BILLING_TO_LABEL: 'Bill To:',
  CUSTOMER_SIGNATURE_LABEL: 'Customer’s Signature',
  DELIVERED_DATE_LABEL: 'Delivered Date',
  EMAIL_LABEL: 'E-mail :',
  GST_NUMBER_LABEL: 'GSTIN/UIN :',
  INVOICE_NUMBER_LABEL: 'Invoice Number',
  INVOICE_TITLE: 'INVOICE',
  ORDER_TOTAL_LABEL: 'Total',
  ORDERED_DATE_LABEL: 'Ordered Date',
  PHONE_NUMBER_LABEL: 'Phone :',
  PHONE_NUMBER_PREFIX: '+91',
  REFERENCE_LABEL: 'Reference',
  DEFAULT_FILE_NAME: 'invoice',
  MAIN_CONTENT: {
    MACHINE_COST: {
      DEFAULT: '1. Machine cost( to type)',
      BASIC: ' 1.a. Basic',
      CVD: '1.b. CVD',
      SOCIAL_WELFARE: '1.c. SOCIAL WELFARE',
      IGST: '1.d. IGST',
    },
    FREIGHT_COST: '2. Freight cost  (weight in kg*cost per weight)',
    CUSTOMIZATION_CHARGES: '3. Customization charges',
    ADDITIONAL_CHARGES: '4. Additional charges',
    MAINTENANCE_FEE: '5. Annual maintainence fees(to type)',
  }
};

// Function to fetch the width of the orders table.
const getOrderTableWidth = (isDefaultLayout: boolean) => {
  // Array containing the default width of the orders table.
  const orderTableWidthDefault: any[] = [
    '*', // 1. product name and sno
    'auto', // 2. price
    23, // 3. tax
    'auto', // 4. tax amount
    'auto', // 5. discount
    'auto', // 6. total value
  ];

  // Array containing the fixed width of the orders table.
  const orderTableWidthFixed: any[] = [
    180, // 1. product name and sno
    'auto', // 2. price
    'auto', // 3. tax
    'auto', // 4. tax amount
    'auto', // 5. discount
    '*', // 6. total value
  ];

  return isDefaultLayout ? orderTableWidthDefault : orderTableWidthFixed;
};

// Array containing the headers of the orders table.
const orderTableHeader: Content[] = [
  'S. No',
  'Price',
  'Tax',
  'Tax Amount',
  'Discount',
  'Total Value',
];

export {
  pdfConstants,
  orderTableHeader,
  getOrderTableWidth
};
