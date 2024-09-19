import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-group-button-general',
  templateUrl: './group-button-general.component.html',
  styleUrl: './group-button-general.component.css'
})
export class GroupButtonGeneralComponent {
  @Input() buttonText: string = 'Agregar';
  @Input() showAddButton: boolean = false;
  @Input() showImportButton: boolean = false;
  @Input() showExportButton: boolean = false;
  @Output() buttonClick = new EventEmitter<string>();

  onClick(action: string) {
    this.buttonClick.emit(action);
  }
}
