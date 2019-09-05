import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskEditorDetailComponent } from './mask-editor-detail.component';

describe('MaskEditorDetailComponent', () => {
  let component: MaskEditorDetailComponent;
  let fixture: ComponentFixture<MaskEditorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaskEditorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskEditorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
