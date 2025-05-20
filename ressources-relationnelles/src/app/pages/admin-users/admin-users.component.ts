import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { User, Role } from '../../models/user.model';
import { AuthService } from '../../service/auth.service';

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

  constructor(private userService: UserService, private authService: AuthService) {}

  roles: string[] = [];
  selectedRole: string = ''; 

ngOnInit() {
  this.authService.getAllRoles().subscribe((roles) => {
    this.roles = roles;
    console.log(roles)
  });
}

  addUser() {
    if (this.newUser.email && this.newUser.password && this.newUser.role) {
      const newId = Math.max(...this.users.map(u => u.id)) + 1;
      const user: User = {
        id: newId,
        email: this.newUser.email,
        password: this.newUser.password,
        role: this.selectedRole as Role,
        actif: true
      };
      console.log(user)
      this.userService.addUser(user);
      this.newUser = { email: '', password: '', role: 'citoyen', actif: true };
    }
  }

  toggleActive(id: number) {
    this.userService.toggleActive(id);
  }
}
