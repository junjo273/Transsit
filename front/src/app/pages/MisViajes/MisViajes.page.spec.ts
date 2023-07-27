import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MisViajesPage } from './MisViajes.page';

describe('MisViajesPage', () => {
  let component: MisViajesPage;
  let fixture: ComponentFixture<MisViajesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisViajesPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MisViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
