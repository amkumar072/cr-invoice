import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditInvoicePageRoutingModule } from './add-edit-invoice-routing.module';

import { AddEditInvoicePage } from './add-edit-invoice.page';
import { AddEditInvoiceCompComponent } from '../../components/add-edit-invoice-comp/add-edit-invoice-comp.component';
import { AddCustomerComponent } from '../../components/add-customer/add-customer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditInvoicePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AddEditInvoicePage,
    AddEditInvoiceCompComponent,
    AddCustomerComponent
  ]
})
export class AddEditInvoicePageModule { }
