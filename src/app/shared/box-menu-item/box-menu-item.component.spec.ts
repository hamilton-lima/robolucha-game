import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxMenuItemComponent } from './box-menu-item.component';

describe('BoxMenuItemComponent', () => {
  let component: BoxMenuItemComponent;
  let fixture: ComponentFixture<BoxMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxMenuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
