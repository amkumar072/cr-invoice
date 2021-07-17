import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppConstants } from 'src/app/constants/app-constants';
import { Customer } from 'src/app/model/invoice.model';
import { ModalUtilService } from 'src/app/services/util/modal/modal-util.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {

  form: FormGroup;
  @Input() customer: Customer;

  constructor(
    private _modalCtrl: ModalUtilService
  ) { }

  ngOnInit() {
    this.customerFormGroup();
  }

  customerFormGroup(): void {
    this.form = new FormGroup({
      firstName: new FormControl(this.customer.firstName, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      lastName: new FormControl(this.customer.lastName, {
        updateOn: 'change',
      }),
      email: new FormControl(this.customer.email, {
        updateOn: 'change',
      }),
      phoneNumber: new FormControl(this.customer.phoneNumber, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      addressLine1: new FormControl(this.customer.addressLine1, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      addressLine2: new FormControl(this.customer.addressLine2, {
        updateOn: 'change',
      }),
      city: new FormControl(this.customer.city, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      state: new FormControl(this.customer.state, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      country: new FormControl(this.customer.country, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      pincode: new FormControl(this.customer.pincode, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      gstNumber: new FormControl(this.customer.gstNumber, {
        updateOn: 'change',
      }),
    });
  }

  async onClick(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const formResponse: any = this.form.getRawValue();

      this._modalCtrl.dismissPresentModal(formResponse, AppConstants.CONFIRM_MODAL);
    }
  }

  dismissComp() {
    this._modalCtrl.dismissPresentModal(null, AppConstants.CANCEL_MODAL);
  }

}
