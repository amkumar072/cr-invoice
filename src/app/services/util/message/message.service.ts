import { Injectable } from '@angular/core';
import { ErrorConstants } from 'src/app/constants/error-constants';
import { AppError } from 'src/app/model/app-error';
import { AlertUtilService } from '../alert/alert-util.service';
import { ToastUtilService } from '../toast/toast-util.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private _toastUtilService: ToastUtilService,
    private _alertUtilService: AlertUtilService
  ) { }

  public messageErrorAlert(error: AppError, message?: string): void {
    if (message) {
      this._alertUtilService.presentAlert({ message });
    } else {
      const errorMessage = error.errorCode ? ErrorConstants[error.errorCode] : ErrorConstants.ERR_GENERIC_EXCEPTION;
      this._alertUtilService.presentAlert({ message: errorMessage });
    }
  }

  public messageSuccessAlert(message: string): void {
    this._alertUtilService.presentAlert({ message });
  }

  public messageErrorToast(error: AppError, message?: string): void {
    if (message) {
      this._toastUtilService.presentToast(message);
    } else {
      const errorMessage = error.errorCode ? ErrorConstants[error.errorCode] : ErrorConstants.ERR_GENERIC_EXCEPTION;
      this._toastUtilService.presentToast(errorMessage);
    }
  }

  public messageSuccessToast(message: string): void {
    this._toastUtilService.presentToast(message);
  }
}
