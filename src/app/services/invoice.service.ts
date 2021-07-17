import { Injectable } from '@angular/core';
import { CacheService } from './util/cache/cache.service';
import { HttpUtilService } from './util/http/http-util.service';
import { LoggerService } from './util/logger/logger.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Invoice } from '../model/invoice.model';
import { UrlConstants } from '../constants/url-constants';
import { HttpMethods } from '../model/http';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    private _http: HttpUtilService,
    private _cache: CacheService,
    private _db: AngularFireDatabase,
    private _loggerService: LoggerService
  ) { }

  async getInvoiceList(): Promise<Invoice[]> {
    let invoiceList: Invoice[] = this._cache.invoiceList;
    if (invoiceList == null) {
      invoiceList = await this.getInvoiceFromDB();
    }
    return invoiceList;
  }

  async getInvoiceFromDB(): Promise<Invoice[]> {
    const invoiceList = [];
    const invoiceListLocal: Invoice[] = await this._http.makeRequest(
      UrlConstants.INVOICE_LIST_URL,
      HttpMethods.GET
    );

    if (invoiceListLocal != null) {
      // firebase DB send the data as key & value pair(Object)
      // convert the object to list and assing the key as _id
      Object.entries(invoiceListLocal).map((result) => {
        const valueLocal: Invoice = Object.assign(result[1]); // value
        valueLocal.id = result[0]; // key
        return invoiceList.push(valueLocal);
      });
    }

    this._cache.invoiceList = invoiceList;
    this._loggerService.debug(`getInvoiceFromDB :: ${invoiceList}`);
    return invoiceList;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const invoiceList: Invoice[] = await this.getInvoiceList();
    const selectedInvoice = invoiceList.filter((invoice: Invoice) => {
      return id === null || id === '' || id === invoice.id;
    });
    return selectedInvoice[0];
  }

  async createInvoice(invoiceDetails: Invoice): Promise<Invoice> {
    const invoice = await this.getInvoiceFromDB();
    invoiceDetails.sno = 1000 + invoice.length;

    const result: Invoice = await this._http.makeRequest(
      UrlConstants.INVOICE_LIST_URL,
      HttpMethods.POST,
      invoiceDetails
    );

    await this.getInvoiceFromDB();

    return result;
  }

  async updateInvoice(id: string, invoiceDetails: Invoice): Promise<void> {
    // API url is not working for update
    await this._db
      .list(UrlConstants.INVOICE_LIST_NAME_URL)
      .update(id, invoiceDetails);

    await this.getInvoiceFromDB();
  }

  async deleteInvoice(id: string) {
    // API url is not working for delete
    await this._db.list(UrlConstants.INVOICE_LIST_NAME_URL).remove(id);
    await this.getInvoiceFromDB();
  }
}
