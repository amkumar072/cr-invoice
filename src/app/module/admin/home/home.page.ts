import { Component, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UrlUIConstants } from 'src/app/constants/url-ui-constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @Output() reloadHome: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(
    private _authService: AuthService,
    private _navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.reloadHome.next(true);
  }

  doRefresh(event) {
    window.location.reload();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async onAdd() {
    this._navCtrl.navigateForward(UrlUIConstants.URL_INVOICE_ADD_EDIT, { skipLocationChange: true });
    // this._navCtrl.navigateForward('/admin/home/add');
  }

  onSignOut() {
    this._authService.logOutService();
  }
}
