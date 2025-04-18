import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RessourceService } from '../../service/ressource.service';
import { Ressource } from '../../models/ressource.model';
import { Commentaire } from '../../models/commentaire.model';
import { CommentaireService } from '../../service/commentaire.service';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resource-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.scss']
})
export class ResourceDetailsComponent implements OnInit {
  ressource?: Ressource;

  commentairesPrincipaux: Commentaire[] = []; // ➔ seulement les commentaires sans réponse
  reponsesParCommentaire: { [parentId: number]: Commentaire[] } = {}; // ➔ réponses par commentaire

  newComment: string = '';
  replyContent: string = '';
  replyingToId: number | null = null;
  userEmail: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ressourceService: RessourceService,
    private commentaireService: CommentaireService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.ressourceService.getAllRessources().subscribe(data => {
      this.ressource = data.find(r => r.id === id);
    });

    this.commentaireService.commentaires$.subscribe(coms => {
      const commentairesDeLaRessource = coms.filter(c => c.ressourceId === id);

      this.commentairesPrincipaux = commentairesDeLaRessource.filter(c => !c.reponseA);

      this.reponsesParCommentaire = {};
      commentairesDeLaRessource.filter(c => c.reponseA).forEach(reply => {
        if (!this.reponsesParCommentaire[reply.reponseA!]) {
          this.reponsesParCommentaire[reply.reponseA!] = [];
        }
        this.reponsesParCommentaire[reply.reponseA!].push(reply);
      });
    });

    this.authService.currentUser$.subscribe(user => {
      this.userEmail = user?.email || null;
    });
  }

  addCommentaire() {
    if (this.newComment && this.userEmail && this.ressource) {
      const newCom: Commentaire = {
        id: Date.now(),
        ressourceId: this.ressource.id,
        auteur: this.userEmail,
        contenu: this.newComment,
        date: new Date()
      };
      this.commentaireService.addCommentaire(newCom);
      this.newComment = '';
    }
  }

  startReply(commentId: number) {
    this.replyingToId = commentId;
  }

  cancelReply() {
    this.replyingToId = null;
    this.replyContent = '';
  }

  sendReply() {
    if (this.replyContent && this.userEmail && this.ressource && this.replyingToId !== null) {
      const newReply: Commentaire = {
        id: Date.now(),
        ressourceId: this.ressource.id,
        auteur: this.userEmail,
        contenu: this.replyContent,
        date: new Date(),
        reponseA: this.replyingToId
      };
      this.commentaireService.addCommentaire(newReply);
      this.replyContent = '';
      this.replyingToId = null;
    }
  }

  deleteCommentaire(id: number) {
    this.commentaireService.deleteCommentaire(id);
  }
}
