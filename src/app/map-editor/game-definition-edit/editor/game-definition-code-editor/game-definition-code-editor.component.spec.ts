import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDefinitionCodeEditorComponent } from './game-definition-code-editor.component';

describe('GameDefinitionCodeEditorComponent', () => {
  let component: GameDefinitionCodeEditorComponent;
  let fixture: ComponentFixture<GameDefinitionCodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDefinitionCodeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDefinitionCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
