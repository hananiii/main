import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UpdatePasswordPage } from 'src/pages/employee/update-password/update-password.page';
import { EmailInvitationPage } from 'src/pages/employee/email-invitation/email-invitation.page';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'update-password', component: UpdatePasswordPage },
  { path: 'email-verify', component: EmailInvitationPage },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
