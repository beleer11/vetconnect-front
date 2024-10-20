import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent {
  @Input() component: string = '';
  @Input() title: string = '';
  exportOption: string = 'all';
  pageFrom: number | null = null;
  pageTo: number | null = null;
  pageErrorEqual: boolean = false;
  pageErrorOrder: boolean = false;

  validatePages() {
    if (this.exportOption === 'byPage') {
      if (this.pageFrom !== null && this.pageTo !== null) {
        this.pageErrorEqual = this.pageFrom === this.pageTo;
        this.pageErrorOrder = this.pageTo < this.pageFrom;
      } else {
        this.pageErrorEqual = false;
        this.pageErrorOrder = false;
      }
    }
  }

  onExportOptionChange() {
    this.clearErrorMessages();
    if (this.exportOption === 'byPage') {
      this.validatePages();
    }
  }

  clearErrorMessages() {
    this.pageErrorEqual = false;
    this.pageErrorOrder = false;
  }

  resetModal() {
    this.exportOption = 'all';
    this.pageFrom = null;
    this.pageTo = null;
    this.pageErrorEqual = false;
    this.pageErrorOrder = false;
  }
}
