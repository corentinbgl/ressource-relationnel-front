import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

export interface ToggleDto {
  userId: number;
  ressourceId: number;
  type: 'favori' | 'exploitee' | 'miseDeCote';
}

@Injectable({
  providedIn: 'root'
})
export class ProgressionService {
  private api = `${environment.apiUrl}/Progression`;

  constructor(private http: HttpClient) {}

  getForUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/${userId}`);
  }

  toggle(dto: ToggleDto): Observable<void> {
    return this.http.post<void>(`${this.api}/toggle`, dto);
  }

  getForUser2(userId: number): Observable<any> {
  return this.http.get<any>(`${this.api}/${userId}`);
}

}
