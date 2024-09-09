import { NgModule } from '@angular/core';
import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { WidgetsModule } from './views/widgets/widgets.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//pages
import { LoginComponent } from './pages/login/login.component';
import { Page404Component } from './pages/page404/page404.component';
import { Page500Component } from './pages/page500/page500.component';
import { GroupModuleComponent } from './views/parameter/group-module/group-module.component';
import { ModuleComponent } from './views/parameter/module/module.component';
import { GeneralTableComponent } from './shared/general-table/general-table.component';
import { UserComponent } from './views/user/user/user.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PermissionComponent } from './views/parameter/permission/permission.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component'

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
  TableModule
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { RouterModule } from '@angular/router';

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];
@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    LoginComponent,
    Page404Component,
    Page500Component,
    LoadingSpinnerComponent,
    GroupModuleComponent,
    ModuleComponent,
    GeneralTableComponent,
    UserComponent,
    DashboardComponent,
    PermissionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    CardModule,
    NgScrollbarModule,
    HttpClientModule,
    TableModule,
    CommonModule,
    ChartjsModule,
    WidgetsModule,
    RouterModule.forRoot([], { useHash: false }),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    {
      provide: IconSetService,
      useFactory: () => {
        const iconSetService = new IconSetService();
        iconSetService.icons = iconSubset as any;
        return iconSetService;
      },
    },
    IconSetService,
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
