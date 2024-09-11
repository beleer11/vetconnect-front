import { NgModule } from '@angular/core';
import { FilterRolPipe } from './rol/filter-rol.pipe';

@NgModule({
    declarations: [
        FilterRolPipe,
    ],
    exports: [
        FilterRolPipe,
    ],
})

export class PipeModule { }