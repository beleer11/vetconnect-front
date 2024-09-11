import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {
  public dataModule: any = [];
  public dataModuleTrasnform: any = [];
  public fieldsTable: any = [];
  public columnAlignments: any = [];
  public showForm: boolean = false;
  public formRol!: FormGroup;
  public action: string = 'save';
  public dataTemp: any = [];
  public loading: boolean = true;
  public dataPermission: any = [];
  public dataPermissionSelected: any = [];
  public textSelectAll: string = 'Seleccionar todo';
  public selectAllCheck: boolean = true;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.dataModuleTrasnform = await this.getData();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
    this.loading = false;
    this.createForm();
  }

  public addRole() {
    this.showForm = true;
    this.action = 'save';
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
  }

  handleAction(event: { id: number, action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataModule.find((item: any) => item.id === id);

    if (action === "edit") {
      this.loading = true;
      this.formRol.controls["nombre"].setValue(this.dataTemp.name);
      this.formRol.controls["description"].setValue(this.dataTemp.description);
      this.userService.getPermissionByRol(this.dataTemp.id).subscribe(
        response => {
          this.checkedPermisosAsignados(response.original);
        },
        error => {
          console.log(error.message);
        }
      );
      this.showForm = true;
    }

    if (action === "delete") {
      //this.deleteRecord(id);
    }

    if (action === "view") {
      //this.openModalView(this.dataTemp);
    }

    if (action === "ban") {
      //this.disableOrEnableRecord(this.dataTemp);
    }
  }

  private async getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getDataRoles().subscribe(
        response => {
          this.dataModule = response.original;
          resolve(this.formatedData(response.original));
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
        "Descripcion": item.description,
        "Fecha creación": moment(item.created_at).format('DD/MM/YYYY hh:mm:ss A'),
        "Ultima actualización": moment(item.updated_at).format('DD/MM/YYYY hh:mm:ss A')
      };
    });
  }

  private getFieldsTable() {
    return ['Nombre', 'Descripcion', 'Fecha creación', 'Ultima actualización'];
  }

  private getColumnAlignments() {
    return ['left', 'left', 'center', 'center'];
  }

  public createForm() {
    this.formRol = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
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
    this.userService.sendRol(data).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.dataModule = response.original.data;
          if (Array.isArray(this.dataModule)) {
            this.dataPermissionSelected = [];
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

  public editRol(data: any, id: number) {
    this.loading = true;
    this.userService.editRol(data, id).subscribe({
      next: (response) => {
        if (response && response.original.data) {
          this.dataModule = response.original.data;

          if (Array.isArray(this.dataModule)) {
            this.dataPermissionSelected = [];
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
      this.userService.setData(null);

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

    this.loading = false;
  }

}
