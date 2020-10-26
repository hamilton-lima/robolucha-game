import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDefinitionCodeComponent } from './game-definition-code.component';

describe('GameDefinitionCodeComponent', () => {
  let component: GameDefinitionCodeComponent;
  let fixture: ComponentFixture<GameDefinitionCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDefinitionCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDefinitionCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
