import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commentaire } from '../models/commentaire.model';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private api = `${environment.apiUrl}/commentaire`;

  constructor(private http: HttpClient) {}

  getByRessource(ressourceId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.api}/ressource/${ressourceId}`);
  }

  create(commentaire: Commentaire): Observable<Commentaire> {
    return this.http.post<Commentaire>(this.api, commentaire);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
