import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWebsocketComponent } from './test-websocket.component';

describe('TestWebsocketComponent', () => {
  let component: TestWebsocketComponent;
  let fixture: ComponentFixture<TestWebsocketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestWebsocketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWebsocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
