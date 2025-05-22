import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
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
import * as L from 'leaflet';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  allRessources: Ressource[] = [];
  ressources: Ressource[] = [];

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  map!: L.Map;

  ngAfterViewInit(): void {
    const center: L.LatLngExpression = [48.8566, 2.3522];
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [48.8566, 2.3522],
      6
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    // Générer une position aléatoire à +/- 0.5 degré autour du centre
    const randomLat = center[0] + (Math.random() - 0.5);
    const randomLng = center[1] + (Math.random() - 0.5);
    const randomPosition: L.LatLngExpression = [randomLat, randomLng];

    // Ajouter un cercle rouge semi-transparent à cette position
    L.circle(randomPosition, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.1,
      radius: 20000, // 20 km
    }).addTo(this.map);

    // Centrer la carte sur ce cercle
    this.map.panTo(randomPosition);
  }
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
    zone: '',
  };

  categories = ['Santé', 'Éducation', 'Environnement', 'Technologie'];
  typesRessources = ['Publique', 'Restreinte'];
  relations = ['Amicale', 'Amoureuse', 'Familiale', 'Professionnelle'];
  zonesGeo = ['France', 'Europe', 'Amérique', 'Asie'];

  stats = {
    consultations: 0,
    recherches: 0,
    exploitations: 0,
    creations: 0,
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

  loadAllData(): void {
    this.ressourceService.getAll().subscribe((ressources) => {
      ressources.forEach((r) => {
        r['relation'] = this.getRandomRelation();
        r['zone'] = this.getRandomZone();
      });

      this.allRessources = ressources;
      this.totalSuspendues = ressources.filter((r) => r.suspendue).length;
      this.totalCreeesCetteSemaine = this.countRecentCreations(ressources);

      const commentairesObservables = ressources.map((r) =>
        this.commentaireService.getByRessource(r.id)
      );

      forkJoin(commentairesObservables).subscribe((allCommentaires) => {
        this.totalCommentaires = allCommentaires.reduce(
          (acc, coms) => acc + coms.length,
          0
        );
      });

      this.applyFilters();
    });

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.progressionService
          .getForUser(user.id)
          .subscribe((progressions) => {
            this.totalFavoris = progressions.filter((p) => p.favori).length;
            this.totalExploitees = progressions.filter(
              (p) => p.exploitee
            ).length;
            this.updateStats();
          });
      }
    });

    this.userService.getAllUsers().subscribe((users) => {
      this.totalUtilisateurs = users.length;
    });
  }

  applyFilters(): void {
    let filtered = [...this.allRessources];

    const cutoff = this.getDateCutoff(this.filters.periode);
    if (cutoff) {
      filtered = filtered.filter(
        (r) => new Date(r.dateCreation || 0) >= cutoff
      );
    }

    if (this.filters.categorie) {
      filtered = filtered.filter(
        (r) =>
          this.normalizeString(r.categorie || '') ===
          this.normalizeString(this.filters.categorie)
      );
    }

    if (this.filters.typeRessource) {
      filtered = filtered.filter(
        (r) =>
          r.type?.toLowerCase() === this.filters.typeRessource.toLowerCase()
      );
    }

    if (this.filters.relation) {
      filtered = filtered.filter(
        (r) =>
          r['relation']?.toLowerCase() === this.filters.relation.toLowerCase()
      );
    }

    if (this.filters.zone) {
      filtered = filtered.filter(
        (r) => r['zone']?.toLowerCase() === this.filters.zone.toLowerCase()
      );
    }

    this.ressources = filtered;
    this.totalRessources = filtered.length;
    this.totalSuspendues = filtered.filter((r) => r.suspendue).length;
    this.totalCreeesCetteSemaine = this.countRecentCreations(filtered);

    this.updateStats();
  }

  exportStatsToCSV(): void {
    const stats = [
      ['Ressources', this.totalRessources],
      ['Favoris', this.totalFavoris],
      ['Exploitées', this.totalExploitees],
      ['Commentaires', this.totalCommentaires],
      ['Utilisateurs', this.totalUtilisateurs],
      ['Suspendues', this.totalSuspendues],
      ['Créées cette semaine', this.totalCreeesCetteSemaine],

      // Ajouter les stats fictives "en dur"
      ['Consultations', this.stats.consultations],
      ['Recherches', this.stats.recherches],
      ['Exploitations', this.stats.exploitations],
      ['Créations', this.stats.creations],
    ];

    const csvContent = stats.map((e) => e.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = 'statistiques.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private getDateCutoff(periode: string): Date | null {
    const now = Date.now();
    switch (periode) {
      case '7jours':
        return new Date(now - 7 * 24 * 60 * 60 * 1000);
      case '30jours':
        return new Date(now - 30 * 24 * 60 * 60 * 1000);
      case '365jours':
        return new Date(now - 365 * 24 * 60 * 60 * 1000);
      case 'toutes':
        return null;
      default:
        return null;
    }
  }

  private countRecentCreations(ressources: Ressource[]): number {
    const uneSemaine = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return ressources.filter((r) => {
      const creationTime = new Date(r.dateCreation || 0).getTime();
      return now - creationTime <= uneSemaine;
    }).length;
  }

  private getRandomRelation(): string {
    return this.relations[Math.floor(Math.random() * this.relations.length)];
  }

  private getRandomZone(): string {
    return this.zonesGeo[Math.floor(Math.random() * this.zonesGeo.length)];
  }

  private updateStats(): void {
    this.stats.consultations = this.totalRessources * 5;
    this.stats.recherches = this.totalRessources * 3;
    this.stats.exploitations = this.totalExploitees;
    this.stats.creations = this.totalCreeesCetteSemaine;
  }
}
