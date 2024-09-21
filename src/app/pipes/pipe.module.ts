import { NgModule } from '@angular/core';
import { FilterRolPipe } from './rol/filter-rol.pipe';
import { FilterCompanyPipe } from './company/filter-company.pipe';

@NgModule({
  declarations: [FilterRolPipe, FilterCompanyPipe],
  exports: [FilterRolPipe, FilterCompanyPipe],
})
export class PipeModule {}
