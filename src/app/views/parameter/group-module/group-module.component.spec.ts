import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupModuleComponent } from './group-module.component';

describe('GroupModuleComponent', () => {
  let component: GroupModuleComponent;
  let fixture: ComponentFixture<GroupModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupModuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
