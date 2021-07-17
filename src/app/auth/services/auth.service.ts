import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginModel, AuthModel, LoginResponse } from '../model/auth.model';
import { CacheService } from 'src/app/services/util/cache/cache.service';
import { UrlUIConstants } from 'src/app/constants/url-ui-constants';
import { UserRole } from 'src/app/enum/user-role';


@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {

  private AUTH_DATA_STORAGE = 'AuthDataStorage';
  HAS_LOGGED_IN = 'hasLoggedIn';
  private activeLogoutTimer: any;
  login: LoginModel;

  constructor(
    public storage: Storage,
    private _cache: CacheService,
    private _router: Router,
    private afAuth: AngularFireAuth
  ) {

  }

  async userIsAuthenticated(): Promise<boolean> {
    const user: AuthModel = await this.getCurrentUser();
    return user ? !!user.token : null;
  }

  async userRole(): Promise<string> {
    const user: AuthModel = await this.getCurrentUser();
    return user ? user.role : null;
  }

  async userName(): Promise<string> {
    const user: AuthModel = await this.getCurrentUser();
    return user ? user.userName : null;
    // return this.cache.authDetails.toPromise().then(user => {
    //   return user ? !!user.userName : false;
    // });
  }

  async token(): Promise<string> {
    const user: AuthModel = await this.getCurrentUser();
    return user ? user.token : null;
    // return this.cache.authDetails.toPromise().then(user => {
    //   return user ? !!user.token : false;
    // });
  }

  async getCurrentUser(): Promise<AuthModel> {
    let storedData: any;
    const currentAuthStoredData = this._cache.authDetails;
    if (!currentAuthStoredData) {
      storedData = await this.storage.get(this.AUTH_DATA_STORAGE);
      storedData = JSON.parse(storedData);

      // const authData = new AuthModel(
      //   storedData,
      //   storedData.idToken,
      //   new Date(storedData.expiresIn),
      //   storedData.role
      // );
      this._cache.authDetails = storedData;
      return Promise.resolve(storedData);
    } else {
      return Promise.resolve(currentAuthStoredData);
    }

  }

  async autoLogin(): Promise<boolean> {
    const parsedData = await this.getCurrentUser();

    if (!parsedData) {
      return null;
    }
    // const parsedData = JSON.parse(storedData) as {
    //   _token: string;
    //   tokenExpirationDate: string;
    //   userName: string;
    //   role: string;
    // };

    const expirationTime = new Date(parsedData.tokenExpirationDate);
    if (expirationTime <= new Date()) {
      return null;
    }
    const authDetails = new AuthModel(
      parsedData.userName,
      parsedData.token,
      expirationTime,
      parsedData.role
    );

    if (authDetails) {
      this._cache.authDetails = authDetails;
      this.autoLogout(authDetails.tokenDuration);
    }

    return !!authDetails;

  }

  async loginService(loginForm: LoginModel): Promise<LoginResponse> {
    // const requestBody = {
    //   loginId: loginForm.userName,
    //   password: loginForm.password,
    // };
    // const loginResp: LoginResponse = await this._http.makeRequest(
    //   this.LOGIN_URL,
    //   HttpMethods.POST,
    //   requestBody,
    //   null,
    //   null,
    //   { excludeAuthHeader: true }
    // );
    // await this.setAuthData(loginResp);
    // return loginResp;

    return this.loginWithFirebase(loginForm);
  }

  async loginWithFirebase(loginForm: LoginModel): Promise<LoginResponse> {
    const response = await this.afAuth.signInWithEmailAndPassword(loginForm.userName, loginForm.password);

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    const loginResp = new LoginResponse();
    /* tslint:disable:no-string-literal */
    loginResp.idToken = response.user['za'];
    loginResp.userId = response.user.email;
    loginResp.expiresIn = expireDate.toDateString();
    loginResp.role = UserRole.ADMIN;
    await this.setAuthData(loginResp);

    return loginResp;
  }

  private setAuthData(loginResponse: LoginResponse) {
    const authData = new AuthModel(
      loginResponse.userId,
      loginResponse.idToken,
      new Date(loginResponse.expiresIn),
      loginResponse.role
    );
    this._cache.authDetails = authData;
    this.storeAuthData(authData);
  }

  async logOutService(): Promise<void> {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    await this.afAuth.signOut();

    this._cache.authDetails = null;
    this.storage.clear();
    this.storage.set(this.HAS_LOGGED_IN, false);

    this._router.navigateByUrl(UrlUIConstants.URL_LOGIN);
  }

  private autoLogout(duration: number): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logOutService();
    }, duration);
  }

  private storeAuthData(authData: AuthModel): void {
    this.storage.set(this.AUTH_DATA_STORAGE, JSON.stringify(authData));
    this.storage.set(this.HAS_LOGGED_IN, true);
  }


  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
