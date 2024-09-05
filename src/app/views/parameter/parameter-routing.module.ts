import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModuleComponent } from './module/module.component';

const routes: Routes = [
  {
    path: '',
    component: ModuleComponent,
    data: {
      title: $localize`Modulos`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParameterRoutingModule {
}
