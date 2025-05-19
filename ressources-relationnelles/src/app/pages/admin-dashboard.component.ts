import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../service/ressource.service';
import { ProgressionService } from '../service/progression.service';
import { CommentaireService } from '../service/commentaire.service';
import { UserService } from '../service/user.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  totalRessources = 0;
  totalFavoris = 0;
  totalExploitees = 0;
  totalCommentaires = 0;
  totalUtilisateurs = 0;

  constructor(
    private ressourceService: RessourceService,
    private progressionService: ProgressionService,
    private commentaireService: CommentaireService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.ressourceService.getAll().subscribe(ressources => {
      this.totalRessources = ressources.length;
  
      // Total commentaires
      let totalCommentaires = 0;
      ressources.forEach(r => {
        this.commentaireService.getByRessource(r.id).subscribe(coms => {
          totalCommentaires += coms.length;
          this.totalCommentaires = totalCommentaires;
        });
      });
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
}
