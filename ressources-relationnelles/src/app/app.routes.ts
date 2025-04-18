import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ResourcesComponent } from './pages/ressources/resources.component';
import { ResourceDetailsComponent } from './pages/resource-details/resource-details.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'resources', component: ResourcesComponent },
    { path: 'login', component: LoginComponent },
    { path: 'resource/:id', component: ResourceDetailsComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'admin-users', component: AdminUsersComponent },

  ];
  
