import { Component, OnInit } from '@angular/core';
import { ProgressionService } from '../../service/progression.service';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-progressions',
  templateUrl: 'progression.component.html',
    imports: [CommonModule]
})
export class ProgressionComponent implements OnInit {
  progressions: any[] = [];

  constructor(
    private progressionService: ProgressionService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.progressionService.getForUser(userId).subscribe({
        next: (data) => {
          this.progressions = data;
        },
        error: (err) => console.error(err),
      })
    }
  }
}
