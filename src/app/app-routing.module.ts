import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  // {
  //   path: 'login1',
  //   loadChildren: () => import('$admin-root/src/app/login/login.module').then( m => m.LoginModule )
  // },
  // {
  //   path: 'test1',
  //   loadChildren: () => import('@hanani/eleave-user/src/app/app.module').then(m => m.AppModule)
  // },
  // {
  //   path: 'admin',
  //   loadChildren: () => import('@zencomputersystems/eleave-admin/src/app/app.module').then( m => m.AppModule)
  // },
  // {
  //   path: 'user',
  //   loadChildren: () => import('@zencomputersystems/eleave-admin/src/app/app.module').then(m => m.AppModule)
  // },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }  
