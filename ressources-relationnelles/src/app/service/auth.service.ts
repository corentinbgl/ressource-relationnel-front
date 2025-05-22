import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';

export interface AuthResponse {
  token: string;
  role: number;
  email: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const saved = localStorage.getItem('user');
    if (saved) {
      this.currentUserSubject.next(JSON.parse(saved));
    }
  }

  getUserId(): number | null {
    return this.currentUserSubject.value?.id || null;
  }


  getConnectedUser(): Observable<any> | null {
    const id = this.currentUserSubject.value?.id;
    if (!id) return null;
  
    return this.http.get<any>(`${environment.apiUrl}/users/${id}`);
  }

  getRoleById(id: number): Observable<{ id: number; role: string }> {
    return this.http.get<{ id: number; role: string }>(`${environment.apiUrl}/Role/${id}`);
  }
  
  

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('user', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.currentUserSubject.value?.token || null;
  }

  getUserRole(): number | null {
    return this.currentUserSubject.value?.role || null;
  }

  getAllRoles(): Observable<{ id: number, role: string }[]> {
    return this.http.get<{ id: number, role: string }[]>(`${environment.apiUrl}/role`);
  }
  

  getUserEmail(): string | null {
    return this.currentUserSubject.value?.email || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  register(data: {email: string; password: string }): Observable<any> {
  return this.http.post(`${environment.apiUrl}/User`, data);
  }

getUserRoleName(): string | null {
  const roleId = this.getUserRole();

  switch (roleId) {
    case 1: return 'Citoyen';
    case 2: return 'Modérateur';
    case 3: return 'Administrateur';
    case 4: return 'SuperAdministrateur';
    default: return null;
  }
}

  isAdmin(): boolean {
    const role = this.getUserRoleName();
    return role === 'admin' || role === 'superadmin';
  }
}
