import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UpdatePasswordComponent } from './employee/update-password/update-password.component';
import { EmailInvitationComponent } from './employee/email-invitation/email-invitation.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'update-password', component: UpdatePasswordComponent },
  { path: 'email-verify', component: EmailInvitationComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
