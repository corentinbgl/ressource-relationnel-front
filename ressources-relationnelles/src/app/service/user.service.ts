import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersSubject = new BehaviorSubject<User[]>([
    {
      id: 1,
      email: 'citoyen1@example.com',
      password: 'password123',
      role: 'citoyen',
      actif: true
    },
    {
      id: 2,
      email: 'admin@example.com',
      password: 'adminpass',
      role: 'administrateur',
      actif: true
    }
  ]);

  users$ = this.usersSubject.asObservable();

  constructor() {}

  getAllUsers(): Observable<User[]> {
    return this.users$;
  }

  addUser(user: User) {
    const currentUsers = this.usersSubject.getValue();
    this.usersSubject.next([...currentUsers, user]);
  }

  toggleActive(id: number) {
    const updatedUsers = this.usersSubject.getValue().map(user => {
      if (user.id === id) {
        return { ...user, actif: !user.actif };
      }
      return user;
    });
    this.usersSubject.next(updatedUsers);
  }

  getUsersSnapshot(): User[] {
    return this.usersSubject.getValue();
  }
}
