import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';

import { ParameterRoutingModule } from './parameter-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModuleComponent } from './module/module.component';

@NgModule({
  declarations: [ModuleComponent],
  imports: [
    CommonModule,
    ParameterRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    GridModule,
    ProgressModule,
    ButtonModule,
    FormModule,
    ButtonGroupModule,
    ChartjsModule,
    AvatarModule,
    TableModule
  ]
})
export class ParameterModule { }
