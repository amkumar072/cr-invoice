import { Injectable } from '@angular/core';
import { Organization } from '../model/organization.model';
import { CacheService } from './util/cache/cache.service';
import { LoggerService } from './util/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private _cache: CacheService,
    private _loggerService: LoggerService
  ) { }

  async getOrgDetail(): Promise<Organization> {
    let org: Organization = this._cache.organization;
    if (org == null) {
      org = await this.getOrgDetailFromDB();
    }
    return org;
  }

  async getOrgDetailFromDB(): Promise<Organization> {
    const org = new Organization();
    org.id = 'b365d628-7e41-4947-82ff-1d4f040a0d7f';
    org.companyName = 'Creative Power';
    org.firstName = 'Anandan';
    org.lastName = '';
    org.email = 'creativepower04@gmail.com';
    org.phoneNumber = 9444301381;
    org.addressLine1 = '44, Gandhi Road';
    org.addressLine2 = 'Porur';
    org.city = 'Chennai';
    org.state = 'Tamil Nadu';
    org.country = 'India';
    org.pincode = 600116;
    org.gstNumber = '1231231232';


    this._cache.organization = org;
    this._loggerService.debug(`getOrgDetailFromDB :: ${org}`);

    return org;
  }


}
