// import { CommonUtils } from './../../../pages/utils/commonUtils';
import { Invoice, Customer } from './../../../model/invoice.model';
import { Organization } from './../../../model/organization.model';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { getDocumentContent } from './pdf-layout-definition';
// import { EmailService } from '../email/email.service';
import { ToastUtilService } from '../toast/toast-util.service';

@Injectable({
  providedIn: 'root',
})
export class PdfService {

  pdfObj = null;

  constructor(
    // private _emailService: EmailService,
    private _toastUtilService: ToastUtilService
  ) {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

  generateInvoice(
    invoice: Invoice,
    seller: Organization,
    buyer: Customer,
    action: 'open' | 'print' | 'download' | 'email' = 'open'
  ) {
    console.log('invoice', invoice);
    const documentContent = getDocumentContent(
      invoice,
      seller,
      buyer);

    const fileName = `${seller.companyName}_${new Date().toISOString()}.pdf`;

    switch (action) {
      case 'open':
        pdfMake.createPdf(documentContent).open();
        break;
      case 'print':
        pdfMake.createPdf(documentContent).print();
        break;
      case 'download':
        pdfMake.createPdf(documentContent).download(fileName);
        break;
      default:
        pdfMake.createPdf(documentContent).open();
        break;
    }
  }

}
