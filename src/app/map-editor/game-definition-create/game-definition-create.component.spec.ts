import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDefinitionCreateComponent } from './game-definition-create.component';

describe('GameDefinitionCreateComponent', () => {
  let component: GameDefinitionCreateComponent;
  let fixture: ComponentFixture<GameDefinitionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDefinitionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDefinitionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
