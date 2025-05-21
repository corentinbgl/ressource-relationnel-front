import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ressource } from '../models/ressource.model';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  private api = `${environment.apiUrl}/Ressource`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ressource[]> {
    return this.http.get<Ressource[]>((`${this.api}`));
    //return this.http.get<Ressource[]>(this.api, { responseType: 'json' as const });
  }

  getById(id: number): Observable<Ressource> {
    return this.http.get<Ressource>(`${this.api}/${id}`);
  }

  create(ressource: Ressource): Observable<Ressource> {
    return this.http.post<Ressource>(this.api, ressource);
  }

  update(ressource: Ressource): Observable<void> {
    return this.http.put<void>(`${this.api}/${ressource.id}`, ressource);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
