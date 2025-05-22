import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsersComponent } from './admin-users.component';
import { of } from 'rxjs';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/user.model';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;

  const mockUsers: User[] = [
    { id: 1, email: 'test1@mail.com', password: 'pass', role: 1, actif: true },
    { id: 2, email: 'test2@mail.com', password: 'pass', role: 2, actif: false }
  ];

  const mockUserService = {
    users$: of(mockUsers),
    loadUsers: jasmine.createSpy('loadUsers'),
    addUser: jasmine.createSpy('addUser').and.callFake((user: User) => of({ ...user })),
    toggleActive: jasmine.createSpy('toggleActive').and.returnValue(of({}))
  };

  const mockAuthService = {
    getAllRoles: jasmine.createSpy('getAllRoles').and.returnValue(
      of([
        { id: 1, role: 'Citoyen' },
        { id: 2, role: 'Modérateur' },
        { id: 3, role: 'Administrateur' },
        { id: 4, role: 'Super Administrateur' }
      ])
    )
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsersComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });


  it('should add a user', () => {
    component.newUser.email = 'new@mail.com';
    component.newUser.password = '123456';
    component.selectedRole = 2;

    component.addUser();

    expect(mockUserService.addUser).toHaveBeenCalledWith(jasmine.objectContaining({
      email: 'new@mail.com',
      password: '123456',
      role: 2,
      actif: true
    }));

    // Vérifie que le user a bien été ajouté dans le tableau
    expect(component.users.some(u => u.email === 'new@mail.com')).toBeTrue();
  });

 

  it('should toggle active state of a user', () => {
    component.toggleActive(1);
    expect(mockUserService.toggleActive).toHaveBeenCalledWith(1);
  });

  it('should return correct role label', () => {
    expect(component.getRoleLabel(1)).toBe('Citoyen');
    expect(component.getRoleLabel(4)).toBe('Super Administrateur');
    expect(component.getRoleLabel(99)).toBe('Inconnu');
  });

  it('should track user by id', () => {
    const user: User = { id: 123, email: '', password: '', role: 1, actif: true };
    expect(component.trackByUserId(0, user)).toBe(123);
  });
});
