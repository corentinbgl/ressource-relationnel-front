import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Progression {
  favoris: number[];
  exploitees: number[];
  misesDeCote: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressionService {
  private progressionSubject = new BehaviorSubject<Progression>({
    favoris: [],
    exploitees: [],
    misesDeCote: []
  });

  progression$ = this.progressionSubject.asObservable();

  constructor() {}

  get progression(): Progression {
    return this.progressionSubject.getValue();
  }

  toggleFavori(id: number) {
    const { favoris } = this.progression;
    const updated = favoris.includes(id)
      ? favoris.filter(f => f !== id)
      : [...favoris, id];
    this.update({ favoris: updated });
  }

  toggleExploitee(id: number) {
    const { exploitees } = this.progression;
    const updated = exploitees.includes(id)
      ? exploitees.filter(f => f !== id)
      : [...exploitees, id];
    this.update({ exploitees: updated });
  }

  toggleMiseDeCote(id: number) {
    const { misesDeCote } = this.progression;
    const updated = misesDeCote.includes(id)
      ? misesDeCote.filter(f => f !== id)
      : [...misesDeCote, id];
    this.update({ misesDeCote: updated });
  }

  private update(changes: Partial<Progression>) {
    this.progressionSubject.next({
      ...this.progression,
      ...changes
    });
  }

  isFavori(id: number): boolean {
    return this.progression.favoris.includes(id);
  }

  isExploitee(id: number): boolean {
    return this.progression.exploitees.includes(id);
  }

  isMiseDeCote(id: number): boolean {
    return this.progression.misesDeCote.includes(id);
  }
}
