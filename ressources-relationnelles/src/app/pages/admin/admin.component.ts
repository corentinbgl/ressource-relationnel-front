import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../../service/ressource.service';
import { Ressource } from '../../models/ressource.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Categorie, CategorieService } from '../../service/categorie.service';
import { AuthResponse, AuthService } from '../../service/auth.service';

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

  constructor(private ressourceService: RessourceService, private categorieService: CategorieService, private authService : AuthService) {}

  ngOnInit() {
    this.ressourceService.getAll().subscribe(data => {
      this.ressources = data;
    });
  
    this.categorieService.getAll().subscribe(cats => {
      this.categories = cats;
    });

    console.log(this.categories)
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
    const ressourceToSend: Ressource = {
      id: this.editingRessourceId ?? 0, // ⚠️ l’id ne sera pas utilisé en POST
      titre: this.newRessource.titre!,
      description: this.newRessource.description!,
      categorie: this.newRessource.categorie!,
      type: this.newRessource.type!,
      dateCreation: new Date(),
      userID : 0,
      validee: false
    };

    if (this.isEditing && this.editingRessourceId !== null) {
      // 🟡 MODIFICATION
      this.ressourceService.update(ressourceToSend).subscribe(() => {
        const index = this.ressources.findIndex(r => r.id === this.editingRessourceId);
        if (index !== -1) {
          this.ressources[index] = { ...ressourceToSend };
        }
        this.closeModalAndReset();
      });
    } else {
      // 🟢 AJOUT
      this.ressourceService.create(ressourceToSend).subscribe((created) => {
        this.ressources.push(created);
        this.closeModalAndReset();
      });
    }
  }
}

closeModalAndReset() {
  this.showAddModal = false;
  this.resetForm();
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
    this.ressourceService.delete(id).subscribe(() => {
      this.ressources = this.ressources.filter(r => r.id !== id);
    });
  }
}


addCategory() {
  if (this.newCategory.trim()) {
    this.categorieService.create(this.newCategory.trim()).subscribe(() => {
      this.categorieService.getAll().subscribe(cats => {
        this.categories = cats; // ✅ remplace proprement
      });
      this.newCategory = '';
    });
  }
}

deleteCategory(id: number) {
  const confirmation = confirm('Supprimer cette catégorie ?');
  if (confirmation) {
    this.categorieService.delete(id).subscribe(() => {
      this.categories = this.categories.filter(c => c.id !== id); // ✅ mise à jour locale
    });
  }
}


}
