import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

import { IonicModule } from '@ionic/angular';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { AuthGuard } from '$user-root/src/services/shared-service/guards/auth-guard.service';
import { sideMenuNavigationRoutes } from './side-menu-navigation.routes';
import { EmployeeSetupPageModule } from '$user-root/src/app/employee/employee-setup.module';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { UpdatePasswordModule } from '../employee/update-password/update-password.module';
import { EmailInvitationModule } from '../employee/email-invitation/email-invitation.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'
import { SharedService } from '../employee/shared.service';
import { RouteDialogComponent } from '../employee/route-dialog/route-dialog.component';

const bugsnagClient = bugsnag('a856baea01e03638403f09253bc830a2')

export function errorHandlerFactory() {
  return new BugsnagErrorHandler(bugsnagClient)
}

bugsnagClient.notify(new Error('Test error'))
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InlineSVGModule.forRoot(),
    HttpClientModule,
    EmployeeSetupPageModule,
    MatMenuModule,
    UpdatePasswordModule,
    EmailInvitationModule,
    DashboardModule,
    RouterModule.forChild(sideMenuNavigationRoutes)
  ],
  entryComponents: [RouteDialogComponent],
  providers: [AuthGuard, { provide: ErrorHandler, useFactory: errorHandlerFactory }, SharedService],
  declarations: [SideMenuNavigationComponent, RouteDialogComponent]
})
export class SideMenuNavigationModule { }

