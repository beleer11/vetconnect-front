import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRol',
})
export class FilterRolPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter(item => {
      return item.toLowerCase().includes(searchText);
    });
  }

}
