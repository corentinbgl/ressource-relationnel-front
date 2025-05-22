import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user$ = this.authService.currentUser$;
  menuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  logout() {
    this.snackBar.open('👋 À bientôt ! Déconnexion en cours...', '', {
      duration: 1500,
      panelClass: ['snackbar-logout']
    });

    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/']);
    }, 1500);
  }
  openSeq(event: MouseEvent) {
  event.preventDefault();

  const width = 600;
  const height = window.innerHeight;
  const left = window.innerWidth - width;
  const top = 0;

  window.open(
    'http://localhost:5341/',
    'seqLogs',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}
}
