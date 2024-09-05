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

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
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
export class UserModule { }
