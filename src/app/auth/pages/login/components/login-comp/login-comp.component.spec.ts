import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginCompComponent } from './login-comp.component';

describe('LoginCompComponent', () => {
  let component: LoginCompComponent;
  let fixture: ComponentFixture<LoginCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginCompComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
