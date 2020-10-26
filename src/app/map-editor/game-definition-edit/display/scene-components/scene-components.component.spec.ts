import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneComponentsComponent } from './scene-components.component';

describe('SceneComponentsComponent', () => {
  let component: SceneComponentsComponent;
  let fixture: ComponentFixture<SceneComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
