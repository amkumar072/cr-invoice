import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditInvoiceCompComponent } from './add-edit-invoice-comp.component';

describe('AddEditInvoiceCompComponent', () => {
  let component: AddEditInvoiceCompComponent;
  let fixture: ComponentFixture<AddEditInvoiceCompComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditInvoiceCompComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditInvoiceCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
