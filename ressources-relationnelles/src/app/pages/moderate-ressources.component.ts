import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../service/ressource.service';
import { Ressource } from '../models/ressource.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-moderate-ressources',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moderate-ressources.component.html'
})
export class ModerateRessourcesComponent implements OnInit {
  ressourcesNonValidees: Ressource[] = [];

  constructor(private ressourceService: RessourceService) {}

  ngOnInit() {
    this.ressourceService.getAll().subscribe(data => {
      this.ressourcesNonValidees = data.filter(r => !r.validee);
    });
  }

  valider(ressource: Ressource) {
    ressource.validee = true;
    this.ressourcesNonValidees = this.ressourcesNonValidees.filter(r => r.id !== ressource.id);
  }
}
