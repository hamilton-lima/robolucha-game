import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuchadorPreviewNewComponent } from './luchador-preview-new.component';

describe('LuchadorPreviewNewComponent', () => {
  let component: LuchadorPreviewNewComponent;
  let fixture: ComponentFixture<LuchadorPreviewNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuchadorPreviewNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuchadorPreviewNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
