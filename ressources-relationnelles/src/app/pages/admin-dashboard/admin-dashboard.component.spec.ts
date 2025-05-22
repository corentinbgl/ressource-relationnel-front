import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { of } from 'rxjs';
import { RessourceService } from '../../service/ressource.service';
import { ProgressionService } from '../../service/progression.service';
import { CommentaireService } from '../../service/commentaire.service';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  const mockRessourceService = {
    getAll: jasmine.createSpy('getAll').and.returnValue(of([
      {
        id: 1,
        categorie: 'Santé',
        type: 'Article',
        dateCreation: new Date().toISOString(),
        suspendue: false
      }
    ]))
  };

  const mockProgressionService = {
    getForUser: jasmine.createSpy('getForUser').and.returnValue(of([
      { favori: true, exploitee: true },
      { favori: false, exploitee: true }
    ]))
  };

  const mockCommentaireService = {
    getByRessource: jasmine.createSpy('getByRessource').and.returnValue(of([{ id: 1 }, { id: 2 }]))
  };

  const mockUserService = {
    getAllUsers: jasmine.createSpy('getAllUsers').and.returnValue(of([{ id: 1 }, { id: 2 }, { id: 3 }]))
  };

  const mockAuthService = {
    currentUser$: of({ id: 1 })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: RessourceService, useValue: mockRessourceService },
        { provide: ProgressionService, useValue: mockProgressionService },
        { provide: CommentaireService, useValue: mockCommentaireService },
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load data and initialize stats', () => {
    expect(mockRessourceService.getAll).toHaveBeenCalled();
    expect(mockCommentaireService.getByRessource).toHaveBeenCalled();
    expect(mockProgressionService.getForUser).toHaveBeenCalledWith(1);
    expect(mockUserService.getAllUsers).toHaveBeenCalled();

    expect(component.totalUtilisateurs).toBe(3);
    expect(component.totalFavoris).toBe(1);
    expect(component.totalExploitees).toBe(2);
    expect(component.totalCommentaires).toBe(2);
    expect(component.ressources.length).toBeGreaterThan(0);
  });

  it('should apply filters correctly', () => {
    component.filters = {
      periode: '7jours',
      categorie: 'Santé',
      typeRessource: 'Article',
      relation: '',
      zone: ''
    };
    component.applyFilters();

    expect(component.ressources.length).toBeGreaterThan(0);
    expect(component.ressources[0].categorie).toBe('Santé');
  });

  it('should export stats to CSV', () => {
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    const clickSpy = jasmine.createSpy('click');

    spyOn(document, 'createElement').and.returnValue({
      setAttribute: () => {},
      style: { visibility: '' },
      click: clickSpy
    } as unknown as HTMLAnchorElement);

    component.exportStatsToCSV();
    expect(clickSpy).toHaveBeenCalled();
  });
});
