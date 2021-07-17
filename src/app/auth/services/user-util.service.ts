import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { UrlUIConstants } from 'src/app/constants/url-ui-constants';
import { UserRole } from 'src/app/enum/user-role';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserUtilService {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  async userAuthenticationUtil(route: ActivatedRouteSnapshot): Promise<boolean> {
    let isUserAuth: boolean = await this._authService.userIsAuthenticated();
    if (!isUserAuth) {
      const autoLogin: boolean = await this._authService.autoLogin();
      if (autoLogin) {
        isUserAuth = await this.userAuthorizationUtil(route.data.roles);
        return Promise.resolve(isUserAuth);
      }
    } else {
      isUserAuth = await this.userAuthorizationUtil(route.data.roles);
      return Promise.resolve(isUserAuth);
    }
  }

  async userAuthorizationUtil(rolesList: UserRole[]): Promise<boolean> {
    const role: string = await this._authService.userRole();
    if (role === undefined) {
      // console.log('Role is not defined');
      this._router.navigateByUrl(UrlUIConstants.URL_LOGIN);
    } else if (rolesList && rolesList.length > 0) { // check if route is restricted by role
      // role not authorised so redirect to home page
      let result: boolean;
      // console.debug(`userAuthorizationUtil :: UserUtilService :: rolesList  :: ${rolesList} `);
      // console.debug(`userAuthorizationUtil :: UserUtilService :: UserRole  :: ${role} `);
      rolesList.forEach((roleLocal: UserRole) => {
        if (roleLocal.includes(role)) {
          result = true;
        }
      });
      if (result) {
        return Promise.resolve(true);
      } else {
        console.log('User is not authenticated to view this');
        return Promise.resolve(false);
      }
    } else {
      return Promise.resolve(true);
    }
  }
}
