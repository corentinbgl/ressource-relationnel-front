import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressionComponent } from './progression.component';

describe('ProgressionComponent', () => {
  let component: ProgressionComponent;
  let fixture: ComponentFixture<ProgressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
