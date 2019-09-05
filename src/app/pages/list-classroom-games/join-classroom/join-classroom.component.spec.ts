import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinClassroomComponent } from './join-classroom.component';

describe('JoinClassroomComponent', () => {
  let component: JoinClassroomComponent;
  let fixture: ComponentFixture<JoinClassroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinClassroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
