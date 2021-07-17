import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { UserRole } from './enum/user-role';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./module/admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [AuthGuard],
    data: { roles: [UserRole.ADMIN] },
  },
  {
    path: 'user',
    loadChildren: () => import('./module/user/user.module').then(m => m.UserPageModule),
    canActivate: [AuthGuard],
    data: { roles: [UserRole.USER] },
  },
  {
    path: '',
    redirectTo: 'auth',
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
