import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../../service/ressource.service';
import { Ressource } from '../../models/ressource.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Categorie, CategorieService } from '../../service/categorie.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  ressources: Ressource[] = [];
  categories: Categorie[] = [];

  constructor(private ressourceService: RessourceService, private categorieService: CategorieService) {}

  ngOnInit() {
    this.ressourceService.getAll().subscribe(data => {
      this.ressources = data;
    });
  
    this.categorieService.getAll().subscribe(cats => {
      this.categories = cats;
    });
  }

  showAddModal = false;
isEditing = false;
editingRessourceId: number | null = null;
newCategory = '';

newRessource: Partial<Ressource> = {
  titre: '',
  description: '',
  categorie: '',
  type: 'publique',
  dateCreation: new Date()
};

addOrUpdateRessource() {
  if (this.newRessource.titre && this.newRessource.description && this.newRessource.categorie) {
    if (this.isEditing && this.editingRessourceId !== null) {
      const index = this.ressources.findIndex(r => r.id === this.editingRessourceId);
      if (index !== -1) {
        this.ressources[index] = {
          ...this.ressources[index],
          titre: this.newRessource.titre!,
          description: this.newRessource.description!,
          categorie: this.newRessource.categorie!,
          type: this.newRessource.type!,
          dateCreation: this.ressources[index].dateCreation 
        };
      }
    } else {
      const newId = Math.max(...this.ressources.map(r => r.id)) + 1;
      const newRessourceFinal: Ressource = {
        id: newId,
        titre: this.newRessource.titre!,
        description: this.newRessource.description!,
        categorie: this.newRessource.categorie!,
        type: this.newRessource.type!,
        dateCreation: new Date()
      };

      this.ressources.push(newRessourceFinal);
    }

    this.showAddModal = false;
    this.resetForm();
  }
}

editRessource(ressource: Ressource) {
  this.showAddModal = true;
  this.isEditing = true;
  this.editingRessourceId = ressource.id;
  this.newRessource = { ...ressource };
}

resetForm() {
  this.newRessource = {
    titre: '',
    description: '',
    categorie: '',
    type: 'publique',
    dateCreation: new Date()
  };
  this.isEditing = false;
  this.editingRessourceId = null;
}


deleteRessource(id: number) {
  const confirmation = confirm('Es-tu sûr de vouloir supprimer cette ressource ?');
  if (confirmation) {
    this.ressources = this.ressources.filter(r => r.id !== id);
  }
}

addCategory() {
  if (this.newCategory.trim()) {
    this.categorieService.create(this.newCategory.trim());
    this.newCategory = '';
  }
}

deleteCategory(id: number) {
  this.categorieService.delete(id);
}

}
