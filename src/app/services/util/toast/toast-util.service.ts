import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastUtilService {
  constructor(private _toastCtrl: ToastController) {}

  async presentToast(
    message: string,
    duration = 3000,
    position: 'top' | 'bottom' | 'middle' = 'top'
  ) {
    const toast = await this._toastCtrl.create({
      message,
      duration,
      position,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await toast.present();
  }

  async presentUpdateToast() {
    const toast = await this._toastCtrl.create({
      message: 'Update available!',
      position: 'bottom',
      buttons: [
        {
          role: 'cancel',
          text: 'Reload',
        },
      ],
    });

    await toast.present();
    return toast;
  }
}
