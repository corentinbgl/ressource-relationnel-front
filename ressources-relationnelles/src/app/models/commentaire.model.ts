export interface Commentaire {
    id: number;
    ressourceId: number;
    auteur: string;    // email ou nom
    contenu: string;
    date: Date;
    reponseA?: number; // ID du commentaire parent (si c'est une réponse)
  }
  