import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClassroomGamesComponent } from './list-classroom-games.component';

describe('ListClassroomGamesComponent', () => {
  let component: ListClassroomGamesComponent;
  let fixture: ComponentFixture<ListClassroomGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListClassroomGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClassroomGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
