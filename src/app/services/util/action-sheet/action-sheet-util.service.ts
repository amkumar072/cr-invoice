import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core/dist/types/components/action-sheet/action-sheet-interface';

@Injectable({
  providedIn: 'root'
})
export class ActionSheetUtilService {

  constructor(
    private _actionSheetCtrl: ActionSheetController
  ) { }

  async presentActionSheet(opts?: ActionSheetOptions) {
    const actionSheet = await this._actionSheetCtrl.create({
      header: opts.header,
      subHeader: opts.subHeader,
      cssClass: 'action-sheet-css',
      buttons: opts.buttons,
      backdropDismiss: opts.backdropDismiss,
      keyboardClose: opts.keyboardClose = true
    });

    return await actionSheet.present();
  }
}
