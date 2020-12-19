import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxMenuComponent } from './box-menu.component';

describe('BoxMenuComponent', () => {
  let component: BoxMenuComponent;
  let fixture: ComponentFixture<BoxMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
