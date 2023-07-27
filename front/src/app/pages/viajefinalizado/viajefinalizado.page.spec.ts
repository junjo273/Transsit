import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViajefinalizadoPage } from './viajefinalizado.page';

describe('ViajefinalizadoPage', () => {
  let component: ViajefinalizadoPage;
  let fixture: ComponentFixture<ViajefinalizadoPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(ViajefinalizadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
