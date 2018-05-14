import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicsMenuComponent } from './clinics-menu.component';

describe('ClinicsMenuComponent', () => {
  let component: ClinicsMenuComponent;
  let fixture: ComponentFixture<ClinicsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
