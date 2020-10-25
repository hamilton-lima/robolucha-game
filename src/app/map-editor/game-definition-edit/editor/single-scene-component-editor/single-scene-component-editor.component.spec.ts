import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSceneComponentEditorComponent } from './single-scene-component-editor.component';

describe('SingleSceneComponentEditorComponent', () => {
  let component: SingleSceneComponentEditorComponent;
  let fixture: ComponentFixture<SingleSceneComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSceneComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSceneComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
