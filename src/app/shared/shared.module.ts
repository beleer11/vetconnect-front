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

import { GeneralTableComponent } from './general-table/general-table.component';

@NgModule({
    declarations: [GeneralTableComponent],
    exports: [GeneralTableComponent],
    imports: [
        CommonModule,
        CardModule,
        NavModule,
        IconModule,
        TabsModule,
        GridModule,
        ProgressModule,
        ReactiveFormsModule,
        ButtonModule,
        FormModule,
        ButtonGroupModule,
        ChartjsModule,
        AvatarModule,
        TableModule
    ]
})
export class SharedModule { }
