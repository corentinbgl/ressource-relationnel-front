import { Ressource } from './ressource.model';

export interface Progression {
  id: number;
  favori: boolean;
  exploitee: boolean;
  miseDeCote: boolean;
  ressourceId: number;
  ressource: Ressource;
  userId: number;
}
