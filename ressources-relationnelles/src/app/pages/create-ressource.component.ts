import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Ressource } from '../models/ressource.model';
import { Categorie, CategorieService } from '../service/categorie.service';
import { RessourceService } from '../service/ressource.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-create-ressource',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-ressource.component.html',
  styleUrls: ['./create-ressource.component.scss']
})
export class CreateRessourceComponent implements OnInit {
  newRessource: Partial<Ressource> = {
    titre: '',
    description: '',
    categorie: '',
    type: 'publique',
    dateCreation: new Date()
  };

  categories: Categorie[] = [];

  constructor(
    private categorieService: CategorieService,
    private ressourceService: RessourceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categorieService.getAll().subscribe(cats => {
      this.categories = cats;
    });
  }

  addRessource() {
    const userId = this.authService.currentUserSubject.value?.id;

    if (!userId) {
      alert('Vous devez être connecté pour créer une ressource.');
      return;
    }

    if (this.newRessource.titre && this.newRessource.description && this.newRessource.categorie) {
      const fakeId = Date.now(); // simulate ID
      const ressource: Ressource = {
        id: fakeId,
        titre: this.newRessource.titre,
        description: this.newRessource.description,
        categorie: this.newRessource.categorie,
        type: this.newRessource.type || 'publique',
        dateCreation: new Date(),
        userID: userId,
        validee: false
      };

      this.ressourceService.create(ressource).subscribe(() => {
        this.router.navigate(['/resources']);
      });
    }
  }
}
