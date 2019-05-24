import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorPanelComponent } from './code-editor-panel.component';

describe('CodeEditorPanelComponent', () => {
  let component: CodeEditorPanelComponent;
  let fixture: ComponentFixture<CodeEditorPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeEditorPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
