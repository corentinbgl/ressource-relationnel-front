import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
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
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
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

  getUserEmail(): string | null {
    return this.currentUserSubject.value?.email || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
