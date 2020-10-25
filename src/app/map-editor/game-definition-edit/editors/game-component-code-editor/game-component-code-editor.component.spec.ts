import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponentCodeEditorComponent } from './game-component-code-editor.component';

describe('GameComponentCodeEditorComponent', () => {
  let component: GameComponentCodeEditorComponent;
  let fixture: ComponentFixture<GameComponentCodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameComponentCodeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponentCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
