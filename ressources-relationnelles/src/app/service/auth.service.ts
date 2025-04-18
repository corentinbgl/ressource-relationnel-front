import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private userService: UserService) {}

  login(email: string, password: string): boolean {
    const users = this.userService.getUsersSnapshot();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser && foundUser.actif) {
      this.currentUserSubject.next(foundUser);
      return true;
    }
    return false;
  }

  logout() {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
}
