import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';

export interface AuthResponse {
  token: string;
  role: string;
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
    const stored = this.currentUserSubject.value;
    if (!stored) return null;
  
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
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

  getUserRole(): string | null {
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
}
