import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../service/ressource.service';
import { ProgressionService } from '../service/progression.service';
import { Ressource } from '../models/ressource.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-progression',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './progression.component.html',
  styleUrls: ['./progression.component.scss']
})
export class ProgressionComponent implements OnInit {
  allRessources: Ressource[] = [];

  favoris: Ressource[] = [];
  exploitees: Ressource[] = [];
  misesDeCote: Ressource[] = [];

  constructor(
    private ressourceService: RessourceService,
    private progressionService: ProgressionService,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    this.ressourceService.getAll().subscribe(data => {
      this.allRessources = data;
  
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          const userId = user.id;
          this.progressionService.getForUser(userId).subscribe(prog => {
            this.favoris = prog
              .filter(p => p.favori)
              .map(p => this.allRessources.find(r => r.id === p.ressourceId)!);
  
            this.exploitees = prog
              .filter(p => p.exploitee)
              .map(p => this.allRessources.find(r => r.id === p.ressourceId)!);
  
            this.misesDeCote = prog
              .filter(p => p.miseDeCote)
              .map(p => this.allRessources.find(r => r.id === p.ressourceId)!);
          });
        }
      });
    });
  }
}
