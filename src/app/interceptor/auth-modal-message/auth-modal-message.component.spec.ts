import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModalMessageComponent } from './auth-modal-message.component';

describe('AuthModalMessageComponent', () => {
  let component: AuthModalMessageComponent;
  let fixture: ComponentFixture<AuthModalMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthModalMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthModalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
