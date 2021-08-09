import * as moment from 'moment';
import { CustomTableLayout, ContentTable, TDocumentDefinitions, Content, Column } from 'pdfmake';
import { } from 'pdfmake';
import { pdfConstants, orderTableHeader, getOrderTableWidth } from 'src/app/constants/pdf.constants';
import { Customer, Invoice } from 'src/app/model/invoice.model';
import { Organization } from 'src/app/model/organization.model';
import { ToWords } from 'to-words';

enum WidthType {
  AUTO,
  STAR,
}

const NO_TOP_BOTTOM_TABLE_BORDER: CustomTableLayout = {
  hLineWidth: (rowIndex: number, node: ContentTable) => {
    // Avoiding horizontal border for the first and last row of the table.
    // NOTE: If there are 5 rows in a table, there will be 6 horizontal lines.
    // 0 being the table's top most border
    // 6 being the table's bottom most border
    if (rowIndex === 0 || rowIndex === node.table.body.length) {
      return 0;
    } else {
      return 1;
    }
  },
};

const getOrderItemTableLayout = (isDefaultLayout: boolean) => {
  return {
    hLineWidth: (rowIndex: number, node: ContentTable, colIndex: number) => {
      // Displaying the horizontal line only around the headers and for the table bottom outline.
      if (
        rowIndex === 0 ||
        rowIndex === 1 ||
        (rowIndex >= node.table.body.length - 2 &&
          rowIndex !== node.table.body.length)
      ) {
        return 1;
      } else {
        return 0;
      }
    },
    paddingBottom: (rowIndex: number, node: any, colIndex: number) => {
      const DEFAULT_PADDING = 2;
      // The content height is static.
      // TODO: Automate the static content height to match amount in words in one line as well as two lines
      const ORDER_TOTAL_DISPLAY_ROW_HEIGHT = isDefaultLayout ? 15.5 : 31;

      // Calculating height for the last order item.
      // NOTE: length - 1 gives the last element of the table.
      // But instead -3 is used to neglect the two rows displaying the order total.
      if (rowIndex === node.table.body.length - 3) {
        const currentPosition = node.positions[node.positions.length - 1];
        const totalPageHeight = currentPosition.pageInnerHeight;
        const currentHeight = currentPosition.top;
        const paddingBottom = totalPageHeight - currentHeight - ORDER_TOTAL_DISPLAY_ROW_HEIGHT;
        return paddingBottom;
      } else {
        return DEFAULT_PADDING;
      }
    },
  };
};

const getDocumentContent = (
  order: Invoice,
  seller: Organization,
  buyer: Customer
): TDocumentDefinitions => {

  const isDefaultLayout: boolean = String(order.totalFinalValue).length <= 7;

  // Destructuring pdf constants.
  const {
    AMOUNT_IN_WORDS_LABEL,
    AUTHORIZED_SIGNATURE_LABEL,
    BILLING_FROM_LABEL,
    BILLING_TO_LABEL,
    CUSTOMER_SIGNATURE_LABEL,
    DELIVERED_DATE_LABEL,
    EMAIL_LABEL,
    GST_NUMBER_LABEL,
    INVOICE_NUMBER_LABEL,
    INVOICE_TITLE,
    ORDER_TOTAL_LABEL,
    ORDERED_DATE_LABEL,
    PHONE_NUMBER_LABEL,
    PHONE_NUMBER_PREFIX,
    REFERENCE_LABEL,
  } = pdfConstants;

  // Destructuring required order data.
  const {
    invoiceNumber,
    invoiceDate,
  } = order;

  // Formatter used to convert amount to proper INR format.
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });

  // Function to right align the data.
  const alignRight = (val: any) => {
    const data = {
      text: val,
      style: 'text-align-right',
    };

    return data;
  };

  // Function to convert amount to proper INR format.
  const convertToInrString = (val: number) => {
    const data: string = inrFormatter.format(val);
    return alignRight(data);
  };

  // Function to convert the amount in numbers to words.
  const convertAmountToWords = (amount: number) => {
    const toWords = new ToWords({
      localeCode: 'en-IN',
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
      }
    });

    return toWords.convert(amount);
  };

  // Function to generate auto width array for the given count.
  const createWidthArray = (count: number, type: WidthType): string[] => {
    const widthArray: string[] = [];

    for (let i = 0; i < count; i++) {
      if (type === WidthType.STAR) {
        widthArray.push('*');
      } else if (type === WidthType.AUTO) {
        widthArray.push('auto');
      }
    }
    return widthArray;
  };

  // Function to create dummy data. i.e., create an object with empty text.
  const createDummyData = (count: number): Content[] => {
    const dummyTableCells: Content[] = [];

    for (let i = 0; i < count; i++) {
      dummyTableCells.push({ text: '' });
    }
    return dummyTableCells;
  };

  // Function to generate the organization data to be displayed from the organization object.
  const generateOrganizationAddressData = ({
    companyName,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    phoneNumber,
    gstNumber,
    email,
  }: any): Column[] => {
    const columns: Column[] = [
      {
        text: companyName.toUpperCase(),
        style: 'company-name',
      },
      {
        text: addressLine1,
      },
      {
        text: addressLine2,
      },
      {
        text: `${city}, ${state} - ${pincode}.`,
      },
      {
        text: `${PHONE_NUMBER_LABEL} ${PHONE_NUMBER_PREFIX} ${phoneNumber}`,
      },
      email && {
        text: `${EMAIL_LABEL} ${email}`,
      },
      gstNumber && {
        text: `${GST_NUMBER_LABEL} ${gstNumber}`,
      },
    ];

    // Return column array containing organization details.
    return columns;
  };

  // Function to generate the buyer data to be displayed from the buyer object.
  const generateBuyerAddressData = ({
    firstName,
    lastName,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    phoneNumber,
    gstNumber,
    email,
  }: any): Column[] => {
    const columns: Column[] = [
      {
        text: `${firstName.toUpperCase()}  ${lastName !== undefined ? lastName.toUpperCase() : ''}`,
        style: 'company-name',
      },
      {
        text: addressLine1,
      },
      {
        text: addressLine2,
      },
      {
        text: `${city}, ${state} - ${pincode}.`,
      },
      {
        text: `${PHONE_NUMBER_LABEL} ${PHONE_NUMBER_PREFIX} ${phoneNumber}`,
      },
      email && {
        text: `${EMAIL_LABEL} ${email}`,
      },
      gstNumber && {
        text: `${GST_NUMBER_LABEL} ${gstNumber}`,
      },
    ];

    // Return column array containing organization details.
    return columns;
  };

  // Function to generate the data to be populated in the main table of the pdf.
  const generateMainContent = (order: Invoice): any[][] => {
    // TODO: Generate the main content
    // return [createDummyData(6)];
    const EMPTY_LINE = [
      ...createDummyData(6)
    ];

    const {
      MAIN_CONTENT: {
        MACHINE_COST: {
          DEFAULT,
          BASIC,
          CVD,
          SOCIAL_WELFARE,
          IGST
        },
        ADDITIONAL_CHARGES,
        CUSTOMIZATION_CHARGES,
        FREIGHT_COST,
        MAINTENANCE_FEE
      }
    } = pdfConstants;

    const mainContent = [
      // TODO: Update main content
      // // 1. Machine cost
      // [
      //   DEFAULT,
      //   convertToInrString(order.dutyCalculation.assessiableValue),
      //   ...createDummyData(3),
      //   convertToInrString(order.dutyCalculation.assessiableValue)
      // ],
      // [
      //   BASIC,
      //   ...createDummyData(1),
      //   alignRight('10%'),
      //   convertToInrString(order.dutyCalculation.basicTax),
      //   ...createDummyData(1),
      //   convertToInrString(order.dutyCalculation.basicTax),
      // ],
      // [
      //   CVD,
      //   ...createDummyData(1),
      //   alignRight('5%'),
      //   convertToInrString(order.dutyCalculation.cvdTax),
      //   ...createDummyData(1),
      //   convertToInrString(order.dutyCalculation.cvd),
      // ],
      // [
      //   SOCIAL_WELFARE,
      //   ...createDummyData(1),
      //   alignRight('10%'),
      //   convertToInrString(order.dutyCalculation.socialWelfareTax),
      //   ...createDummyData(1),
      //   convertToInrString(order.dutyCalculation.socialWelfare),
      // ],
      // [
      //   IGST,
      //   ...createDummyData(1),
      //   alignRight('18%'),
      //   convertToInrString(order.dutyCalculation.IGST),
      //   ...createDummyData(1),
      //   convertToInrString(order.dutyCalculation.IGST),
      // ],
      // // machine cost subtotal line
      // [
      //   ...createDummyData(5),
      //   convertToInrString(order.dutyCalculation.totalValue),
      // ],
      // EMPTY_LINE,
      // EMPTY_LINE,

      // // 2. Freight cost
      // [
      //   FREIGHT_COST,
      //   `${convertToInrString(order.freightCalculation.price).text} * ${convertToInrString(order.freightCalculation.weight).text}`,
      //   ...createDummyData(2),
      //   convertToInrString(order.freightCalculation.discount),
      //   convertToInrString(order.freightCalculation.total)
      // ],
      // EMPTY_LINE,

      // // 3. Customization charges
      // [
      //   CUSTOMIZATION_CHARGES,
      //   convertToInrString(order.customizeCharges.price),
      //   ...createDummyData(2),
      //   convertToInrString(order.customizeCharges.discount),
      //   convertToInrString(order.customizeCharges.total)
      // ],
      // EMPTY_LINE,

      // // 4. Additional Charges
      // [
      //   ADDITIONAL_CHARGES,
      //   convertToInrString(order.additionalCharges.price),
      //   ...createDummyData(2),
      //   convertToInrString(order.additionalCharges.discount),
      //   convertToInrString(order.additionalCharges.total)
      // ],
      // EMPTY_LINE,

      // // 5. Maintenance fees
      // [
      //   MAINTENANCE_FEE,
      //   convertToInrString(order.annualMaintainanceCharges.price),
      //   ...createDummyData(2),
      //   convertToInrString(order.annualMaintainanceCharges.discount),
      //   convertToInrString(order.annualMaintainanceCharges.total)
      // ],
    ];

    return mainContent;
  };

  // Return the actual content to form the PDF.
  return {
    pageMargins: [20, 30, 20, 100],
    defaultStyle: {
      fontSize: 10,
    },
    content: [
      // Content 1 - Table
      // Displays the Pdf Title, From/To address and order meta data.
      {
        table: {
          widths: [...createWidthArray(2, WidthType.STAR)],
          body: [
            // Row 1 - Displays the bill heading
            [
              {
                text: INVOICE_TITLE,
                colSpan: 2,
                style: 'text-align-center',
              },
              ...createDummyData(1),
            ],
            // Row 2 - Displays From/To address.
            [
              // Column 1 - From Address.
              {
                columns: [
                  [
                    {
                      text: BILLING_FROM_LABEL,
                    },
                    ...generateOrganizationAddressData(seller),
                  ],
                ],
              },
              // Column 2 - To Address.
              {
                columns: [
                  [
                    {
                      text: BILLING_TO_LABEL,
                    },
                    ...generateBuyerAddressData(buyer),
                  ],
                ],
              },
            ],
          ],
        },
      },

      // Content 2 - Displays order meta data like order number and order date.
      {
        layout: NO_TOP_BOTTOM_TABLE_BORDER,
        table: {
          widths: [...createWidthArray(4, WidthType.STAR)],
          body: [
            // Row 1 - Contains invoice number and ordered date.
            [
              // Invoice Number label and value.
              {
                text: INVOICE_NUMBER_LABEL,
                border: [true, true, true, true],
              },
              {
                text: invoiceNumber,
              },
              // Ordered Date label and value.
              {
                text: ORDERED_DATE_LABEL,
              },
              {
                text: moment(invoiceDate).format('DD/MM/YYYY'),
              },
            ],
          ],
        },
      },

      // Content 3 - Table to iterate and print the order items and its total.
      {
        margin: 0,
        layout: getOrderItemTableLayout(isDefaultLayout),
        table: {
          heights: (row: number) => {
            if (!isDefaultLayout && row === 17) {
              return 28;
            }
          },
          widths: getOrderTableWidth(isDefaultLayout),
          headerRows: 1,
          body: [
            [...orderTableHeader],

            // As the method returns any[][], spreading the result leads to 1D array.
            // The pdf creator interprets 1D array as row and values inside it as columns.
            ...generateMainContent(order),

            // Row to display the total.
            [
              {
                text: ORDER_TOTAL_LABEL,
                colSpan: '5',
                style: 'text-align-right',
              },
              ...createDummyData(4),
              {
                text: convertToInrString(order.totalFinalValue),
                // Setting the bottom border of the table cell to false.
                border: [true, true, true, false],
              },
            ],

            // Row to display the total in words
            [
              {
                // Convert the number to text
                // text: `${AMOUNT_IN_WORDS_LABEL} ${convertAmountToWords(order.total).toUpperCase()}`,
                text: `${convertAmountToWords(order.totalFinalValue).toUpperCase()}`,
                colSpan: '5',
              },
              ...createDummyData(4),
              {
                text: '',
                // Setting the top border of the table cell to false.
                border: [true, false, true, true],
              },
            ]
          ],
        },
      },
    ],

    // Footer content.
    footer: (
      currentPage: number,
      pageCount: number,
    ): Content | null | undefined => {
      // Printing the footer only at the last page.
      if (currentPage === pageCount) {
        // Footer content - Signature of the organization and customer.
        const footerContent: Content = {
          margin: [20, 0],
          table: {
            widths: [...createWidthArray(2, WidthType.STAR)],
            body: [
              [
                {
                  text: CUSTOMER_SIGNATURE_LABEL,
                  margin: [2, 48, 0, 0],
                },
                {
                  columns: [
                    [
                      {
                        text: `For ${seller.companyName.toUpperCase()}`,
                        margin: [0, 0, 2, 35],
                        style: 'text-align-right',
                      },
                      {
                        text: AUTHORIZED_SIGNATURE_LABEL,
                        margin: [0, 0, 2, 8],
                        style: 'text-align-right',
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        };
        return footerContent;
      }
    },

    // Style definition for the pdf.
    styles: {
      'company-name': {
        bold: true,
        fontSize: 10,
      },
      'order-table-header': {
        bold: true,
        fontSize: 9,
      },
      'text-align-right': {
        alignment: 'right',
      },
      'text-align-center': {
        alignment: 'center',
      },
    },
  };
};



// Export.
export { getDocumentContent };
