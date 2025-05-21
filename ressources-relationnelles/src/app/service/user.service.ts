import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // ComportementSubject qui contient la liste actuelle des utilisateurs
  private usersSubject = new BehaviorSubject<User[]>([]);

  // Observable public que les composants peuvent souscrire
  users$ = this.usersSubject.asObservable();

  // URL de l'API backend (ajuste selon ton environnement)
  private api = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  // Charge tous les utilisateurs depuis le backend et met à jour le BehaviorSubject
  loadUsers(): void {
    this.http.get<User[]>(this.api).subscribe(users => {
      this.usersSubject.next(users);
    });
  }

  // Récupérer tous les users en observable (pas utilisé directement, mais utile)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  // Ajouter un utilisateur
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.api, user);
  }

  // Toggle l'état actif/inactif d'un utilisateur côté backend,
  // puis met à jour la liste locale dans le BehaviorSubject
  toggleActive(id: number): Observable<User> {
    return this.http.put<User>(`${this.api}/${id}`, {}).pipe(
      tap(updatedUser => {
        const currentUsers = this.usersSubject.getValue();
        const updatedUsers = currentUsers.map(user =>
          user.id === id ? updatedUser : user
        );
        this.usersSubject.next(updatedUsers);
      })
    );
  }

  // Accès direct au snapshot des users (optionnel)
  getUsersSnapshot(): User[] {
    return this.usersSubject.getValue();
  }
}
