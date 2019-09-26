import { Routes } from '@angular/router';
import { AuthGuard } from 'src/services/shared-service/guards/auth-guard.service';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { EmployeeSetupPage } from '../employee/employee-setup.component';
import { PageNotFoundComponent } from '../page-not-found.component';
import { PublicPersonalDetailsPage } from '../employee/public-personal-details/public-personal-details.component';
import { EmployeeDirectoryPage } from '../employee/employee-directory/employee-directory.component';
import { PersonalDetailsPage } from '../employee/personal-details/personal-details.component';
import { EmploymentDetailsPage } from '../employee/employment-details/employment-details.component';
import { LeaveEntitlementPage } from '../employee/leave-entitlement/leave-entitlement.component';
import { AccountSettingPage } from '../employee/account-setting/account-setting.component';
import { LeavePlanningPage } from '../employee/leave-entitlement/leave-planning/leave-planning.component';
import { DashboardPage } from '../dashboard/dashboard.component';
import { AwardCertificationPage } from '../employee/award-certification/award-certification.component';
import { EmployeeListPage } from '../employee/employee-directory/employee-list/employee-list.component';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'main',
        component: SideMenuNavigationComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardPage },
            { path: 'plan-my-leave', component: LeavePlanningPage },
            {
                path: 'employee-directory', component: EmployeeDirectoryPage,
                children: [
                    { path: '', redirectTo: 'list', pathMatch: 'full' },
                    { path: 'list', component: EmployeeListPage }
                ]
            },
            { path: 'user-public-profile', component: PublicPersonalDetailsPage },
            {
                path: 'employee-setup', component: EmployeeSetupPage,
                children: [
                    { path: '', redirectTo: 'personal-details', pathMatch: 'full' },
                    { path: 'personal-details', component: PersonalDetailsPage },
                    { path: 'employment-details/:id', component: EmploymentDetailsPage },
                    { path: 'leave-entitlement', component: LeaveEntitlementPage },
                    { path: 'awards-certification', component: AwardCertificationPage },
                    // { path: 'connection', component: ConnectionsPage },
                    { path: 'account', component: AccountSettingPage }
                ]
            }
        ]
    }
];

