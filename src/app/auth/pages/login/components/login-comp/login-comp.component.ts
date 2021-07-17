import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoginModel, LoginResponse } from 'src/app/auth/model/auth.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorConstants } from 'src/app/constants/error-constants';
import { UrlUIConstants } from 'src/app/constants/url-ui-constants';
import { MessageService } from 'src/app/services/util/message/message.service';
import { SpinnerService } from 'src/app/services/util/spinner/spinner.service';

@Component({
  selector: 'app-login-comp',
  templateUrl: './login-comp.component.html',
  styleUrls: ['./login-comp.component.scss'],
})
export class LoginCompComponent implements OnInit {

  form: FormGroup;
  // loginModel = new LoginModel();
  loginModel = new LoginModel('admin@gmail.com', 'admin@123'); // testing purpose

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _storage: Storage,
    private _messageService: MessageService,
    private _spinnerService: SpinnerService
  ) { }

  async ngOnInit() {
    this.checkUserLoggedIn();
    this.formControl();

  }

  formControl() {
    this.form = new FormGroup({
      userName: new FormControl(this.loginModel.userName, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      password: new FormControl(this.loginModel.password, {
        updateOn: 'change',
        validators: [Validators.required],
      })
    });
  }

  async checkUserLoggedIn() {
    const isLogin: boolean = await this._storage.get(this._authService.HAS_LOGGED_IN);
    if (isLogin) {
      this._router.navigateByUrl(UrlUIConstants.URL_HOME);
    }
  }

  async onLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const loginForm: LoginModel = this.form.getRawValue();
      try {
        const loginResponse: LoginResponse = await this._authService.loginService(loginForm);
        if (loginResponse) {
          this._router.navigateByUrl(UrlUIConstants.URL_HOME);

          await this._spinnerService.presentSpinner('Logging in');
          window.location.reload();
        }
      } catch (error) {
        this._messageService.messageErrorAlert(error, ErrorConstants.ERR_CUSTOM);
      }
    }
  }

  onClear() {
    this.form.reset();
  }

}
