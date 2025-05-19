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
        // Exemple : stocker le token JWT reçu
        localStorage.setItem('token', response.token);
        // Rediriger vers la page d'accueil ou autre
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = "Email ou mot de passe incorrect.";
      }
    });
  }
}
