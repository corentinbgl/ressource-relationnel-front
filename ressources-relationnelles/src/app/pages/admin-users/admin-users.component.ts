import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { User, Role } from '../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  newUser: Partial<User> = {
    email: '',
    password: '',
    role: 'citoyen',
    actif: true
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  addUser() {
    if (this.newUser.email && this.newUser.password && this.newUser.role) {
      const newId = Math.max(...this.users.map(u => u.id)) + 1;
      const user: User = {
        id: newId,
        email: this.newUser.email,
        password: this.newUser.password,
        role: this.newUser.role as Role,
        actif: true
      };
      this.userService.addUser(user);
      this.newUser = { email: '', password: '', role: 'citoyen', actif: true };
    }
  }

  toggleActive(id: number) {
    this.userService.toggleActive(id);
  }
}
