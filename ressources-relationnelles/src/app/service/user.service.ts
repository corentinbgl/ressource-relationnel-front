import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersSubject = new BehaviorSubject<User[]>([
    {
      id: 1,
      email: 'citoyen1@example.com',
      password: 'password123',
      role: 1,
      actif: true
    },
    {
      id: 2,
      email: 'admin@example.com',
      password: 'adminpass',
      role: 3,
      actif: true
    }
  ]);

  users$ = this.usersSubject.asObservable();

  private api = `${environment.apiUrl}/users`; 

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  addUser(user: User): Observable<User> {
    console.log(user)
    return this.http.post<User>('http://localhost:5086/add', user);
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
