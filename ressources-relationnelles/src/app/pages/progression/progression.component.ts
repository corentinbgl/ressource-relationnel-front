import { Component, OnInit } from '@angular/core';
import { ProgressionService } from '../../service/progression.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-progressions',
  templateUrl: 'progression.component.html',
})
export class ProgressionComponent implements OnInit {
  progressions: any[] = [];

  constructor(
    private progressionService: ProgressionService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId);
    if (userId) {
      this.progressionService.getForUser(userId).subscribe({
        next: (data) => {
          this.progressions = data;
          console.log('Données progression reçues :', this.progressions);
        },
        error: (err) => console.error(err),
      })
    }
  }
}
