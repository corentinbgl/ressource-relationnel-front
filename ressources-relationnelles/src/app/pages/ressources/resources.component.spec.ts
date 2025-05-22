import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResourcesComponent } from './resources.component';
import { of } from 'rxjs';
import { RessourceService } from '../../service/ressource.service';
import { CategorieService } from '../../service/categorie.service';
import { AuthService } from '../../service/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('ResourcesComponent', () => {
  let component: ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;

  const mockRessources = [
    { id: 1, titre: 'R1', description: 'Desc', categorie: 'C1', type: 'publique', dateCreation: new Date(), userID: 1, validee: true }
  ];

  const mockCategories = [
    { id: 1, nom: 'C1' },
    { id: 2, nom: 'C2' }
  ];

  const mockRessourceService = {
    getAll: jasmine.createSpy().and.returnValue(of(mockRessources))
  };

  const mockCategorieService = {
    getAll: jasmine.createSpy().and.returnValue(of(mockCategories))
  };

  const mockAuthService = {
    currentUserSubject: { value: { id: 1 } },
    isAdmin: () => true
  };

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ResourcesComponent, HttpClientTestingModule],
    providers: [
      { provide: RessourceService, useValue: mockRessourceService },
      { provide: CategorieService, useValue: mockCategorieService },
      { provide: AuthService, useValue: mockAuthService },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: { get: () => '1' } }
        }
      }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(ResourcesComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new resource if form is complete and user is connected', () => {
    component.newRessource = {
      titre: 'Nouvelle',
      description: 'Une description',
      categorie: 'C1',
      type: 'publique'
    };
    component.addRessource();
    expect(component.ressources.length).toBeGreaterThan(1);
  });

 it('should not add a resource if fields are missing', () => {
  const previousLength = component.ressources.length;

  component.newRessource = {
    titre: '',
    description: '',
    categorie: '',
    type: 'publique'
  };

  component.addRessource();

  expect(component.ressources.length).toBe(previousLength);
});

  it('should toggle and reset create form', () => {
    component.showCreate = false;
    component.toggleCreate();
    expect(component.showCreate).toBeTrue();
    component.toggleCreate();
    expect(component.showCreate).toBeFalse();
    expect(component.newRessource.titre).toBe('');
  });

  it('should toggle share menu and show toast', fakeAsync(() => {
    component.toggleShareMenu(0);
    expect(component.openedShareIndex).toBe(0);
    component.shareOnNetwork('Facebook');
    expect(component.toastMessage).toContain('Facebook');
    tick(3000);
    expect(component.toastMessage).toBeNull();
  }));
});
