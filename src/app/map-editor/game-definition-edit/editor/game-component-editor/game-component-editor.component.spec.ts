import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponentEditorComponent } from './game-component-editor.component';

describe('GameComponentEditorComponent', () => {
  let component: GameComponentEditorComponent;
  let fixture: ComponentFixture<GameComponentEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameComponentEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
