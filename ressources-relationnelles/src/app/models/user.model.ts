export type Role = 'citoyen' | 'modérateur' | 'administrateur' | 'super-administrateur';

export interface User {
  id: number;
  email: string;
  password: string;
  role: Role;
  actif: boolean;
}
