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

//Pipe
import { PipeModule } from './pipes/pipe.module';

//Angular material
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

//pages
import { LoginComponent } from './pages/login/login.component';
import { Page404Component } from './pages/page404/page404.component';
import { Page500Component } from './pages/page500/page500.component';
import { GroupModuleComponent } from './views/settings/group-module/group-module.component';
import { ModuleComponent } from './views/settings/module/module.component';
import { GeneralTableComponent } from './shared/general-table/general-table.component';
import { UserComponent } from './views/user/user/user.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PermissionComponent } from './views/user/permission/permission.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { CompanyComponent } from './views/parameter/company/company.component';
import { RolComponent } from './views/user/rol/rol.component';
import { GroupButtonGeneralComponent } from './shared/group-button-general/group-button-general.component';


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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

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
    PermissionComponent,
    CompanyComponent,
    RolComponent,
    GroupButtonGeneralComponent
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
    MatExpansionModule,
    MatCheckbox,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    PipeModule,
    MatIconModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
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
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
