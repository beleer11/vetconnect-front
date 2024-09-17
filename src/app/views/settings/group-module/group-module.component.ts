import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleService } from '../../../services/settings/module/module.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-group-module',
  templateUrl: './group-module.component.html',
  styleUrls: ['./group-module.component.css'],
})

export class GroupModuleComponent implements OnInit {
  public dataModule: any = [];
  public dataModuleTrasnform: any = [];
  public fieldsTable: any = [];
  public columnAlignments: any = [];
  public showForm: boolean = false;
  public formGroupModule!: FormGroup;
  public action: string = 'save';
  public dataTemp: any = [];
  public loading: boolean = true;
  public showAddButton: boolean = false;
  public showImportButton: boolean = false;
  public showExportButton: boolean = false;

  constructor(
    private moduleService: ModuleService,
    private fb: FormBuilder,
    private generalService: GeneralService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.dataModuleTrasnform = await this.getData();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
    this.createForm();
  }

  private async getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.moduleService.getDataGroupModule().subscribe(
        response => {
          this.dataModule = response;
          resolve(this.formatedData(response));
          this.checkPermissionsButton();
        },
        error => reject(error)
      );
    });
  }

  private getFieldsTable() {
    return ['Nombre', 'Fecha creación', 'Ultima actualización'];
  }

  private getColumnAlignments() {
    return ['left', 'center', 'center'];
  }

  public createForm() {
    this.formGroupModule = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.loading = false;
  }

  onSubmit() {
    if (this.formGroupModule.valid) {
      if (this.action === 'save') {
        this.saveNewGroupModule(this.formGroupModule.get('nombre')?.value);
      }

      if (this.action === 'edit') {
        this.editGroupModule(this.formGroupModule.get('nombre')?.value, this.dataTemp.id);
      }
    }
  }

  handleAction(event: { id: number, action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataModule.find((item: any) => item.id === id);

    if (action === "edit") {
      this.formGroupModule.controls["nombre"].setValue(this.dataTemp.name);
      this.showForm = true;
    }

    if (action === "delete") {
      this.deleteRecord(id);
    }

    if (action === "view") {
      this.openModalView(this.dataTemp);
    }

    if (action === "ban") {
      this.disableOrEnableRecord(this.dataTemp);
    }
  }

  public addGroupModule() {
    this.showForm = true;
    this.formGroupModule.reset();
    this.action = 'save';
  }

  public backToTable() {
    this.showForm = false;
    this.formGroupModule.reset();
  }

  public saveNewGroupModule(nombre: string) {
    this.loading = true;
    this.moduleService.sendGroup({ "name": nombre }).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.dataModule = response.original.data;
          if (Array.isArray(this.dataModule)) {
            this.dataModuleTrasnform = this.formatedData(this.dataModule);
          } else {
            this.dataModuleTrasnform = [];
          }

          this.loading = false;
          this.showForm = false;
          this.alertMessage('¡Éxito!', response.original.message, 'success');
        } else {
          this.loading = false;
          this.alertMessage('Advertencia', response.original.message, 'warning');
        }
      },
      error: (error) => {
        this.loading = false;
        this.alertMessage('Error', 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  }

  public editGroupModule(nombre: string, id: number) {
    this.loading = true;
    this.moduleService.editGroup(nombre, id).subscribe({
      next: (response) => {
        if (response && response.original.data) {
          this.dataModule = response.original.data;

          if (Array.isArray(this.dataModule)) {
            this.dataModuleTrasnform = this.formatedData(this.dataModule);
          } else {
            this.dataModuleTrasnform = [];
          }

          this.showForm = false;
          this.loading = false;
          this.alertMessage('¡Éxito!', response.original.message, 'success');
        } else {
          this.loading = false;
          this.alertMessage('Advertencia', response.original.message, 'warning');
        }
      },
      error: (error) => {
        this.loading = false;
        this.alertMessage('Error', 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  }

  public formatedData(response: any) {
    return response.map((item: any) => {
      return {
        id: item.id,
        is_disabled: item.is_disabled,
        "Nombre": item.name,
        "Fecha creación": moment(item.created_at).format('DD/MM/YYYY hh:mm:ss A'),
        "Ultima actualización": moment(item.updated_at).format('DD/MM/YYYY hh:mm:ss A')
      };
    });
  }

  deleteRecord(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el registro permanentemente. ¡No podrás revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.moduleService.deleteRecordGroupModuleById(id).subscribe({
          next: (response) => {
            this.dataModule = response.data;
            this.dataModuleTrasnform = this.formatedData(this.dataModule);
            this.loading = false;
            this.alertMessage('¡Eliminado!', 'El registro ha sido eliminado correctamente.', 'success');
          },
          error: (error) => {
            this.loading = false;
            this.alertMessage('Error', 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo.', 'error');
          }
        });
      }
    });
  }

  disableOrEnableRecord(data: any) {
    const actionText = data.is_disabled === 0 ? 'habilitar' : 'inhabilitar';
    const confirmButtonText = data.is_disabled === 0 ? 'Sí, habilitar' : 'Sí, inhabilitar';
    const successMessage = data.is_disabled === 0 ? 'El registro ha sido habilitado correctamente.' : 'El registro ha sido inhabilitado correctamente.';

    Swal.fire({
      title: `¿Deseas ${actionText} este registro?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f39c12',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        const action = data.is_disabled === 0 ? 'enable' : 'disable';
        this.actionMap[action](data.id).subscribe({
          next: (response) => {
            this.dataModule = response.data;
            this.dataModuleTrasnform = this.formatedData(this.dataModule);
            this.loading = false;
            this.alertMessage('¡Éxito!', successMessage, 'success');
          },
          error: (error) => {
            this.loading = false;
            this.alertMessage('Error', 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo.', 'error');
          }
        });
      }
    });
  }

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.moduleService.enableRecordGroupModuleById(id),
    disable: (id: number) => this.moduleService.disableRecordGroupModuleById(id),
  };

  openModalView(data: any) {
    Swal.fire({
      title: 'Grupo Módulo',
      html: `
        <div>
        <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
        <p> <strong>Fecha de Creación: </strong> <span>${moment(data.created_at).format('DD/MM / YYYY hh: mm:ss A')}</span></p>
          <p> <strong>Ultima actualización: </strong> <span>${moment(data.updated_at).format('DD/MM / YYYY hh: mm:ss A')}</span></p>
            </div>
              `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  public alertMessage(title: any, text: any, icon: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK'
    });
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addGroupModule();
        break;
      case 'import':
        this.importData();
        break;
      case 'export':
        this.exportData();
        break;
    }
  }

  public importData() {
    this.generalService.alertMessageInCreation();
  }

  public exportData() {
    this.generalService.alertMessageInCreation();
  }

  checkPermissionsButton() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    for (const group of permissions) {
      for (const module of group.modules) {
        if (module.module_name === 'Grupo de módulo') {
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
