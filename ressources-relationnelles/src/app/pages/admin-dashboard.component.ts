import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../service/ressource.service';
import { ProgressionService } from '../service/progression.service';
import { CommentaireService } from '../service/commentaire.service';
import { UserService } from '../service/user.service';
import { RouterModule } from '@angular/router';

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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.ressourceService.getAllRessources().subscribe(data => {
      this.totalRessources = data.length;
    });

    const prog = this.progressionService.progression;
    this.totalFavoris = prog.favoris.length;
    this.totalExploitees = prog.exploitees.length;

    this.commentaireService.commentaires$.subscribe(coms => {
      this.totalCommentaires = coms.length;
    });

    this.userService.getAllUsers().subscribe(users => {
      this.totalUtilisateurs = users.length;
    });
  }
}
