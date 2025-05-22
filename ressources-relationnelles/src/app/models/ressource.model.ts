export interface Ressource {
    id: number;
    titre: string;
    description: string;
    type: 'publique' | 'restreinte';
    categorie: string;
    dateCreation: Date;
    userID : number
    validee: boolean; 
    suspendue?: boolean;
    relation?: string;  
    zone?: string;
    latitude?: number;
    longitude?: number;
    nom?: string; 

  }
  