export interface User {
  id: number;
  email: string;
  password: string;
  role: number; // ✅ un ID de rôle
  actif: boolean;
}