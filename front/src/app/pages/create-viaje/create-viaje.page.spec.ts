import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateViajePage } from './create-viaje.page';

describe('CreateViajePage', () => {
  let component: CreateViajePage;
  let fixture: ComponentFixture<CreateViajePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
