import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesBreedsComponent } from './types-breeds.component';

describe('TypesBreedsComponent', () => {
  let component: TypesBreedsComponent;
  let fixture: ComponentFixture<TypesBreedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesBreedsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypesBreedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
