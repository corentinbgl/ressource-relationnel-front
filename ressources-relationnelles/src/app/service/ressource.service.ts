import { Injectable } from '@angular/core';
import { Ressource } from '../models/ressource.model';
import { of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {

  private ressources: Ressource[] = [
    {
      id: 1,
      titre: 'Communiquer en famille',
      description: 'Améliorez la communication au sein de votre foyer.',
      type: 'publique',
      categorie: 'Famille',
      dateCreation: new Date('2024-04-01')
    },
    {
      id: 2,
      titre: 'Gérer les conflits en entreprise',
      description: 'Apprenez à désamorcer les tensions dans un cadre professionnel.',
      type: 'restreinte',
      categorie: 'Travail',
      dateCreation: new Date('2024-03-25')
    },
    {
      id: 3,
      titre: 'Développer des amitiés sincères',
      description: 'Construire des relations authentiques et durables.',
      type: 'publique',
      categorie: 'Amitié',
      dateCreation: new Date('2024-03-20')
    }
  ];

  private categoriesSubject = new BehaviorSubject<string[]>(['Famille', 'Travail', 'Amitié']);
  categories$ = this.categoriesSubject.asObservable();

  constructor() { }

  getAllRessources() {
    return of(this.ressources);
  }

  getCategories() {
    return this.categories$;
  }

  addCategory(category: string) {
    const current = this.categoriesSubject.getValue();
    if (!current.includes(category)) {
      this.categoriesSubject.next([...current, category]);
    }
  }

  deleteCategory(category: string) {
    const updated = this.categoriesSubject.getValue().filter(cat => cat !== category);
    this.categoriesSubject.next(updated);
  }
}
