import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Organization } from 'src/app/model/organization.model';
import { OrganizationService } from 'src/app/services/organization.service';
import { LoggerService } from 'src/app/services/util/logger/logger.service';
import { Charges, Customer, DutyCalculation, FreightCalculation, Invoice, Product, Status } from 'src/app/model/invoice.model';
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
    private _invoiceService: InvoiceService,
    private _fb: FormBuilder
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
  }

  async fetchOrgDetail(): Promise<void> {
    this.organization = await this._orgService.getOrgDetail();
  }

  formControl() {
    this.form = this._fb.group({
      invoiceNumber: [this.invoice.invoiceNumber, [Validators.required]],
      invoiceDate: [this.invoice.invoiceDate, [Validators.required]],
      poNumber: [this.invoice.poNumber, [Validators.required]],
      poDate: [this.invoice.poDate, [Validators.required]],
      products: this._fb.array([]),
      totalTaxableValue: [this.invoice.totalTaxableValue || 0, [Validators.required]],
      totalCgstValue: [this.invoice.totalCgstValue || 0, [Validators.required]],
      totalSgstValue: [this.invoice.totalSgstValue || 0, [Validators.required]],
      totalFinalValue: [this.invoice.totalFinalValue || 0, [Validators.required]],
    });

    const products: FormArray = this.form.get('products') as FormArray;
    if (!this.isEdit) {
      products.push(this.createNewProductFieldGroup());
    } else {
      this.invoice.products.forEach(product => {
        products.push(this.createNewProductFieldGroup(product));
      });
    }
  }

  recalculateOrderTotal(): void {
    const products: Product[] = this.form.get('products').value;
    let totalTaxableValue = 0, totalCgstValue = 0, totalSgstValue = 0, totalFinalValue = 0;

    products.forEach(({ taxableValue, cgstValue, sgstValue, finalValue }) => {
      if (taxableValue && cgstValue && sgstValue && finalValue) {
        totalTaxableValue += taxableValue;
        totalCgstValue += cgstValue;
        totalSgstValue += sgstValue;
        totalFinalValue += finalValue;
      }
    });

    this.form.patchValue({
      totalTaxableValue,
      totalCgstValue,
      totalSgstValue,
      totalFinalValue
    });
  }

  createNewProductFieldGroup(product?: Product): FormGroup {
    // Destructuring
    const {
      description, hsn, gstPercentage,
      price, quantity, taxableValue, cgstValue,
      sgstValue, finalValue
    } = product || {};

    const products: FormArray = this.form.get('products') as FormArray;
    // Creating a form group for products field.
    const newProductFieldGroup: FormGroup = this._fb.group({
      description: [description, [Validators.required]],
      hsn: [hsn, [Validators.required]],
      gstPercentage: [gstPercentage, [Validators.required]],
      price: [price, [Validators.required]],
      quantity: [quantity, [Validators.required]],
      taxableValue: [taxableValue, [Validators.required]],
      cgstValue: [cgstValue, [Validators.required]],
      sgstValue: [sgstValue, [Validators.required]],
      finalValue: [finalValue, [Validators.required]],
    });

    // Function to update the price fields of the newly created form group.
    const updatePriceFieldValues = (gstPercentage, price, quantity) => {
      if (gstPercentage && price && quantity) {
        const taxableValue = price * quantity;
        const gstValue = (price * gstPercentage / 100) * quantity;
        const cgstValue = gstValue / 2;
        const sgstValue = gstValue / 2;
        const finalValue = taxableValue + gstValue;

        newProductFieldGroup.patchValue({
          taxableValue, cgstValue, sgstValue, finalValue
        });
      } else {
        newProductFieldGroup.patchValue({
          taxableValue: '',
          cgstValue: '',
          sgstValue: '',
          finalValue: '',
        });
      }

      this.recalculateOrderTotal();
    };


    // Subscribing to the fields whose change would modify the final price of the product.
    newProductFieldGroup.get('gstPercentage').valueChanges
      .subscribe(gstPercentage => {
        const { price, quantity } = newProductFieldGroup.value;
        updatePriceFieldValues(gstPercentage, price, quantity);
      });

    newProductFieldGroup.get('price').valueChanges
      .subscribe(price => {
        const { gstPercentage, quantity } = newProductFieldGroup.value;
        updatePriceFieldValues(gstPercentage, price, quantity);
      });

    newProductFieldGroup.get('quantity').valueChanges
      .subscribe(quantity => {
        const { gstPercentage, price } = newProductFieldGroup.value;
        updatePriceFieldValues(gstPercentage, price, quantity);
      });

    return newProductFieldGroup;
  }

  addNewProductFieldsToForm(): void {
    const products: FormArray = this.form.get('products') as FormArray;
    products.push(this.createNewProductFieldGroup());
  }

  removeProductFieldsToForm(index: number): void {
    const products: FormArray = this.form.get('products') as FormArray;
    if (products.length > 1) {
      products.removeAt(index);
      this.recalculateOrderTotal();
    } else {
      this._toastUtilService.presentToast('Atleast one product should be present');
    }
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

  async onCancel() {
    this._navCtrl.navigateBack(UrlUIConstants.URL_HOME);
  }

}
