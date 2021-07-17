import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core/dist/types/components/modal/modal-interface';
import { AppConstants } from 'src/app/constants/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ModalUtilService {

  constructor(
    private _modalCtrl: ModalController
  ) { }

  async presentModal(opts?: ModalOptions) {
    const modal = await this._modalCtrl.create({
      cssClass: opts.cssClass ? opts.cssClass : AppConstants.MODAL_FULL_SCREEN,
      component: opts.component,
      componentProps: opts.componentProps,
      backdropDismiss: opts.backdropDismiss ? opts.backdropDismiss : true,
      swipeToClose: opts.swipeToClose ? opts.backdropDismiss : true,
      presentingElement: await this._modalCtrl.getTop()
    });
    await modal.present();
    return modal.onDidDismiss();
  }

  async dismissPresentModal(data?: any, role?: string) {
    await this._modalCtrl.dismiss(data, role);
  }
}
