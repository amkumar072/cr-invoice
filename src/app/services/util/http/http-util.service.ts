import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ErrorConstants } from 'src/app/constants/error-constants';
import { AppError } from 'src/app/model/app-error';
import { HttpMethods, HttpRequestOptions } from 'src/app/model/http';
import { environment } from 'src/environments/environment';
import { LoggerService } from '../logger/logger.service';
import { SpinnerService } from '../spinner/spinner.service';
import { ToastUtilService } from '../toast/toast-util.service';

interface IRequestOptions {
  body?: any;
  headers?: HttpHeaders;
  reportProgress?: boolean;
  params?: HttpParams;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpUtilService {
  constructor(
    private _http: HttpClient,
    private _logger: LoggerService,
    private _toastService: ToastUtilService,
    private _spinnerService: SpinnerService,
    private _injector: Injector
  ) { }

  async makeExternalRequest(
    requestUrl: string,
    method: HttpMethods,
    requestBody?: any,
    queryParams?: object,
    requestHeaders?: HttpHeaders,
    { hideSpinner, spinnerMessage, spinnerOptions }: HttpRequestOptions = {
      hideSpinner: false,
    }
  ): Promise<any> {
    // Set Request Headers
    let headers: HttpHeaders = requestHeaders || new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    // Set Query Params
    let params: HttpParams = new HttpParams();
    if (queryParams) {
      for (const key in queryParams) {
        if (key && queryParams.hasOwnProperty(key)) {
          params = params.set(key, queryParams[key]);
        }
      }
    }

    // Set Request Options
    const requestOptions: IRequestOptions = {
      body: requestBody,
      headers,
      params,
    };

    let spinnerId: string;
    if (!hideSpinner) {
      spinnerId = await this._spinnerService.presentSpinner(
        spinnerMessage,
        spinnerOptions,
        requestUrl
      );
    }

    this._logger.debug(
      `HTTP Request`,
      `\nMethod: ${method}`,
      `\nUrl: ${requestUrl}`,
      `\nOptions: `,
      requestOptions
    );

    try {
      const response: any = await this._http
        .request(method, requestUrl, requestOptions)
        .toPromise();
      this._logger.debug(`HTTP Response: `, response);

      if (!hideSpinner) {
        await this._spinnerService.dismissSpinner(spinnerId, requestUrl);
      }

      return response;
    } catch (err) {
      this._logger.error(err);
      await this._spinnerService.dismissSpinner(spinnerId);
      // if (!hideSpinner) {
      //   await this.spinnerService.hideSpinner(spinnerType);
      // }

      const errorResponse: AppError = this.handleHttpError(err);
      return Promise.reject(errorResponse);
    }
  }

  async makeRequest(
    url: string,
    requestMethod: HttpMethods,
    requestBody?: any,
    queryParams?: object,
    requestHeaders?: HttpHeaders,
    options?: HttpRequestOptions
  ): Promise<any> {
    const requestURL = environment.firebase.databaseURL + url;

    requestHeaders = requestHeaders || new HttpHeaders();
    /*
    if (options.excludeAuthHeader === true) {
      requestHeaders = requestHeaders.append(
        'Authorization',
        `Bearer ${this.sessionService.getAccessToken()}`
      );
    }
    */
    return this.makeExternalRequest(
      requestURL,
      requestMethod,
      requestBody,
      queryParams,
      requestHeaders,
      options
    );
  }

  /*
  async makeMultiPartRequest(
    baseURL: string,
    path: string,
    method: HttpRequestMethods,
    requestBody?: FormData,
    queryParams?: object,
    requestHeaders?: HttpHeaders,
    { hideSpinner = true, spinnerType = SpinnerType.BLOCKING } = {}
  ) {
    const requestURL = environment.apiServerURL + baseURL + path;

    // Set Request Headers
    const headers: HttpHeaders = requestHeaders || new HttpHeaders();
    // headers = headers.set('Content-Type', 'multipart/form-data');

    // Set Query Params
    let params: HttpParams = new HttpParams();
    if (queryParams) {
      for (const key in queryParams) {
        if (key && queryParams.hasOwnProperty(key)) {
          this.logger.debug(`${key} ${queryParams[key]}`);
          params = params.set(key, queryParams[key]);
        }
      }
    }

    // Set Request Options
    const requestOptions: IRequestOptions = {
      body: requestBody,
      headers,
      params,
    };

    if (!hideSpinner) {
      await this.spinnerService.presentSpinner(spinnerType);
    }

    try {
      const response: any = await this.http
        .request(method, requestURL, requestOptions)
        .toPromise()
        .then((res) => res);
      this.logger.debug(`Response: `, response);

      if (!hideSpinner) {
        await this.spinnerService.hideSpinner(spinnerType);
      }

      if (response.isSuccess) {
        return response.data;
      } else {
        return Promise.reject(
          new AppError(response.error.code, response.error.description)
        ); // add error message and code
      }
    } catch (err) {
      this.logger.error(err);
      if (!hideSpinner) {
        await this.spinnerService.hideSpinner(spinnerType);
      }

      const errorResponse: AppError = this.handleHttpError(err);
      return Promise.reject(errorResponse);
    }
  }

  async makeSecureMultiPartRequest(
    url: string,
    path: string,
    requestMethod: HttpRequestMethods,
    requestBody?: FormData,
    queryParams?: object,
    requestHeaders?: HttpHeaders,
    spinnerConfig?: SpinnerConfig
  ) {
    requestHeaders = requestHeaders || new HttpHeaders();
    requestHeaders = requestHeaders.append(
      'Authorization',
      `Bearer ${this.sessionService.getAccessToken()}`
    );
    return this.makeMultiPartRequest(
      url,
      path,
      requestMethod,
      requestBody,
      queryParams,
      requestHeaders,
      spinnerConfig
    );
  }
  */

  private handleHttpError(err: any): AppError {
    let appError: AppError = new AppError();
    switch (err.status) {
      case 401:
        this._toastService.presentToast(ErrorConstants.ERR_UNAUTHENTICATED);
        // const _authService: AuthService = this._injector.get(AuthService);
        // _authService.logOutService();
        break;
      case 500:
        this._toastService.presentToast(ErrorConstants.ERR_CUSTOM);
        appError = new AppError(
          null,
          ErrorConstants.ERR_GENERIC_CODE,
          ErrorConstants.ERR_GENERIC_MSG
        );
        break;
      default:
        appError = new AppError(null, err.errorCode, err.errorMessage);
        break;
    }

    return appError;
  }
}
