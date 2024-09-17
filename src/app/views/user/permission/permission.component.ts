import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../services/user/permission/permission.service';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit {
  public loading: boolean = true;
  public dataModuleTrasnform: any = [];
  public dataModule: any = [];
  public fieldsTable: any = [];
  public columnAlignments: any = [];
  public showForm: boolean = false;
  public formPermission!: FormGroup;
  public action: string = 'save';
  public dataTemp: any = [];
  public showAddButton: boolean = false;
  public showImportButton: boolean = false;
  public showExportButton: boolean = false;

  constructor(
    private permissionService: PermissionService,
    private fb: FormBuilder,
    private generalService: GeneralService
  ) { }

  async ngOnInit(): Promise<void> {
    this.dataModuleTrasnform = await this.getData();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
    this.createForm();
  }

  private async getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.permissionService.getDataPermission().subscribe(
        response => {
          this.dataModule = response;
          resolve(this.formatedData(response));
          this.checkPermissionsButton();
        },
        error => reject(error)
      );
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

  private getFieldsTable() {
    return ['Nombre', 'Fecha creación', 'Ultima actualización'];
  }

  private getColumnAlignments() {
    return ['left', 'center', 'center'];
  }

  public createForm() {
    this.formPermission = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.loading = false;
  }

  public addNewPermission() {
    this.showForm = true;
    this.formPermission.reset();
    this.action = 'save';
  }

  public backToTable() {
    this.showForm = false;
    this.formPermission.reset();
  }

  handleAction(event: { id: number, action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataModule.find((item: any) => item.id === id);

    if (action === "edit") {
      this.loading = true;
      this.formPermission.controls["nombre"].setValue(this.dataTemp.name);
      this.formPermission.markAllAsTouched();
      this.showForm = true;
      this.loading = false;
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

  onSubmit() {
    if (this.formPermission.valid) {
      if (this.action === 'save') {
        this.saveNewPermission(this.formPermission.get('nombre')?.value);
      }

      if (this.action === 'edit') {
        this.editPermission(this.formPermission.get('nombre')?.value, this.dataTemp.id);
      }
    }
  }

  public saveNewPermission(nombre: string) {
    this.loading = true;
    this.permissionService.sendPermission({ "name": nombre }).subscribe({
      next: (response) => {
        if (response.original.success) {
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

  public editPermission(nombre: string, id: number) {
    this.loading = true;
    this.permissionService.editPermission({ "name": nombre }, id).subscribe({
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

  public alertMessage(title: any, text: any, icon: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK'
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
        this.permissionService.deleteRecordById(id).subscribe({
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
    enable: (id: number) => this.permissionService.enableRecordById(id),
    disable: (id: number) => this.permissionService.disableRecordById(id),
  };

  openModalView(data: any) {
    Swal.fire({
      title: 'Permisos',
      html: `
        <div id="custom-icon-container">
          <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
          <p><strong>Fecha de Creación: </strong> <span>${moment(data.created_at).format('DD/MM/YYYY hh:mm:ss A')}</span></p>
          <p><strong>Última actualización: </strong> <span>${moment(data.updated_at).format('DD/MM/YYYY hh:mm:ss A')}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addNewPermission();
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
        if (module.module_name === 'Permisos') {
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

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formPermission.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }


}
