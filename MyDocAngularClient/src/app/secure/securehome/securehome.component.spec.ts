import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurehomeComponent } from './securehome.component';

describe('SecurehomeComponent', () => {
  let component: SecurehomeComponent;
  let fixture: ComponentFixture<SecurehomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurehomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurehomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
