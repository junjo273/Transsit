import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CambiarDatosPage } from './cambiar-datos.page';

describe('CambiarDatosPage', () => {
  let component: CambiarDatosPage;
  let fixture: ComponentFixture<CambiarDatosPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(CambiarDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
