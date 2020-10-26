import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDefinitionCardComponent } from './game-definition-card.component';

describe('GameDefinitionCardComponent', () => {
  let component: GameDefinitionCardComponent;
  let fixture: ComponentFixture<GameDefinitionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDefinitionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDefinitionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
