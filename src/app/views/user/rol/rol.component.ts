import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { UserService } from '../../../services/user/user/user.service';
import { RolService } from '../../../services/user/rol/rol.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { Observable } from 'rxjs';
import { GeneralService } from '../../../services/general/general.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {
  public dataRol: any = [];
  public dataRolTrasnform: any = [];
  public showForm: boolean = false;
  public formRol!: FormGroup;
  public action: string = 'save';
  public dataTemp: any = [];
  public loading: boolean = true;
  public dataPermission: any = [];
  public dataPermissionSelected: any = [];
  public textSelectAll: string = 'Seleccionar todo';
  public selectAllCheck: boolean = true;
  public showAddButton: boolean = false;
  public showImportButton: boolean = false;
  public showExportButton: boolean = false;
  public totalRecord: number = 0;
  public loadingTable: boolean = false;
  public acciones: boolean = true;
  public parameterDefect = {};
  public viewTable: boolean = false;

  constructor(
    private userService: UserService,
    private rolService: RolService,
    private fb: FormBuilder,
    private generalService: GeneralService,
  ) { }

  async ngOnInit() {
    this.createForm();
  }

  public addRole() {
    this.action = 'save';
    this.showForm = true;
    this.resetForms();
  }

  public backToTable() {
    this.showForm = false;
    this.resetForms();
  }

  resetForms() {
    this.formRol.reset();
    this.textSelectAll = 'Seleccionar todo';
    this.dataPermissionSelected = [];
    this.selectAllCheck = true;
    this.goToPreviewTab();
  }

  handleAction(event: { id: number, action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataRol.find((item: any) => item.id === id);

    if (action === "edit") {
      this.loading = true;
      this.formRol.controls["nombre"].setValue(this.dataTemp.name);
      this.formRol.controls["description"].setValue(this.dataTemp.description);
      this.formRol.markAllAsTouched();
      this.rolService.getPermissionByRol(this.dataTemp.id).subscribe(
        response => {
          this.checkedPermisosAsignados(response.original);
        },
        error => {
          console.log(error.message);
        }
      );
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

  private getData() {
    this.rolService.getDataRoles(this.parameterDefect).subscribe(
      response => {
        this.dataRol = response.data;
        this.totalRecord = response.total;
        this.dataRolTrasnform = this.formatedData(response.data);
        this.viewTable = true;
        this.loading = false;
      }, error => {
        this.generalService.alertMessage(
          '¡Ups! Algo salió mal',
          'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo o contacta a nuestro equipo de soporte si el problema persiste. ¡Estamos aquí para ayudarte!',
          'warning'
        );
        this.loading = false;
        this.viewTable = false;
      }
    );
  }

  public formatedData(response: any) {
    if (response.length === 0) {
      return [{
        "No se encontraron resultados": "No se encontraron registros que coincidan con los criterios de búsqueda. Intente con otros términos.",
      }];
    }
    return response.map((item: any) => {
      return {
        id: item.id,
        is_disabled: item.is_disabled,
        "Nombre": item.name,
        "Descripción": item.description,
        "Fecha creación": moment(item.created_at).format('DD/MM/YYYY hh:mm:ss A'),
        "Ultima actualización": moment(item.updated_at).format('DD/MM/YYYY hh:mm:ss A')
      };
    });
  }

  public getFieldsTable() {
    return ['Nombre', 'Descripción', 'Fecha creación', 'Ultima actualización'];
  }

  public getColumnAlignments() {
    return ['left', 'left', 'center', 'center'];
  }

  public createForm() {
    this.formRol = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ]+(\\s[a-zA-ZáéíóúÁÉÍÓÚÑñ]+)*$')]],
      description: ['', [Validators.minLength(10), Validators.maxLength(500)]],
    });
    this.loading = false;
    this.listPermission();
  }

  onSubmit() {
    if (this.formRol.valid) {
      let data = {
        name: this.formRol.get('nombre')?.value,
        description: this.formRol.get('description')?.value,
        permissions: this.dataPermissionSelected
      };

      if (this.action === 'save') {
        this.saveNewRol(data);
      }

      if (this.action === 'edit') {
        this.editRol(data, this.dataTemp.id);
      }
    }
  }

  public saveNewRol(data: any) {
    this.loading = true;
    this.rolService.sendRol(data).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.onFetchData(this.parameterDefect);
          this.resetForms();
          this.showForm = false;
          this.loading = false;
          this.generalService.alertMessage('¡Éxito!', response.original?.message || 'Operación exitosa', 'success');
        } else {
          this.loading = false;
          this.generalService.alertMessage(
            '¡Ups! Algo salió mal',
            'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo o contacta a nuestro equipo de soporte si el problema persiste. ¡Estamos aquí para ayudarte!',
            'warning'
          );
        }
      },
      error: (error) => {
        this.loading = false;
        this.generalService.alertMessage('Error', 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  }

  public editRol(data: any, id: number) {
    this.loading = true;
    this.rolService.editRol(data, id).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.onFetchData(this.parameterDefect);
          this.resetForms();
          this.showForm = false;
          this.loading = false;
          this.generalService.alertMessage('¡Éxito!', response.original?.message || 'Operación exitosa', 'success');
        } else {
          this.loading = false;
          this.generalService.alertMessage(
            '¡Ups! Algo salió mal',
            'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo o contacta a nuestro equipo de soporte si el problema persiste. ¡Estamos aquí para ayudarte!',
            'warning'
          );
        }
      },
      error: (error) => {
        this.loading = false;
        this.generalService.alertMessage('Error', 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  }

  goToNextTab() {
    const tabTriggerEl = document.querySelector('#permissions-tab') as HTMLElement;
    const tab = new bootstrap.Tab(tabTriggerEl);
    tab.show();
  }

  goToPreviewTab() {
    const tabTriggerEl = document.querySelector('#general-tab') as HTMLElement;
    const tab = new bootstrap.Tab(tabTriggerEl);
    tab.show();
  }

  listPermission() {
    this.userService.listPermission().subscribe(
      response => {
        this.dataPermission = response;
      },
      error => {
        console.log(error.message);
      }
    );
  }

  getModulesByGroup(groupId: number) {
    const res = this.dataPermission.modules.filter((module: any) => module.module_group_id === groupId);
    return res;
  }

  public checkedPermiso(moduleId: number, permisoId: number): boolean {
    // Encuentra el módulo específico en dataPermissionSelected
    const module = this.dataPermissionSelected.find((item: any) => item.module === moduleId);

    // Si el módulo existe, verifica si el permiso está en el array de permisos del módulo
    if (module) {
      return module.permissions.includes(permisoId);
    }

    // Si el módulo no está en dataPermissionSelected, retorna false
    return false;
  }

  public togglePermission(moduleId: number, permisoId: number) {
    // Encuentra el módulo seleccionado
    const moduleIndex = this.dataPermissionSelected.findIndex((item: any) => item.module === moduleId);

    if (moduleIndex === -1) {
      // Si el módulo no está en dataPermissionSelected, lo agregamos con el permiso seleccionado
      this.dataPermissionSelected.push({
        module: moduleId,
        permissions: [permisoId]
      });
    } else {
      // Si el módulo ya está en dataPermissionSelected, actualizamos sus permisos
      const permissionIndex = this.dataPermissionSelected[moduleIndex].permissions.indexOf(permisoId);

      if (permissionIndex === -1) {
        // Si el permiso no está en la lista, lo agregamos
        this.dataPermissionSelected[moduleIndex].permissions.push(permisoId);
      } else {
        // Si el permiso ya está en la lista, lo eliminamos
        this.dataPermissionSelected[moduleIndex].permissions.splice(permissionIndex, 1);

        // Si no quedan permisos en el módulo, lo eliminamos
        if (this.dataPermissionSelected[moduleIndex].permissions.length === 0) {
          this.dataPermissionSelected.splice(moduleIndex, 1);
        }
      }
    }
  }

  selectAllPermissions() {
    if (this.selectAllCheck) {
      this.dataPermissionSelected = [];
      this.rolService.setData(null);

      // Recorremos los grupos
      this.dataPermission.groups.map((c: any) => {
        let modules = this.getModulesByGroup(c.id);

        modules.map((module: any) => {
          // Verificamos si el módulo ya está en dataPermissionSelected
          let moduleIndex = this.dataPermissionSelected.findIndex(
            (item: any) => item.module === module.id
          );

          if (moduleIndex > -1) {
            // Si ya existe, agregamos los permisos que faltan
            this.dataPermission.permissions.map((p: any) => {
              const permissionIndex = this.dataPermissionSelected[moduleIndex].permissions.indexOf(p.id);
              if (permissionIndex === -1) {
                this.dataPermissionSelected[moduleIndex].permissions.push(p.id);
              }
            });
          } else {
            // Si no existe, creamos una nueva entrada
            this.dataPermissionSelected.push({
              module: module.id,
              permissions: this.dataPermission.permissions.map((p: any) => p.id)
            });
          }
        });
      });

      this.textSelectAll = 'Deseleccionar todo';
    } else {
      this.dataPermissionSelected = [];
      this.textSelectAll = 'Seleccionar todo';
    }

    this.selectAllCheck = !this.selectAllCheck;
  }

  checkedPermisosAsignados(permissions: any) {
    // Limpia el array de permisos seleccionados
    this.dataPermissionSelected = [];

    // Recorre los permisos recibidos del backend
    permissions.forEach((p: any) => {
      // Verifica si el módulo ya está en dataPermissionSelected
      const moduleIndex = this.dataPermissionSelected.findIndex((m: any) => m.module === p.module);

      if (moduleIndex > -1) {
        // Si el módulo ya existe, agrega los permisos si no están presentes
        p.permissions.forEach((perm: any) => {
          const permissionIndex = this.dataPermissionSelected[moduleIndex].permissions.indexOf(perm);
          if (permissionIndex === -1) {
            this.dataPermissionSelected[moduleIndex].permissions.push(perm);
          }
        });
      } else {
        // Si el módulo no existe, crea una nueva entrada con permisos
        this.dataPermissionSelected.push({
          module: p.module,
          permissions: [...p.permissions]
        });
      }
    });

    // Actualiza el estado de los checkboxes
    this.dataPermissionSelected.forEach((moduleData: any) => {
      moduleData.permissions.forEach((permiso: any) => {
        this.checkedPermiso(moduleData.module, permiso);
      });
    });
    this.showForm = true;
    this.loading = false;
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
        this.rolService.deleteRecordById(id).subscribe({
          next: (response) => {
            this.onFetchData(this.parameterDefect);
            this.loading = false;
            this.generalService.alertMessage('¡Eliminado!', 'El registro ha sido eliminado correctamente.', 'success');
          },
          error: (error) => {
            this.loading = false;
            this.generalService.alertMessage('Error', 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo. Si el problema persiste, comunícate con soporte técnico', 'error');
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
            this.onFetchData(this.parameterDefect);
            this.loading = false;
            this.generalService.alertMessage('¡Éxito!', successMessage, 'success');
          },
          error: (error) => {
            this.loading = false;
            this.generalService.alertMessage('Error', 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo. Si el problema persiste, comunícate con soporte técnico', 'error');
          }
        });
      }
    });
  }

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.rolService.enableRecordById(id),
    disable: (id: number) => this.rolService.disableRecordById(id),
  };

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formRol.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  openModalView(data: any) {
    Swal.fire({
      title: 'Roles',
      html: `
        <div id="custom-icon-container">
          <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
          <p><strong>Descripción : </strong> <span>${data.description}</span> </p>
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
        this.addRole();
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

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.rolService.getDataRoles(params).subscribe((response) => {
      this.dataRolTrasnform = this.formatedData(response.data);
      this.dataRol = response.data;
      this.totalRecord = response.total;
      this.loadingTable = false;
    }, (error) => {
      this.loadingTable = false;
      console.error('Error fetching data', error);
    });
  }

  setFilter(event: any) {
    this.loading = true;
    this.viewTable = false;
    this.parameterDefect = {
      dateInit: event.dateInit,
      dateFinish: event.dateFinish,
      state: event.state,
      name: event.name,
      search: '',
      sortColumn: 'name',
      sortOrder: 'desc',
      page: 1,
      pageSize: 10
    }
    this.getData();
  }

}
