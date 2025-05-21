import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerateRessourcesComponent } from './moderate-ressources.component';

describe('ModerateRessourcesComponent', () => {
  let component: ModerateRessourcesComponent;
  let fixture: ComponentFixture<ModerateRessourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerateRessourcesComponent]
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
