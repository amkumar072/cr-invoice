import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonSearchbar, ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AppConstants } from 'src/app/constants/app-constants';
import { UrlUIConstants } from 'src/app/constants/url-ui-constants';
import { Invoice, Status } from 'src/app/model/invoice.model';
import { Organization } from 'src/app/model/organization.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { ModalUtilService } from 'src/app/services/util/modal/modal-util.service';
import { PdfService } from 'src/app/services/util/pdf/pdf.service';
import { InvoiceViewComponent } from '../invoice-view/invoice-view.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {

  statusLocal = [];
  dataLength = 0;
  invoice: Invoice[] = [];

  // displayedColumns: string[] = ['sno', 'invoiceNumber', 'customer', 'date', 'total', 'status', 'action'];
  displayedColumns: string[] = ['sno', 'invoiceNumber', 'customer', 'total', 'status', 'action'];
  dataSource: MatTableDataSource<Invoice>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('mySearchBar', { static: true }) searchbar: IonSearchbar;

  @Input() reload: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(
    private _invoiceService: InvoiceService,
    private _actionSheetService: ActionSheetController,
    private _alertService: AlertController,
    private _navCtrl: NavController,
    // private _excelService: ExcelService,
    private _modalUtilService: ModalUtilService,
    private _orgService: OrganizationService,
    private _pdfService: PdfService,
  ) { }

  async ngOnInit() {
    this.reload.subscribe(result => {
      if (result) {
        this.fetchAll();
      }
    });
    this.statusEnumArray();

  }

  async fetchAll() {
    const local: Invoice[] = await this._invoiceService.getInvoiceList();
    this.invoice = local;
    this.dataSource = new MatTableDataSource(local);
    this.dataLength = local.length;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.searchbar.value = '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  statusEnumArray(): any {
    Object.keys(Status).map((valueResult) => {
      this.statusLocal.push({
        id: valueResult,
        name: valueResult.charAt(0).toUpperCase() + valueResult.slice(1).toLowerCase()
      });
    });

  }

  statusSelectChange(event) {
    const orderStatus = event.detail.value;
    if (orderStatus === Status.ALL) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = orderStatus.trim();
    }

  }

  async presentActionSheet(element) {
    const actionSheet = await this._actionSheetService.create({
      header: 'Action',
      buttons: this.actionSheetButtons(element)
    });
    await actionSheet.present();
  }

  private actionSheetButtons(invoice: Invoice) {
    const button = [];
    if (invoice.status === Status.QUOTE) {
      button.push(
        {
          text: 'Edit',
          icon: 'create-outline',
          cssClass: 'action-sheet-edit',
          handler: () => {
            this._navCtrl.navigateForward(UrlUIConstants.URL_INVOICE_ADD_EDIT + invoice.id, { skipLocationChange: true });
          }
        },
        {
          text: 'Complete Order',
          icon: 'trophy-outline',
          cssClass: 'action-sheet-success',
          handler: () => {
            this.completeAlert(invoice);
          }
        },
        {
          text: 'Cancel Order',
          icon: 'trash-outline',
          cssClass: 'action-sheet-delete',
          handler: () => {
            this.cancelAlert(invoice);
          }
        }
      );
    }

    // TODO: Remove this button
    button.push({
      text: 'Download',
      icon: 'cloud-download-outline',
      cssClass: 'action-sheet-primary',
      handler: async () => {
        const orgDetails: Organization = await this._orgService.getOrgDetail();
        // PDF will work only browser. If you convert as app, have to implement on file download in ionic way
        this._pdfService.generateInvoice(invoice, orgDetails, invoice.customer, 'download');
        // this._pdfService.generateInvoice(invoice, orgDetails, invoice.customer, 'open');
      }
    });

    // finally add close button
    button.push({
      text: 'Close',
      icon: 'close',
      cssClass: 'action-sheet-close',
      role: 'cancel',
      handler: () => { }
    },
      //  {
      //   text: 'Delete',
      //   role: 'destructive',
      //   icon: 'trash',
      //   handler: () => {
      //     // this.deleteAlert(order.id);
      //   }
      // },
    );
    return button;
  }

  async cancelAlert(invoice: Invoice) {
    const alert = await this._alertService.create({
      header: 'Delete',
      message: 'Sure! Cancel the Quote?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            invoice.status = Status.CANCEL;
            this._invoiceService.updateInvoice(invoice.id, invoice).then((res) => {
              this.fetchAll();
            });
          },
        },
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }


  async completeAlert(invoice: Invoice) {
    const alert = await this._alertService.create({
      header: 'Completed',
      message: 'Sure! Complete the Invoice?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Complete',
          handler: () => {
            invoice.status = Status.COMPLETED;
            this._invoiceService.updateInvoice(invoice.id, invoice).then((res) => {
              this.fetchAll();
            });
          },
        },
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  updateStatus(id: string, orderStatus: Status) {
    // this._invoiceService.updateOrderStatus(id, orderStatus).subscribe((res) => {
    //   this.fetchAll();
    // });
  }

  exportAsXLSX(): void {
    // this._excelService.exportAsExcelFile(this.invoice, 'invoice');
  }

  async onViewInvoice(id: string): Promise<void> {
    // const id = invoice.id;
    const result = await this._modalUtilService.presentModal({
      component: InvoiceViewComponent,
      componentProps: { id },
      cssClass: AppConstants.MODAL_FULL_SCREEN
    });

    // if (result && result.role === AppConstants.CONFIRM_MODAL) {
    //   this.customer = result.data;
    // }
  }


  ngOnDestroy() {
  }

}
