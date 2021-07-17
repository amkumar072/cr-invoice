import { Injectable } from '@angular/core';
import { AuthModel } from 'src/app/auth/model/auth.model';
import { Invoice } from 'src/app/model/invoice.model';
import { Organization } from 'src/app/model/organization.model';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  authDetails: AuthModel;

  invoiceList: Invoice[];
  organization: Organization;

  constructor() { }
}
