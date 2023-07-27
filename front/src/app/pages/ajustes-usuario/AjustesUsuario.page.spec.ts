import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AjustesUsuarioPage } from './AjustesUsuario.page';

describe('AjustesUsuarioPage', () => {
  let component: AjustesUsuarioPage;
  let fixture: ComponentFixture<AjustesUsuarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjustesUsuarioPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AjustesUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
