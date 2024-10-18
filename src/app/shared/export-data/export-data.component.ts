import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent {
  @Input() component: string = '';
  @Input() title: string = '';

  constructor() { }

}
