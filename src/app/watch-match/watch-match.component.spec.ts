import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchMatchComponent } from './watch-match.component';

describe('WatchMatchComponent', () => {
  let component: WatchMatchComponent;
  let fixture: ComponentFixture<WatchMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
