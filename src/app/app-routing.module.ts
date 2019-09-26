import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UpdatePasswordPage } from './employee/update-password/update-password.component';
import { EmailInvitationPage } from './employee/email-invitation/email-invitation.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'update-password', component: UpdatePasswordPage },
  { path: 'email-verify', component: EmailInvitationPage },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
