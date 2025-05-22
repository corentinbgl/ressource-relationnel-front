import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRessourceComponent } from './create-ressource.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateRessourceComponent', () => {
  let component: CreateRessourceComponent;
  let fixture: ComponentFixture<CreateRessourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRessourceComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
