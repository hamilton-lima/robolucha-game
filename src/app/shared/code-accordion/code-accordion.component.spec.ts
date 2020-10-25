import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeAccordionComponent } from './code-accordion.component';

describe('CodeAccordionComponent', () => {
  let component: CodeAccordionComponent;
  let fixture: ComponentFixture<CodeAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
