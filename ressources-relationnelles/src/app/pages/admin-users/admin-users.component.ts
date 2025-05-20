import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user.model';
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
    role: 1,
    actif: true
  };

  constructor(private userService: UserService, private authService: AuthService) {}

  roles: { id: number, role: string }[] = [];
  selectedRole: number = 1; 

  roleLabels: { [key: string]: string } = {
    '1': 'Citoyen',
    '2': 'Modérateur',
    '3': 'Administrateur',
    '4': 'Super Administrateur'
  };
 

ngOnInit() {
  this.authService.getAllRoles().subscribe((roles) => {
    this.roles = roles;
    console.log(roles)

    console.log(this.getRoleLabel(3))
  });

  
  this.userService.getAllUsers().subscribe(users => {
    this.users = users;
    console.log(users)
  });

  
}

getRoleLabel(roleId: number): string {
  console.log(this.roleLabels)
  return this.roleLabels[roleId.toString()] || 'Inconnu';
}

  addUser() {
    if (this.newUser.email && this.newUser.password && this.newUser.role) {
      const newId = Math.max(...this.users.map(u => u.id)) + 1;
      const user: User = {
        id: newId,
        email: this.newUser.email,
        password: this.newUser.password,
        role: this.selectedRole ,
        actif: true
      };
      console.log(user)
      this.userService.addUser(user);
      this.newUser = { email: '', password: '', role: 1, actif: true };
    }
  }

  toggleActive(id: number) {
    this.userService.toggleActive(id);
  }
}
