import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AppConstants } from 'src/app/constants/app-constants';
import { UrlUIConstants } from 'src/app/constants/url-ui-constants';
import { Invoice, Customer, DutyCalculation, FreightCalculation, Charges, Status } from 'src/app/model/invoice.model';
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
  ) { }

  async ngOnInit() {

    await this.fetchInvoiceDetial(this.id);
  }

  async fetchInvoiceDetial(id: string): Promise<void> {
    const spinnerLocal = await this._spinnerService.presentSpinner(AppConstants.INVOICE);

    this.invoice = await this._invoiceService.getInvoiceById(id);
    this.customer = this.invoice.customer;
    this.dutyCalculationLocal = this.invoice.dutyCalculation;
    this.freightCalculationLocal = this.invoice.freightCalculation;
    this.customizeChargesLocal = this.invoice.customizeCharges;
    this.additionalChargesLocal = this.invoice.additionalCharges;
    this.annualMaintainanceChargesLocal = this.invoice.annualMaintainanceCharges;

    if (this.invoice.status === Status.QUOTE) {
      this.visibleEditCustomerButton = true;
    } else {
      this.visibleEditCustomerButton = false;
    }

    this.formControl();

    await this._spinnerService.dismissSpinner(spinnerLocal);
  }

  formControl() {
    this.form = new FormGroup({
      invoiceNumber: new FormControl({
        value: this.invoice.invoiceNumber,
        disabled: true
      }, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      invoiceDate: new FormControl({
        value: this.invoice.invoiceDate,
        disabled: true
      }, {
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
