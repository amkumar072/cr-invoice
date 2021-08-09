import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AppConstants } from 'src/app/constants/app-constants';
import { UrlUIConstants } from 'src/app/constants/url-ui-constants';
import { Invoice, Customer, DutyCalculation, FreightCalculation, Charges, Status, Product } from 'src/app/model/invoice.model';
import { Organization } from 'src/app/model/organization.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { ModalUtilService } from 'src/app/services/util/modal/modal-util.service';
import { PdfService } from 'src/app/services/util/pdf/pdf.service';
import { SpinnerService } from 'src/app/services/util/spinner/spinner.service';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
})
export class InvoiceViewComponent implements OnInit {


  form: FormGroup;
  @Input() id: string;
  invoice = new Invoice();
  customer = new Customer();
  dutyCalculationLocal = new DutyCalculation();
  freightCalculationLocal = new FreightCalculation();
  customizeChargesLocal = new Charges();
  additionalChargesLocal = new Charges();
  annualMaintainanceChargesLocal = new Charges();


  organization: Organization;

  displayButtonText: string;
  isEdit = false;
  customerDetailsError = false;
  visibleEditCustomerButton = false;


  constructor(
    private _invoiceService: InvoiceService,
    private _modalUtilService: ModalUtilService,
    private _spinnerService: SpinnerService,
    private _navCtrl: NavController,
    private _orgService: OrganizationService,
    private _pdfService: PdfService,
    private _fb: FormBuilder,
  ) { }

  async ngOnInit() {

    await this.fetchInvoiceDetial(this.id);
  }

  async fetchInvoiceDetial(id: string): Promise<void> {
    const spinnerLocal = await this._spinnerService.presentSpinner(AppConstants.INVOICE);

    this.invoice = await this._invoiceService.getInvoiceById(id);
    this.customer = this.invoice.customer;
    // TODO-loges

    if (this.invoice.status === Status.QUOTE) {
      this.visibleEditCustomerButton = true;
    } else {
      this.visibleEditCustomerButton = false;
    }

    this.formControl();

    await this._spinnerService.dismissSpinner(spinnerLocal);
  }

  formControl() {
    this.form = this._fb.group({
      invoiceNumber: [{ value: this.invoice.invoiceNumber, disabled: true }],
      invoiceDate: [{ value: this.invoice.invoiceDate, disabled: true }],
      poNumber: [{ value: this.invoice.poNumber, disabled: true }],
      poDate: [{ value: this.invoice.poDate, disabled: true }],
      products: this._fb.array([]),
      totalTaxableValue: [{ value: this.invoice.totalTaxableValue, disabled: true }],
      totalCgstValue: [{ value: this.invoice.totalCgstValue, disabled: true }],
      totalSgstValue: [{ value: this.invoice.totalSgstValue, disabled: true }],
      totalFinalValue: [{ value: this.invoice.totalFinalValue, disabled: true }],
    });

    const products: FormArray = this.form.get('products') as FormArray;
    this.invoice.products.forEach(product => {
      products.push(this.createNewProductFieldGroup(product));
    });

  }

  createNewProductFieldGroup(product?: Product): FormGroup {
    // Destructuring
    const {
      description, hsn, gstPercentage,
      price, quantity, taxableValue, cgstValue,
      sgstValue, finalValue
    } = product;

    return this._fb.group({
      description: [{ value: description, disabled: true }],
      hsn: [{ value: hsn, disabled: true }],
      gstPercentage: [{ value: gstPercentage, disabled: true }],
      price: [{ value: price, disabled: true }],
      quantity: [{ value: quantity, disabled: true }],
      taxableValue: [{ value: taxableValue, disabled: true }],
      cgstValue: [{ value: cgstValue, disabled: true }],
      sgstValue: [{ value: sgstValue, disabled: true }],
      finalValue: [{ value: finalValue, disabled: true }],
    });
  }

  dutyCalculationFormGroup(): FormGroup {
    return new FormGroup({
      invoiceValue: new FormControl({
        value: this.dutyCalculationLocal.invoiceValue,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      exchangeRate: new FormControl({
        value: this.dutyCalculationLocal.exchangeRate,
        disabled: true
      }, {
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
      cvd: new FormControl({
        value: this.dutyCalculationLocal.cvd,
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
      price: new FormControl({
        value: this.freightCalculationLocal.price,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      weight: new FormControl({
        value: this.freightCalculationLocal.weight,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      discount: new FormControl({
        value: this.freightCalculationLocal.discount,
        disabled: true
      }, {
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
      price: new FormControl({
        value: this.customizeChargesLocal.price,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      discount: new FormControl({
        value: this.customizeChargesLocal.discount,
        disabled: true
      }, {
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
      price: new FormControl({
        value: this.additionalChargesLocal.price,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      discount: new FormControl({
        value: this.additionalChargesLocal.discount,
        disabled: true
      }, {
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
      price: new FormControl({
        value: this.annualMaintainanceChargesLocal.price,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      discount: new FormControl({
        value: this.annualMaintainanceChargesLocal.discount,
        disabled: true
      }, {
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

  onEditCustomer() {
    this.dismissComp();
    this._navCtrl.navigateForward(UrlUIConstants.URL_INVOICE_ADD_EDIT + this.invoice.id, { skipLocationChange: true });
  }

  async onDownload() {
    const orgDetails: Organization = await this._orgService.getOrgDetail();
    // PDF will work only browser. If you convert as app, have to implement on file download in ionic way
    this._pdfService.generateInvoice(this.invoice, orgDetails, this.invoice.customer, 'download');
  }


  dismissComp() {
    this._modalUtilService.dismissPresentModal(null, AppConstants.CANCEL_MODAL);
  }
}
