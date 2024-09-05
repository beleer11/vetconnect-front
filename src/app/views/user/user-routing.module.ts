import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListUserComponent } from './list-user/list-user.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'list-user',
    component: ListUserComponent,
    data: {
      title: 'Listar Usuarios'
    }
  },
  {
    path: 'user',
    component: UserComponent,
    data: {
      title: 'Usuarios'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
