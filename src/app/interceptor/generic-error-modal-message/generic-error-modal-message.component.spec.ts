import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericErrorModalMessageComponent } from './generic-error-modal-message.component';

describe('GenericErrorModalMessageComponent', () => {
  let component: GenericErrorModalMessageComponent;
  let fixture: ComponentFixture<GenericErrorModalMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericErrorModalMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericErrorModalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
