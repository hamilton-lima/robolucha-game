import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskEditorComponent } from './mask-editor.component';

describe('MaskEditorComponent', () => {
  let component: MaskEditorComponent;
  let fixture: ComponentFixture<MaskEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaskEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
