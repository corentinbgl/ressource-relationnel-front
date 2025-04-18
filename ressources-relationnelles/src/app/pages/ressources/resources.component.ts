import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../../service/ressource.service';
import { Ressource } from '../../models/ressource.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  constructor(private ressourceService: RessourceService) {}

  ngOnInit() {
    this.ressourceService.getAllRessources().subscribe(data => {
      this.ressources = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.ressources];

    if (this.selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === this.selectedType);
    }

    if (this.selectedSort === 'recent') {
      filtered.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
    }

    this.displayedRessources = filtered;
  }
}
