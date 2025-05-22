import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerateRessourcesComponent } from './moderate-ressources.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModerateRessourcesComponent', () => {
  let component: ModerateRessourcesComponent;
  let fixture: ComponentFixture<ModerateRessourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerateRessourcesComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModerateRessourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
