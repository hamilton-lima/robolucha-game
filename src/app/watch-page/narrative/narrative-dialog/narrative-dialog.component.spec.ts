import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeDialogComponent } from './narrative-dialog.component';

describe('NarrativeDialogComponent', () => {
  let component: NarrativeDialogComponent;
  let fixture: ComponentFixture<NarrativeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NarrativeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NarrativeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
