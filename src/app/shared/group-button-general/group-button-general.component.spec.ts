import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupButtonGeneralComponent } from './group-button-general.component';

describe('GroupButtonGeneralComponent', () => {
  let component: GroupButtonGeneralComponent;
  let fixture: ComponentFixture<GroupButtonGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupButtonGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupButtonGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
