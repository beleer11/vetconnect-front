import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePetComponent } from './type-pet.component';

describe('TypePetComponent', () => {
  let component: TypePetComponent;
  let fixture: ComponentFixture<TypePetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypePetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypePetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
