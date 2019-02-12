import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuchadorPreviewComponent } from './luchador-preview.component';

describe('LuchadorPreviewComponent', () => {
  let component: LuchadorPreviewComponent;
  let fixture: ComponentFixture<LuchadorPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuchadorPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuchadorPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
