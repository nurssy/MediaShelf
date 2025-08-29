import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { ProfileDesignComponent } from './profile-design/profile-design.component';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserComponent },
  { path: 'category/:id', component: CategoryDetailComponent },
  { path: 'settings', component: ProfileDesignComponent },
  { path: 'profile-design', component: ProfileDesignComponent }
];
