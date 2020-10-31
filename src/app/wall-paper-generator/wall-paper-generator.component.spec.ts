import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallPaperGeneratorComponent } from './wall-paper-generator.component';

describe('WallPaperGeneratorComponent', () => {
  let component: WallPaperGeneratorComponent;
  let fixture: ComponentFixture<WallPaperGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallPaperGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallPaperGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
