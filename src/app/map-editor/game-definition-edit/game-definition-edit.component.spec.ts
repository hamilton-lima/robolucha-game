import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDefinitionEditComponent } from './game-definition-edit.component';

describe('GameDefinitionEditComponent', () => {
  let component: GameDefinitionEditComponent;
  let fixture: ComponentFixture<GameDefinitionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDefinitionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDefinitionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
