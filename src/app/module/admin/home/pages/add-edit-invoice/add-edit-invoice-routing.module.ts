import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditInvoicePage } from './add-edit-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditInvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditInvoicePageRoutingModule {}
