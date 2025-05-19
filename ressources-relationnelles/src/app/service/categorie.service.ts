// src/app/service/categorie.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

export interface Categorie {
  id: number;
  nom: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private api = `${environment.apiUrl}/categorie`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.api);
  }

  create(nom: string): Observable<Categorie> {
    return this.http.post<Categorie>(this.api, { nom });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
