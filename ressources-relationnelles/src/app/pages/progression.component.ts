import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../service/ressource.service';
import { ProgressionService } from '../service/progression.service';
import { Ressource } from '../models/ressource.model';
import { RouterModule } from '@angular/router';

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
    private progressionService: ProgressionService
  ) {}

  ngOnInit(): void {
    this.ressourceService.getAllRessources().subscribe(data => {
      this.allRessources = data;
      const progression = this.progressionService.progression;

      this.favoris = data.filter(r => progression.favoris.includes(r.id));
      this.exploitees = data.filter(r => progression.exploitees.includes(r.id));
      this.misesDeCote = data.filter(r => progression.misesDeCote.includes(r.id));
    });
  }
}
