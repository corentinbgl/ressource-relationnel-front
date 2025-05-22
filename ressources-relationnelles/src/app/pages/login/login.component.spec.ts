import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('E01 - Connexion sans compte : affiche un message d\'erreur si identifiants inconnus', () => {
    // Données invalides
    component.email = 'inconnu@test.com';
    component.password = '123456';

    // Appel de la méthode login
    component.login();

    // Attente de la requête HTTP
    const req = httpMock.expectOne(req =>
      req.method === 'POST' && req.url.includes('/Auth/login')
    );

    // Simulation de la réponse erreur 401
    req.flush('Utilisateur non reconnu', {
      status: 401,
      statusText: 'Unauthorized'
    });

    fixture.detectChanges();

    // Vérifie que le message d'erreur est affiché
    expect(component.errorMessage).toContain('Utilisateur non reconnu');
  });
});
