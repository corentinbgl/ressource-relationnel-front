import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Commentaire } from '../models/commentaire.model';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private commentairesSubject = new BehaviorSubject<Commentaire[]>([]);
  commentaires$ = this.commentairesSubject.asObservable();

  constructor() {}

  getCommentairesParRessource(idRessource: number): Observable<Commentaire[]> {
    return this.commentaires$;
  }

  addCommentaire(commentaire: Commentaire) {
    const current = this.commentairesSubject.getValue();
    this.commentairesSubject.next([...current, commentaire]);
  }

  deleteCommentaire(id: number) {
    const updated = this.commentairesSubject.getValue().filter(c => c.id !== id && c.reponseA !== id);
    this.commentairesSubject.next(updated);
  }
}
