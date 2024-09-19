import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { Page404Component } from './pages/page404/page404.component';
import { Page500Component } from './pages/page500/page500.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { UserComponent } from './views/user/user/user.component';
import { ModuleComponent } from './views/settings/module/module.component';
import { GroupModuleComponent } from './views/settings/group-module/group-module.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PermissionComponent } from './views/user/permission/permission.component';
import { CompanyComponent } from './views/companies/company/company.component';
import { RolComponent } from './views/user/rol/rol.component';
import { BranchComponent } from './views/companies/branch/branch.component';

// Define las rutas directamente aquí
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login',
    },
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'rol',
        component: RolComponent,
      },
      {
        path: 'module',
        component: ModuleComponent,
      },
      {
        path: 'group-module',
        component: GroupModuleComponent,
      },
      {
        path: 'permission',
        component: PermissionComponent,
      },
      {
        path: 'company',
        component: CompanyComponent,
      },
      { path: 'branch', component: BranchComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '404', component: Page404Component },
  { path: '500', component: Page500Component },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
