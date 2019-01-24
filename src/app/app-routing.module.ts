import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'leave-type-setup',
    loadChildren: '../pages/admin/leave-type-setup/leave-type-setup.module#LeaveTypeSetupPageModule'
  },
  {
    path: 'leave-type-edit',
    loadChildren: '../pages/admin/leave-type-setup/form/leave-type-setup-form.module#LeaveTypeSetupFormModule'
  },
  {
    path: 'cost-centre-setup', loadChildren: '../pages/admin/cost-centre-setup/cost-centre-setup.module#CostCentreSetupPageModule'
  },
  {
    path: 'cost-centre-setup-edit',
    loadChildren: '../pages/admin/cost-centre-setup/form/cost-centre-setup-form.module#CostCentreSetupFormPageModule'
  },
  {
    path: 'branch-setup',
    loadChildren: '../pages/admin/branch-setup/branch-setup.module#BranchSetupPageModule' },
  {
    path: 'branch-setup-edit',
    loadChildren: '../pages/admin/branch-setup/form/branch-setup-form.module#BranchSetupFormPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
