import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../../service/ressource.service';
import { Ressource } from '../../models/ressource.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategorieService, Categorie } from '../../service/categorie.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  ressources: Ressource[] = [];
  displayedRessources: Ressource[] = [];
  selectedType: string = 'all';
  selectedSort: string = 'recent';
  openedShareIndex: number | null = null;
  toastMessage: string | null = null;

  categories: Categorie[] = [];
  showCreate: boolean = false;

  newRessource: Partial<Ressource> = {
    titre: '',
    description: '',
    categorie: '',
    type: 'publique',
    dateCreation: new Date()
  };

  constructor(
    private ressourceService: RessourceService,
    private categorieService: CategorieService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.ressourceService.getAll().subscribe(data => {
      this.ressources = data;
      this.applyFilters();
    });

    this.categorieService.getAll().subscribe(cats => {
      this.categories = cats;
    });
  }

applyFilters() {
  let filtered = [...this.ressources];

  // Si l'utilisateur n'est pas admin, on filtre les non-validées
//  if (!this.authService.isAdmin()) {
//    filtered = filtered.filter(r => r.validee);
 // }

//  if (this.selectedType !== 'all') {
//    filtered = filtered.filter(r => r.type === this.selectedType);
 // }

//  filtered.sort((a, b) => {
 //   return this.selectedSort === 'recent'
 //     ? new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
 //     : new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime();
 // });

  this.displayedRessources = filtered;
}

  toggleCreate() {
    this.showCreate = !this.showCreate;
    if (!this.showCreate) this.resetForm();
  }

  resetForm() {
    this.newRessource = {
      titre: '',
      description: '',
      categorie: '',
      type: 'publique',
      dateCreation: new Date()
    };
  }

  trackCat(index: number, cat: Categorie) {
    return cat.id;
  }

  addRessource() {
    if (
      this.newRessource.titre &&
      this.newRessource.description &&
      this.newRessource.categorie
    ) {
      const newId = this.ressources.length > 0
        ? Math.max(...this.ressources.map(r => r.id)) + 1
        : 1;
  
      const userId = this.authService.currentUserSubject.value?.id;
  
      if (!userId) {
        console.warn('Utilisateur non connecté, impossible de créer une ressource.');
        return;
      }
  
      const newR: Ressource = {
        id: newId,
        titre: this.newRessource.titre,
        description: this.newRessource.description,
        categorie: this.newRessource.categorie,
        type: this.newRessource.type || 'publique',
        dateCreation: new Date(),
        userID: userId,
        validee: false
      };
  
      this.ressources.push(newR);
      this.applyFilters();
      this.toggleCreate();
    }
  }

  toggleShareMenu(index: number) {
  this.openedShareIndex = this.openedShareIndex === index ? null : index;
}



shareOnNetwork(network: string) {
  this.toastMessage = `La ressource a été partagée sur ${network} !`;

  // Ferme le menu après partage
  this.openedShareIndex = null;

  // Efface le message après 3 secondes
  setTimeout(() => {
    this.toastMessage = null;
  }, 3000);
}

  
}
