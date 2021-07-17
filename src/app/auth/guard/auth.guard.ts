import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UrlUIConstants } from 'src/app/constants/url-ui-constants';
import { UserUtilService } from '../services/user-util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _userUtilService: UserUtilService,
    private _route: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isUserAuthenticated(next);
  }

  private async isUserAuthenticated(route: ActivatedRouteSnapshot): Promise<boolean> {
    const result: boolean = await this._userUtilService.userAuthenticationUtil(route);
    if (!result) {
      this._route.navigateByUrl(UrlUIConstants.URL_LOGIN);
    }
    return result;
  }
}
