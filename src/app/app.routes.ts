import { Routes } from '@angular/router';
import { RegisterPage } from './register-page/register-page';
import { VerifyPage } from './verify-page/verify-page';
import { VisitorDetail } from './visitor-detail/visitor-detail';

export const routes: Routes = [
  { path: 'register', component: RegisterPage },
  { path: 'verify', component: VerifyPage },
  { path: 'verify/:id', component: VisitorDetail },
  { path: '', redirectTo: '/register', pathMatch: 'full' }
];
