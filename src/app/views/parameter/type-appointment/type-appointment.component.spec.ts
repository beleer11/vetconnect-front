import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAppointmentComponent } from './type-appointment.component';

describe('TypeAppointmentComponent', () => {
  let component: TypeAppointmentComponent;
  let fixture: ComponentFixture<TypeAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeAppointmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
