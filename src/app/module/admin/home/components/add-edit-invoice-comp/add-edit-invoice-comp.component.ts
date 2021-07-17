import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Organization } from 'src/app/model/organization.model';
import { OrganizationService } from 'src/app/services/organization.service';
import { LoggerService } from 'src/app/services/util/logger/logger.service';
import { Charges, Customer, DutyCalculation, FreightCalculation, Invoice, Status } from 'src/app/model/invoice.model';
import { ModalUtilService } from 'src/app/services/util/modal/modal-util.service';
import { AppConstants } from 'src/app/constants/app-constants';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { NavController } from '@ionic/angular';
import { Util } from 'src/app/module/shared/util/util';
import { ToastUtilService } from 'src/app/services/util/toast/toast-util.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SuccessConstants } from 'src/app/constants/success-constants';
import { v4 as uuidv4 } from 'uuid';
import { UrlUIConstants } from 'src/app/constants/url-ui-constants';

@Component({
  selector: 'app-add-edit-invoice-comp',
  templateUrl: './add-edit-invoice-comp.component.html',
  styleUrls: ['./add-edit-invoice-comp.component.scss'],
})
export class AddEditInvoiceCompComponent implements OnInit {

  form: FormGroup;
  invoice = new Invoice();
  customer = new Customer();
  dutyCalculationLocal = new DutyCalculation();
  freightCalculationLocal = new FreightCalculation();
  customizeChargesLocal = new Charges();
  additionalChargesLocal = new Charges();
  annualMaintainanceChargesLocal = new Charges();


  organization: Organization

  displayButtonText: string;
  isEdit = false;
  customerDetailsError = false;


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _loggerService: LoggerService,
    private _orgService: OrganizationService,
    private _modalUtilService: ModalUtilService,
    private _navCtrl: NavController,
    private _toastUtilService: ToastUtilService,
    private _invoiceService: InvoiceService
  ) { }

  async ngOnInit() {
    await this.getId();
    this.fetchOrgDetail();

  }

  async getId(): Promise<void> {
    const idLocal = (await this._activatedRoute.paramMap.pipe(take(1)).toPromise()).get('id');

    this._loggerService.debug(`id ${idLocal}`)

    if (idLocal === '') {
      this.displayButtonText = AppConstants.SAVE;
      this.isEdit = false;

      this.formControl();
    } else {

      // if status is not Quote then allow to edit
      if (this.invoice.status !== Status.QUOTE) {
        this.displayButtonText = AppConstants.UPDATE;
        this.isEdit = true;

        await this.fetchInvoiceDetial(idLocal);
        this.formControl();
      } else {
        const message = `${AppConstants.INVOICE} status is ${Status.COMPLETED}. `
        this._toastUtilService.presentToast(message);
        this.onCancel();
      }

    }
  }

  async fetchInvoiceDetial(id: string): Promise<void> {
    this.invoice = await this._invoiceService.getInvoiceById(id);
    this.customer = this.invoice.customer;
    this.dutyCalculationLocal = this.invoice.dutyCalculation;
    this.freightCalculationLocal = this.invoice.freightCalculation;
    this.customizeChargesLocal = this.invoice.customizeCharges;
    this.additionalChargesLocal = this.invoice.additionalCharges;
    this.annualMaintainanceChargesLocal = this.invoice.annualMaintainanceCharges;
  }

  async fetchOrgDetail(): Promise<void> {
    this.organization = await this._orgService.getOrgDetail();
  }

  formControl() {
    this.form = new FormGroup({
      invoiceNumber: new FormControl(this.invoice.invoiceNumber, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      invoiceDate: new FormControl(this.invoice.invoiceDate, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      dutyCalculation: this.dutyCalculationFormGroup(),
      freightCalculation: this.freightCalculationFormGroup(),
      customizeCharges: this.customizeChargesFormGroup(),
      additionalCharges: this.additionalChargesFormGroup(),
      annualMaintainanceCharges: this.annualMaintainanceChargesFormGroup(),
      total: new FormControl({
        value: this.invoice.total,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  dutyCalculationFormGroup(): FormGroup {
    return new FormGroup({
      invoiceValue: new FormControl(this.dutyCalculationLocal.invoiceValue, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      exchangeRate: new FormControl(this.dutyCalculationLocal.exchangeRate, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      assessiableValue: new FormControl({
        value: this.dutyCalculationLocal.assessiableValue,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      basicTax: new FormControl({
        value: this.dutyCalculationLocal.basicTax,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      cvdTax: new FormControl({
        value: this.dutyCalculationLocal.cvdTax,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      cvd: new FormControl({
        value: this.dutyCalculationLocal.cvd,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      socialWelfareTax: new FormControl({
        value: this.dutyCalculationLocal.socialWelfareTax,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      socialWelfare: new FormControl({
        value: this.dutyCalculationLocal.socialWelfare,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      IGST: new FormControl({
        value: this.dutyCalculationLocal.IGST,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      totalTax: new FormControl({
        value: this.dutyCalculationLocal.totalTax,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      totalValue: new FormControl({
        value: this.dutyCalculationLocal.totalValue,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  freightCalculationFormGroup(): FormGroup {
    return new FormGroup({
      price: new FormControl(this.freightCalculationLocal.price, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      weight: new FormControl(this.freightCalculationLocal.weight, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      discount: new FormControl(this.freightCalculationLocal.discount, {
        updateOn: 'change'
      }),
      weightUnit: new FormControl({
        value: this.freightCalculationLocal.weightUnit,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      subTotal: new FormControl({
        value: this.freightCalculationLocal.subTotal,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      total: new FormControl({
        value: this.freightCalculationLocal.total,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  customizeChargesFormGroup(): FormGroup {
    return new FormGroup({
      price: new FormControl(this.customizeChargesLocal.price, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      discount: new FormControl(this.customizeChargesLocal.discount, {
        updateOn: 'change'
      }),
      total: new FormControl({
        value: this.customizeChargesLocal.total,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  additionalChargesFormGroup(): FormGroup {
    return new FormGroup({
      price: new FormControl(this.additionalChargesLocal.price, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      discount: new FormControl(this.additionalChargesLocal.discount, {
        updateOn: 'change'
      }),
      total: new FormControl({
        value: this.additionalChargesLocal.total,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  annualMaintainanceChargesFormGroup(): FormGroup {
    return new FormGroup({
      price: new FormControl(this.annualMaintainanceChargesLocal.price, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      discount: new FormControl(this.annualMaintainanceChargesLocal.discount, {
        updateOn: 'change'
      }),
      total: new FormControl({
        value: this.annualMaintainanceChargesLocal.total,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }


  async onAddCustomer(): Promise<void> {
    const customerLocal = this.customer;
    const result = await this._modalUtilService.presentModal({
      component: AddCustomerComponent,
      componentProps: { customer: customerLocal },
      cssClass: AppConstants.MODAL_FULL_SCREEN
    });

    if (result && result.role === AppConstants.CONFIRM_MODAL) {
      this.customer = result.data;
    }
  }

  async onDutyCalChanges(): Promise<void> {
    const invoice: Invoice = await this.getRawFormValue();


    const invoiceValue = invoice.dutyCalculation.invoiceValue; // cost of machine
    const exchangeRate = invoice.dutyCalculation.exchangeRate; // exchange rate
    let assessiableValue = 0; // exchange rate * cost of machine
    let basicTax = 0; // assessiableValue * 10%
    let cvdTax = 0; // Counter value duty= (basicTax * 5%)
    let cvd = 0; // Counter value duty= cvdTax + basicTax
    let socialWelfareTax = 0; // (cvd * 10%)
    let socialWelfare = 0; // (socialWelfareTax + cvd)
    let IGST = 0; // assessiableValue * 18%
    let totalTax = 0; // basicTax + cvd + socialWelfare+ IGST
    let totalValue = 0;


    if (invoiceValue && exchangeRate) {
      assessiableValue = invoiceValue * exchangeRate;
      basicTax = Util.fixedConversion(assessiableValue * (10 / 100));
      cvdTax = Util.fixedConversion((basicTax * (5 / 100)));
      cvd = Util.fixedConversion(cvdTax + basicTax);
      socialWelfareTax = Util.fixedConversion((cvd * (10 / 100)));
      socialWelfare = Util.fixedConversion(socialWelfareTax + cvd);
      IGST = Util.fixedConversion(assessiableValue * (18 / 100));
      totalTax = Util.fixedConversion(basicTax + cvd + socialWelfare + IGST);
      totalValue = Util.fixedConversion(assessiableValue + totalTax);
    }

    this.form.patchValue({
      dutyCalculation: {
        assessiableValue,
        basicTax,
        cvdTax,
        cvd,
        socialWelfareTax,
        socialWelfare,
        IGST,
        totalTax,
        totalValue
      }
    });

    // total value cal after patchvalue is added
    await this.getInvoiceTotal(await this.getRawFormValue());

  }

  async onFreightCalChanges(): Promise<void> {
    const invoice: Invoice = await this.getRawFormValue();

    const price = invoice.freightCalculation.price; // price per kg
    const weight = invoice.freightCalculation.weight;
    let subTotal = 0; // price * weight
    let discount = invoice.freightCalculation.discount ? invoice.freightCalculation.discount : 0;
    let total = 0; // subTotal - total


    if (price && weight) {
      subTotal = Util.fixedConversion(price * weight);

      const discountCheck = await this.discountCheck(subTotal, discount, 'Freight')
      if (discountCheck) {
        discount = 0;
      }

      total = Util.fixedConversion(subTotal - discount);
    }

    this.form.patchValue({
      freightCalculation: {
        weightUnit: 'kg',
        discount,
        subTotal,
        total
      }
    });

    // total value cal after patchvalue is added
    await this.getInvoiceTotal(await this.getRawFormValue());
  }

  async onCustomizeChargesChanages(): Promise<void> {
    const invoice: Invoice = await this.getRawFormValue();

    const price = invoice.customizeCharges.price;
    let discount = invoice.customizeCharges.discount ? invoice.customizeCharges.discount : 0;
    let total = 0; // subTotal - total


    if (price) {
      const discountCheck = await this.discountCheck(price, discount, 'Customize Charges')
      if (discountCheck) {
        discount = 0;
      }

      total = Util.fixedConversion(price - discount);
    }

    this.form.patchValue({
      customizeCharges: {
        discount,
        total
      }
    });

    // total value cal after patchvalue is added
    await this.getInvoiceTotal(await this.getRawFormValue());
  }

  async onAdditionalChargesChanages(): Promise<void> {
    const invoice: Invoice = await this.getRawFormValue();

    const price = invoice.additionalCharges.price;
    let discount = invoice.additionalCharges.discount ? invoice.additionalCharges.discount : 0;
    let total = 0; // subTotal - total


    if (price) {
      const discountCheck = await this.discountCheck(price, discount, 'Additional Charges')
      if (discountCheck) {
        discount = 0;
      }
      total = Util.fixedConversion(price - discount);
    }

    this.form.patchValue({
      additionalCharges: {
        discount,
        total
      }
    });

    // total value cal after patchvalue is added
    await this.getInvoiceTotal(await this.getRawFormValue());
  }

  async onAnnualMaintainanceChargesChanages(): Promise<void> {
    const invoice: Invoice = await this.getRawFormValue();

    const price = invoice.annualMaintainanceCharges.price;
    let discount = invoice.annualMaintainanceCharges.discount ? invoice.annualMaintainanceCharges.discount : 0;
    let total = 0; // subTotal - total


    if (price) {
      const discountCheck = await this.discountCheck(price, discount, 'Annunal Maintainance Charges')
      if (discountCheck) {
        discount = 0;
      }
      total = Util.fixedConversion(price - discount);
    }

    this.form.patchValue({
      annualMaintainanceCharges: {
        discount,
        total
      }
    });

    // total value cal after patchvalue is added
    await this.getInvoiceTotal(await this.getRawFormValue());
  }

  async discountCheck(price: number, discount: number, title: string): Promise<boolean> {
    if (discount >= 0 && discount > price) {
      const message = `${title} - discount is greatet than price`;
      this._toastUtilService.presentToast(message);
      return true;
    }

    return false;
  }

  async onClick(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._toastUtilService.presentToast('Enter Mandatory Details')
      return;
    } else if (this.customer.firstName === undefined) {
      this.customerDetailsError = true
      this._toastUtilService.presentToast('Enter Customer Details');
      return;
    } else {
      if (!this.isEdit) {
        await this.onAdd();
      } else {
        await this.onUpdate();
      }
    }
  }

  async onAdd() {
    const invoice: Invoice = await this.getRawFormValue();

    await this._invoiceService.createInvoice(invoice);
    const message = AppConstants.INVOICE + SuccessConstants.SUCCESS_SAVE;
    this._toastUtilService.presentToast(message);

    this._navCtrl.navigateBack(UrlUIConstants.URL_HOME);
  }

  async onUpdate() {
    const invoice: Invoice = await this.getRawFormValue();

    await this._invoiceService.updateInvoice(invoice.id, invoice);
    const message = AppConstants.INVOICE + SuccessConstants.SUCCESS_UPDATE;
    this._toastUtilService.presentToast(message);

    this._navCtrl.navigateBack(UrlUIConstants.URL_HOME);

  }

  async getRawFormValue(): Promise<Invoice> {
    const invoiceLocal: Invoice = this.form.getRawValue();
    invoiceLocal.customer = this.customer;
    invoiceLocal.status = Status.QUOTE;


    if (this.isEdit) {
      invoiceLocal.id = this.invoice.id;
      invoiceLocal.sno = this.invoice.sno;
    } else {
      invoiceLocal.id = uuidv4();
    }
    return invoiceLocal;
  }

  private async getInvoiceTotal(invoiceLocal: Invoice) {
    invoiceLocal.total = (invoiceLocal.dutyCalculation.totalValue !== undefined ? invoiceLocal.dutyCalculation.totalValue : 0)
      + (invoiceLocal.freightCalculation.total !== undefined ? invoiceLocal.freightCalculation.total : 0)
      + (invoiceLocal.customizeCharges.total !== undefined ? invoiceLocal.customizeCharges.total : 0)
      + (invoiceLocal.additionalCharges.total !== undefined ? invoiceLocal.additionalCharges.total : 0)
      + (invoiceLocal.annualMaintainanceCharges.total !== undefined ? invoiceLocal.annualMaintainanceCharges.total : 0);

    this.form.patchValue({
      total: invoiceLocal.total,
    });
  }

  async onCancel() {
    this._navCtrl.navigateBack(UrlUIConstants.URL_HOME);
  }



}
