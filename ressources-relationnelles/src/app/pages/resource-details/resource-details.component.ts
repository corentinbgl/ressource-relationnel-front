import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RessourceService } from '../../service/ressource.service';
import { Ressource } from '../../models/ressource.model';
import { Commentaire } from '../../models/commentaire.model';
import { CommentaireService } from '../../service/commentaire.service';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { ProgressionService } from '../../service/progression.service';

@Component({
  selector: 'app-resource-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.scss'],
})
export class ResourceDetailsComponent implements OnInit {
  ressource?: Ressource;

  commentaires: Commentaire[] = [];

  commentairesPrincipaux: Commentaire[] = []; // ➔ seulement les commentaires sans réponse
  reponsesParCommentaire: { [parentId: number]: Commentaire[] } = {}; // ➔ réponses par commentaire

  newComment: string = '';
  replyContent: string = '';
  replyingToId: number | null = null;
  userEmail: string | null = null;

  isFavori: boolean = false;
  isExploitee: boolean = false;
  isMiseDeCote: boolean = false;
  editingCommentId: number | null = null;
  editedCommentContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private ressourceService: RessourceService,
    private commentaireService: CommentaireService,
    private authService: AuthService,
    private progressionService: ProgressionService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.ressourceService.getAll().subscribe((data) => {
      this.ressource = data.find((r) => r.id === id);
    });

    this.commentaireService.getByRessource(id).subscribe((coms) => {
      const commentairesDeLaRessource = coms.filter(
        (c) => c.ressourceId === id
      );

      this.commentairesPrincipaux = commentairesDeLaRessource.filter(
        (c) => !c.reponseA
      );

      this.reponsesParCommentaire = {};
      commentairesDeLaRessource
        .filter((c) => c.reponseA)
        .forEach((reply) => {
          if (!this.reponsesParCommentaire[reply.reponseA!]) {
            this.reponsesParCommentaire[reply.reponseA!] = [];
          }
          this.reponsesParCommentaire[reply.reponseA!].push(reply);
        });
    });

    this.authService.currentUser$.subscribe((user) => {
      this.userEmail = user?.email || null;
    });

    this.updateCommentaires();
  }

  updateCommentaires() {
    const id = this.ressource?.id;
    if (!id) return;

    const coms = this.commentaires.filter((c) => c.ressourceId === id);

    this.commentairesPrincipaux = coms.filter((c) => !c.reponseA);

    this.reponsesParCommentaire = {};
    coms
      .filter((c) => c.reponseA)
      .forEach((reply) => {
        if (!this.reponsesParCommentaire[reply.reponseA!]) {
          this.reponsesParCommentaire[reply.reponseA!] = [];
        }
        this.reponsesParCommentaire[reply.reponseA!].push(reply);
      });
  }
  addCommentaire() {
    if (this.newComment && this.userEmail && this.ressource) {
      const newCom: Commentaire = {
        id: Date.now(),
        ressourceId: this.ressource.id,
        auteur: this.userEmail,
        contenu: this.newComment,
        date: new Date(),
      };
      this.commentaires.push(newCom);
      this.newComment = '';
      this.updateCommentaires();
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
    if (
      this.replyContent &&
      this.userEmail &&
      this.ressource &&
      this.replyingToId !== null
    ) {
      const newReply: Commentaire = {
        id: Date.now(),
        ressourceId: this.ressource.id,
        auteur: this.userEmail,
        contenu: this.replyContent,
        date: new Date(),
        reponseA: this.replyingToId,
      };
      this.commentaires.push(newReply);
      this.replyContent = '';
      this.replyingToId = null;
      this.updateCommentaires();
    }
  }

  deleteCommentaire(id: number) {
    // Supprimer un commentaire principal
    const indexPrincipal = this.commentairesPrincipaux.findIndex(
      (c) => c.id === id
    );
    if (indexPrincipal !== -1) {
      this.commentairesPrincipaux.splice(indexPrincipal, 1);
      // Supprimer aussi ses réponses si besoin
      delete this.reponsesParCommentaire[id];
      return;
    }

    // Supprimer un commentaire enfant
    for (const parentId in this.reponsesParCommentaire) {
      const indexEnfant = this.reponsesParCommentaire[parentId].findIndex(
        (c) => c.id === id
      );
      if (indexEnfant !== -1) {
        this.reponsesParCommentaire[parentId].splice(indexEnfant, 1);
        return;
      }
    }
  }

  toggleFavori() {
    this.isFavori = !this.isFavori;
  }

  toggleExploitee() {
    this.isExploitee = !this.isExploitee;
  }

  toggleMiseDeCote() {
    this.isMiseDeCote = !this.isMiseDeCote;
  }
  startEdit(commentId: number, contenu: string) {
    this.editingCommentId = commentId;
    this.editedCommentContent = contenu;
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editedCommentContent = '';
  }

  saveEditedComment(commentId: number) {
    // Appeler ici la méthode qui met à jour le commentaire en base

    // Mise à jour locale
    const comment = this.commentairesPrincipaux.find((c) => c.id === commentId);
    if (comment) {
      comment.contenu = this.editedCommentContent;
    }

    this.cancelEdit();
  }
}
