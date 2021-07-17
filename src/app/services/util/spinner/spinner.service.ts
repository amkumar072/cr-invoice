import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core/dist/types/components/loading/loading-interface';
import { LoggerService } from '../logger/logger.service';

interface ISpinner {
  count: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private _spinnerIdToElMap: Map<string, HTMLIonLoadingElement> = new Map();

  constructor(
    private _loadingCtrl: LoadingController,
    private _logger: LoggerService
  ) { }

  async presentSpinner(
    message: string = 'Loading',
    options?: LoadingOptions,
    urlForLogging?: string
  ): Promise<string> {
    const loadinEl = await this._loadingCtrl.create({
      keyboardClose: true,
      message: `${message}...`,
      showBackdrop: this._spinnerIdToElMap.size === 0,
      ...options,
    });
    loadinEl.present();
    const spinnerId = `${Date.now()}_${this._spinnerIdToElMap.size}`;
    this._spinnerIdToElMap.set(spinnerId, loadinEl);
    this._logger.debug(
      `presentSpinner(${urlForLogging}) :: spinner count :: ${this._spinnerIdToElMap.size}`
    );
    return spinnerId;
  }

  async dismissSpinner(
    spinnerId: string,
    urlForLogging?: string
  ): Promise<void> {
    const loadingEl: HTMLIonLoadingElement = this._spinnerIdToElMap.get(
      spinnerId
    );
    this._spinnerIdToElMap.delete(spinnerId);
    this._logger.debug(
      `dismissSpinner(${urlForLogging}) :: spinner count :: ${this._spinnerIdToElMap.size}`
    );
    await loadingEl.dismiss();
  }
}
