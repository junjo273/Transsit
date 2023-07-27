import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { registerPage } from './register.page';

describe('registerPage', () => {
  let component: registerPage;
  let fixture: ComponentFixture<registerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [registerPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(registerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
