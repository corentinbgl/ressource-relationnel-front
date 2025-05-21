import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';            
  password = '';         
  errorMessage = '';     

  constructor(private authService: AuthService, private router: Router) {}

login() {
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      localStorage.setItem('token', response.token);
      this.router.navigate(['/']);
    },
    error: (err) => {
      // Vérifie si l'erreur a un message spécifique depuis le backend
      if (err.error && typeof err.error === 'string') {
        this.errorMessage = err.error; // message côté backend, ex: "Compte désactivé, contactez un administrateur."
      } else if (err.status === 401) {
        this.errorMessage = "Email ou mot de passe incorrect.";
      } else if (err.status === 403) {
        this.errorMessage = "Compte désactivé, contactez un administrateur.";
      } else {
        this.errorMessage = "Une erreur est survenue, veuillez réessayer.";
      }
    }
  });
}

}
