import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressionComponent } from './progression.component';
import { of, throwError } from 'rxjs';
import { ProgressionService } from '../../service/progression.service';
import { AuthService } from '../../service/auth.service';

describe('ProgressionComponent', () => {
  let component: ProgressionComponent;
  let fixture: ComponentFixture<ProgressionComponent>;

  const mockProgressionData = [
    { id: 1, favori: true, exploitee: false },
    { id: 2, favori: false, exploitee: true }
  ];

  const mockProgressionService = {
    getForUser: jasmine.createSpy('getForUser').and.returnValue(of(mockProgressionData))
  };

  const mockAuthService = {
    getUserId: jasmine.createSpy('getUserId').and.returnValue(123)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgressionComponent],
      providers: [
        { provide: ProgressionService, useValue: mockProgressionService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // appelle ngOnInit
  });

  
it('should create the component', () => {
    expect(component).toBeTruthy();
  });

   
});
