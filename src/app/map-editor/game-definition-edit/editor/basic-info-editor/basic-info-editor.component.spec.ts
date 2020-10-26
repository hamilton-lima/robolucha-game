import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoEditorComponent } from './basic-info-editor.component';

describe('BasicInfoEditorComponent', () => {
  let component: BasicInfoEditorComponent;
  let fixture: ComponentFixture<BasicInfoEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfoEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
