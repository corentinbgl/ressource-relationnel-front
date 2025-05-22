import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RessourceService } from '../../service/ressource.service';
import { CategorieService } from '../../service/categorie.service';
import { AuthService } from '../../service/auth.service';
import { of } from 'rxjs';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let ressourceServiceSpy: jasmine.SpyObj<RessourceService>;
  let categorieServiceSpy: jasmine.SpyObj<CategorieService>;

  beforeEach(async () => {
    const ressourceSpy = jasmine.createSpyObj('RessourceService', ['getAll', 'create', 'update', 'delete']);
    const categorieSpy = jasmine.createSpyObj('CategorieService', ['getAll', 'create', 'delete']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AdminComponent],
      providers: [
        { provide: RessourceService, useValue: ressourceSpy },
        { provide: CategorieService, useValue: categorieSpy },
        AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    ressourceServiceSpy = TestBed.inject(RessourceService) as jasmine.SpyObj<RessourceService>;
    categorieServiceSpy = TestBed.inject(CategorieService) as jasmine.SpyObj<CategorieService>;

    ressourceServiceSpy.getAll.and.returnValue(of([]));
    categorieServiceSpy.getAll.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch ressources and categories on init', () => {
    expect(ressourceServiceSpy.getAll).toHaveBeenCalled();
    expect(categorieServiceSpy.getAll).toHaveBeenCalled();
  });

  it('should reset form and close modal', () => {
    component.newRessource.titre = 'temp';
    component.isEditing = true;
    component.showAddModal = true;

    component.closeModalAndReset();

    expect(component.newRessource.titre).toBe('');
    expect(component.isEditing).toBeFalse();
    expect(component.showAddModal).toBeFalse();
  });

  

  it('should clear and reload category list when adding new category', () => {
    component.newCategory = 'Nouvelle';
    categorieServiceSpy.create.and.returnValue(of({ id: 3, nom: 'Nouvelle' }));
    categorieServiceSpy.getAll.and.returnValue(of([{ id: 3, nom: 'Nouvelle' }]));

    component.addCategory();

    expect(categorieServiceSpy.create).toHaveBeenCalledWith('Nouvelle');
    expect(component.categories.length).toBe(1);
    expect(component.newCategory).toBe('');
  });
});
