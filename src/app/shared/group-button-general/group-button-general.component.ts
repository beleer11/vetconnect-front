import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-group-button-general',
  templateUrl: './group-button-general.component.html',
  styleUrl: './group-button-general.component.css'
})
export class GroupButtonGeneralComponent {
  @Input() buttonText: string = 'Agregar';
  @Input() component: string = '';
  @Input() btnExportDisable: boolean = true;
  public showAddButton: boolean = false;
  public showImportButton: boolean = false;
  public showExportButton: boolean = false;
  @Output() buttonClick = new EventEmitter<string>();

  async ngOnInit(): Promise<void> {
    this.checkPermissionsButton();
  }

  onClick(action: string) {
    this.buttonClick.emit(action);
  }

  checkPermissionsButton() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    for (const group of permissions) {
      for (const module of group.modules) {
        if (module.module_name === this.component) {
          module.permissions.forEach((perm: any) => {
            if (perm.name === 'Crear') {
              this.showAddButton = true;
            }
            if (perm.name === 'Importar') {
              this.showImportButton = true;
            }
            if (perm.name === 'Exportar') {
              this.showExportButton = true;
            }
          });
        }
      }
    }
  }
}
