import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPublicGamesComponent } from './list-public-games.component';

describe('ListPublicGamesComponent', () => {
  let component: ListPublicGamesComponent;
  let fixture: ComponentFixture<ListPublicGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPublicGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPublicGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
