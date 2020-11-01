import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDefinitionSuggestedCodeEditorComponent } from './game-definition-suggested-code-editor.component';

describe('GameDefinitionSuggestedCodeEditorComponent', () => {
  let component: GameDefinitionSuggestedCodeEditorComponent;
  let fixture: ComponentFixture<GameDefinitionSuggestedCodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDefinitionSuggestedCodeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDefinitionSuggestedCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
