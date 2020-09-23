import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantPlayComponent } from './cant-play.component';

describe('CantPlayComponent', () => {
  let component: CantPlayComponent;
  let fixture: ComponentFixture<CantPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
