export interface Ressource {
    id: number;
    titre: string;
    description: string;
    type: 'publique' | 'restreinte';
    categorie: string;
    dateCreation: Date;
  }
  