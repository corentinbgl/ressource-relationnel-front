import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../../service/ressource.service';
import { ProgressionService } from '../../service/progression.service';
import { CommentaireService } from '../../service/commentaire.service';
import { UserService } from '../../service/user.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Ressource } from '../../models/ressource.model';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  allRessources: Ressource[] = [];  // données complètes
  ressources: Ressource[] = [];      // données filtrées

  totalRessources = 0;
  totalFavoris = 0;
  totalExploitees = 0;
  totalCommentaires = 0;
  totalUtilisateurs = 0;
  totalSuspendues = 0;
  totalCreeesCetteSemaine = 0;

  filters = {
    periode: '7jours',
    categorie: '',
    typeRessource: '',
    relation: '',
    zone: ''
  };

  categories = ['Santé', 'Éducation', 'Environnement', 'Technologie'];
  typesRessources = ['Article', 'Vidéo', 'Image', 'Document'];
  relations = ['Amicale', 'Amoureuse', 'Familiale', 'Professionnelle'];
  zonesGeo = ['France', 'Europe', 'Amérique', 'Asie'];

  stats = {
    consultations: 2350,
    recherches: 1875,
    exploitations: 980,
    creations: 345
  };

  constructor(
    private ressourceService: RessourceService,
    private progressionService: ProgressionService,
    private commentaireService: CommentaireService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    this.ressourceService.getAll().subscribe(ressources => {
      // Simuler les champs 'relation' et 'zone' pour chaque ressource
      ressources.forEach(r => {
        r['relation'] = this.simulerRelation(r);
        r['zone'] = this.simulerZone(r);
      });

      this.allRessources = ressources;
      this.totalSuspendues = ressources.filter(r => r.suspendue).length;

      // Calcul des créées cette semaine (sur toutes les ressources)
      const uneSemaine = 1000 * 60 * 60 * 24 * 7;
      const maintenant = Date.now();
      this.totalCreeesCetteSemaine = ressources.filter(r => {
        const t = new Date(r.dateCreation).getTime();
        return maintenant - t <= uneSemaine;
      }).length;

      // Charger commentaires pour toutes ressources (en parallèle)
      const commentairesObservables = ressources.map(r => 
        this.commentaireService.getByRessource(r.id)
      );

      forkJoin(commentairesObservables).subscribe(allCommentaires => {
        this.totalCommentaires = allCommentaires.reduce((acc, coms) => acc + coms.length, 0);
      });

      // Appliquer les filtres pour initialiser l’affichage
      this.applyFilters();
    });

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.progressionService.getForUser(user.id).subscribe(prog => {
          this.totalFavoris = prog.filter(p => p.favori).length;
          this.totalExploitees = prog.filter(p => p.exploitee).length;
        });
      }
    });

    this.userService.getAllUsers().subscribe(users => {
      this.totalUtilisateurs = users.length;
    });
  }

  // Simulation simple pour 'relation'
  simulerRelation(r: Ressource): string {
    const relations = this.relations;
    return relations[Math.floor(Math.random() * relations.length)];
  }

  // Simulation simple pour 'zone'
  simulerZone(r: Ressource): string {
    const zonesGeo = this.zonesGeo;
    return zonesGeo[Math.floor(Math.random() * zonesGeo.length)];
  }

  applyFilters() {
    let filtered = this.allRessources;

    // Filtre période
    if (this.filters.periode !== 'toutes') {
      const now = new Date();
      let cutoff = new Date();

      switch (this.filters.periode) {
        case '7jours':
          cutoff.setDate(now.getDate() - 7);
          break;
        case '30jours':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case '365jours':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(r => new Date(r.dateCreation) >= cutoff);
    }

    // Filtrer catégorie
    if (this.filters.categorie) {
      filtered = filtered.filter(r => r.categorie === this.filters.categorie);
    }

    // Filtrer type de ressource
    if (this.filters.typeRessource) {
      filtered = filtered.filter(r => r.type === this.filters.typeRessource);
    }

    // Filtrer relation (simulée)
    if (this.filters.relation) {
      filtered = filtered.filter(r => r['relation'] === this.filters.relation);
    }

    // Filtrer zone (simulée)
    if (this.filters.zone) {
      filtered = filtered.filter(r => r['zone'] === this.filters.zone);
    }

    this.ressources = filtered;

    // Mettre à jour stats selon données filtrées
    this.totalRessources = filtered.length;
    this.totalSuspendues = filtered.filter(r => r.suspendue).length;

    // Calcul créées cette semaine filtrées
    const uneSemaine = 1000 * 60 * 60 * 24 * 7;
    const maintenant = Date.now();
    this.totalCreeesCetteSemaine = filtered.filter(r => {
      const t = new Date(r.dateCreation).getTime();
      return maintenant - t <= uneSemaine;
    }).length;

    // Mise à jour stats "simulées"
    this.stats.consultations = this.totalRessources * 5;
    this.stats.recherches = this.totalRessources * 3;
    this.stats.exploitations = this.totalExploitees; // à synchroniser avec progression, voir plus bas
    this.stats.creations = this.totalCreeesCetteSemaine;
  }

  exportStatsToCSV() {
    const stats = [
      ['Ressources', this.totalRessources],
      ['Favoris', this.totalFavoris],
      ['Exploitées', this.totalExploitees],
      ['Commentaires', this.totalCommentaires],
      ['Utilisateurs', this.totalUtilisateurs],
      ['Suspendues', this.totalSuspendues],
      ['Créées cette semaine', this.totalCreeesCetteSemaine],
    ];

    const csvContent = stats.map(e => e.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'statistiques.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
