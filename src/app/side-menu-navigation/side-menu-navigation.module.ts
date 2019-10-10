import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

import { IonicModule } from '@ionic/angular';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { sideMenuNavigationRoutes } from './side-menu-navigation.routes';
import { EmployeeSetupPageModule } from 'src/app/employee/employee-setup.module';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { PublicPersonalDetailsModule } from '../employee/public-personal-details/public-personal-details.module';
import { UpdatePasswordModule } from '../employee/update-password/update-password.module';
import { EmailInvitationModule } from '../employee/email-invitation/email-invitation.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'

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
        PublicPersonalDetailsModule,
        MatMenuModule,
        UpdatePasswordModule,
        EmailInvitationModule,
        DashboardModule,
        RouterModule.forChild(sideMenuNavigationRoutes)
    ],
    providers: [AuthGuard, { provide: ErrorHandler, useFactory: errorHandlerFactory }],
    declarations: [SideMenuNavigationComponent]
})
export class SideMenuNavigationModule { }

