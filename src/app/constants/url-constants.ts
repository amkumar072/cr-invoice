import { environment } from 'src/environments/environment';

export class UrlConstants {

  // API
  public static readonly INVOICE_LIST_URL = `/${environment.dbPrefix}/invoice.json`;

  public static readonly INVOICE_LIST_NAME_URL = `/${environment.dbPrefix}/invoice`;



}
