import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user/user.service';
import { RolService } from 'src/app/services/user/rol/rol.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import moment from 'moment';
import * as bootstrap from 'bootstrap';
import { PermissionService } from 'src/app/services/user/permission/permission.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit {

  public dataUser: any = [];
  public dataTransformada: any = [];
  public fieldsTable: any = [];
  public columnAlignments: any = [];
  public loading: boolean = true;
  public showForm: boolean = false;
  public formUser!: FormGroup;
  public action: string = 'save';
  public generating = false;
  public usernameDisabled = false;
  public passwordVisible = false;
  public passwordStrengthMessage: string | null = null;
  public passwordStrengthClass: string | null = null;
  public dataPermission: any = [];
  public dataPermissionSelected: any = [];
  public selectAllCheck: boolean = true;
  public textSelectAll: string = 'Seleccionar todo';
  public dataRol: any = [];
  public filteredRoles: any[] = this.dataRol;
  public permissionSuggested: any = [];
  public selectedFile: any;
  public dataTemp: any = [];
  public showAddButton: boolean = false;
  public showImportButton: boolean = false;
  public showExportButton: boolean = false;
  public searchControl = new FormControl('');
  public totalRecord: number = 0;
  public loadingTable: boolean = false;

  constructor(
    private userService: UserService,
    private rolService: RolService,
    private permissionService: PermissionService,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder
  ) { }


  async ngOnInit(): Promise<void> {
    this.createForm();
  }

  public createForm() {
    this.formUser = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: [{ value: '', disabled: true }, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      image_profile: [null],
      is_disabled: [true],
      rol_id: [null, Validators.required]
    });
    this.listPermission();
  }

  private async getDataUser(params: any): Promise<any> {
    this.loadingTable = true;
    return new Promise((resolve, reject) => {
      this.userService.getDataUser(params).subscribe(
        response => {
          this.totalRecord = response.total;
          this.dataUser = response.data;
          this.dataTransformada = this.formatedData(response.data);
          resolve(this.dataTransformada)
          this.checkPermissionsButton();
          this.loadingTable = false;
        },
        error => {
          reject(error);
          this.loadingTable = false; // Asegúrate de ocultar el spinner en caso de error
        }
      );
    });
  }

  public formatedData(response: any) {
    return response.map((item: any) => {
      return {
        "id": item.id,
        "is_disabled": item.is_disabled,
        "Nombres": item.name,
        "Usuario": item.username,
        "Correo": item.email,
        "Foto": (item.image_profile !== null) ? environment.apiStorage + item.image_profile : null,
        "Fecha creación": moment(item.created_at).format('DD/MM/YYYY hh:mm:ss A'),
        "Ultima actualización": moment(item.updated_at).format('DD/MM/YYYY hh:mm:ss A')
      };
    });
  }

  private getFieldsTable() {
    return ['Nombres', 'Usuario', 'Correo', 'Foto'];
  }

  private getColumnAlignments() {
    return ['left', 'left', 'left', 'center'];
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addUser();
        break;
      case 'import':
        this.importData();
        break;
      case 'export':
        this.exportData();
        break;
    }
  }

  public addUser() {
    this.showForm = true;
    this.resetForms();
    this.action = 'save';
  }

  public importData() {
    this.generalService.alertMessageInCreation();
  }

  public exportData() {
    this.generalService.alertMessageInCreation();
  }

  resetForms() {
    this.formUser.reset();
    this.formUser.untouched;
    this.passwordStrengthMessage = '';
    this.passwordStrengthClass = '';
    this.textSelectAll = 'Seleccionar todo';
    this.dataPermissionSelected = [];
    this.permissionSuggested = [];
    this.selectAllCheck = true;
  }

  public backToTable() {
    this.showForm = false;
    this.resetForms();
  }

  onSubmit() {
    if (this.formUser.valid) {
      let data = {
        name: this.formUser.get('name')?.value,
        username: this.formUser.get('username')?.value,
        email: this.formUser.get('email')?.value,
        password: this.formUser.get('password')?.value,
        rol_id: this.formUser.get('rol_id')?.value,
        image_profile: this.selectedFile || null,
        is_disabled: this.formUser.get('is_disabled')?.value,
        permissions: this.dataPermissionSelected
      };
      if (this.action === 'save') {
        this.saveNewUser(data);
      }

      if (this.action === 'edit') {
        this.editUser(data, this.dataTemp.id);
      }
    }
  }

  public saveNewUser(data: {}) {
    this.loading = true;
    this.userService.sendUser(data).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.dataUser = response.original.data;
          if (Array.isArray(this.dataUser)) {
            this.dataTransformada = this.formatedData(this.dataUser);
          } else {
            this.dataTransformada = [];
          }

          this.loading = false;
          this.showForm = false;
          this.generalService.alertMessage('¡Éxito!', response.original.message, 'success');
        } else {
          this.loading = false;
          this.generalService.alertMessage('Advertencia', response.original.message, 'warning');
        }
      },
      error: (error) => {
        this.loading = false;
        // Verifica si hay errores de validación
        if (error.error && error.error.errors) {
          const validationErrors = this.formatValidationErrors(error.error.errors);
          this.generalService.alertMessage('Error de validación', validationErrors, 'error');
        } else {
          this.generalService.alertMessage('Error', 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
        }
      }
    });
  }

  public editUser(data: any, id: number) {
    this.loading = true;
    this.userService.editUser(data, id).subscribe({
      next: (response) => {
        if (response && response.original.data) {
          this.dataUser = response.original.data;

          if (Array.isArray(this.dataUser)) {
            this.dataPermissionSelected = [];
            this.dataTransformada = this.formatedData(this.dataUser);
            this.resetForms();
          } else {
            this.dataTransformada = [];
          }
          this.showForm = false;
          this.loading = false;
          this.generalService.alertMessage('¡Éxito!', response.original.message, 'success');
        } else {
          this.loading = false;
          this.generalService.alertMessage('Advertencia', response.original.message, 'warning');
        }
      },
      error: (error) => {
        this.loading = false;
        this.generalService.alertMessage('Error', 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  }

  generateUsername() {
    if (this.formUser.get('name')?.valid) {
      this.generating = true;
      this.usernameDisabled = true;
      this.formUser.get('name')?.disable();

      const name = this.formUser.get('name')?.value;
      this.userService.generateUsername(name).subscribe({
        next: (response) => {
          this.formUser.get('username')?.setValue(response);
        },
        error: (error) => {
          this.generating = false;
          this.usernameDisabled = false;
          console.error('Error generating username:', error);
        },
        complete: () => {
          this.generating = false;
          this.usernameDisabled = false;
          this.formUser.get('name')?.enable();
        }
      });
    }
  }

  openInformation(text: number) {
    let html = '';
    if (text === 1) {
      html = `
        <div id="custom-icon-container">
          <p>Debe dar clic en Generar para generar un nombre de usuario válido</p>
        </div>`;
    } else if (text === 2) {
      html = `
      <div id="custom-icon-container">
        <p>Solo se permiten imágenes en formatos PNG, JPEG y JPG.</p>
      </div>`;
    } else if (text === 3) {
      html = `
      <div id="custom-icon-container">
        <p>Esta acción sugiere automáticamente los permisos adecuados según el rol seleccionado. Posteriormente, podrá agregar o eliminar permisos según sus necesidades de manera flexible.</p>
      </div>`;
    }

    Swal.fire({
      title: 'Información Importante',
      html: html,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      didOpen: () => {
        const iconPlaceholder = document.getElementById('icon-placeholder');
        const svgContainer = document.getElementById('svg-container');

        if (iconPlaceholder && svgContainer) {
          iconPlaceholder.innerHTML = svgContainer.innerHTML;
        }
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  checkPasswordStrength() {
    const password = this.formUser.get('password')?.value;
    if (password) {
      const strength = this.calculatePasswordStrength(password);
      this.passwordStrengthMessage = this.getPasswordStrengthMessage(strength);
      this.passwordStrengthClass = this.getPasswordStrengthClass(strength);
    } else {
      this.passwordStrengthMessage = null;
      this.passwordStrengthClass = null;
    }
  }

  calculatePasswordStrength(password: string): number {
    let strength = 0;

    // Al menos 8 caracteres
    if (password.length >= 8) strength++;

    // Letras mayúsculas
    if (/[A-Z]/.test(password)) strength++;

    // Letras minúsculas
    if (/[a-z]/.test(password)) strength++;

    // Números
    if (/[0-9]/.test(password)) strength++;

    // Caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Bonus: Longitud superior a 12 caracteres
    if (password.length > 12) strength++;

    // Bonus: Diversidad en los tipos de caracteres
    if (strength >= 4) strength++;  // Añade un bono si se alcanzan al menos 4 criterios

    return Math.min(strength, 5);  // Asegúrate de que el puntaje no supere 5
  }

  getPasswordStrengthMessage(strength: number): string {
    switch (strength) {
      case 0:
        return 'Contraseña muy débil';
      case 1:
        return 'Contraseña débil';
      case 2:
        return 'Contraseña aceptable';
      case 3:
        return 'Contraseña fuerte';
      case 4:
        return 'Contraseña muy fuerte';
      case 5:
        return 'Contraseña extremadamente fuerte';
      default:
        return 'Contraseña insegura';
    }
  }

  getPasswordStrengthClass(strength: number): string {
    switch (strength) {
      case 0:
        return 'password-very-weak';
      case 1:
        return 'password-weak';
      case 2:
        return 'password-fair';
      case 3:
        return 'password-strong';
      case 4:
        return 'password-very-strong';
      case 5:
        return 'password-extremely-strong';
      default:
        return '';
    }
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
        this.getRol();
      },
      error => {
        console.log(error.message);
      }
    );
  }

  async getRol(): Promise<void> {
    try {
      // Convierte el observable en una promesa
      const response = await this.rolService.getDataRoles().toPromise();
      this.dataRol = response.original;
      this.filteredRoles = this.dataRol;
      this.fieldsTable = this.getFieldsTable();
      this.columnAlignments = this.getColumnAlignments();
      this.dataTransformada = await this.getDataUser({
        search: '',
        sortColumn: 'name',
        sortOrder: 'desc',
        page: 1,
        pageSize: 10
      });
    } catch (error: any) {
      console.error('Error al obtener roles:', error.message);
      // Maneja el error según sea necesario
    }
  }

  checkPermissionsButton() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    for (const group of permissions) {
      for (const module of group.modules) {
        if (module.module_name === 'Usuarios') {
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
    this.loading = false;
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

  async checkedPermisosAsignados(permissions: any): Promise<void> {
    try {
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
    } catch (error: any) {
      console.error('Error al asignar permisos:', error.message);
      this.loading = false;
      throw error;
    }
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formUser.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  getTextClass() {
    return this.formUser.get('is_disabled')?.value ? 'text-success' : 'text-red';
  }

  async selectRol(id: number): Promise<void> {
    try {
      const response = await this.rolService.getPermissionByRol(id).toPromise();
      this.permissionSuggested = response.original;
    } catch (error: any) {
      console.error('Error al seleccionar rol:', error.message);
      throw error;
    }
  }

  async getPermissionByUser(id: number): Promise<void> {
    try {
      const response = await this.permissionService.getPermissionByUser(id).toPromise();
      await this.checkedPermisosAsignados(response.original);
      this.loading = false;
      this.showForm = true;
    } catch (error: any) {
      console.error('Error al seleccionar rol:', error.message);
      throw error;
    }
  }

  suggestedPermission() {
    this.checkedPermisosAsignados(this.permissionSuggested);
  }

  clearSelection(): void {
    this.formUser.get('rol_id')?.reset();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = await this.generalService.convertToBase64Files(file);
    }
  }

  private formatValidationErrors(errors: any): string {
    let errorMessage = '';
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errorMessage += `${errors[key].join(' ')}\n`;
      }
    }
    return errorMessage.trim();
  }

  async handleAction(event: { id: number, action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataUser.find((item: any) => item.id === id);

    if (action === "edit") {
      try {
        this.loading = true;
        this.resetForms();
        await this.setDataForm();
        await this.selectRol(this.dataTemp.rol_id);
        await this.getPermissionByUser(id);
      } catch (error) {
        console.error('Error en el flujo de edición:', error);
        this.loading = false;
      }
    }

    if (action === "delete") {
      this.deleteRecord(id);
    }

    if (action === "view") {
      this.dataTemp.image_profile = environment.apiStorage + this.dataTemp.image_profile;
      this.openModalView(this.dataTemp);
    }

    if (action === "ban") {
      this.disableOrEnableRecord(this.dataTemp);
    }
  }

  async setDataForm(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.formUser.controls["name"].setValue(this.dataTemp.name);
        this.formUser.controls["username"].setValue(this.dataTemp.username);
        this.formUser.controls["email"].setValue(this.dataTemp.email);
        this.formUser.controls["rol_id"].setValue(this.dataTemp.rol_id);
        this.formUser.controls["is_disabled"].setValue((this.dataTemp.is_disabled === 1) ? true : false);

        // Marcar los controles como tocados y verificar su validez
        this.formUser.markAllAsTouched();

        resolve();
      } catch (error) {
        reject(error);
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
          next: (response: any) => {
            this.dataUser = response.data;
            this.dataTransformada = this.formatedData(this.dataUser);
            this.loading = false;
            this.generalService.alertMessage('¡Éxito!', successMessage, 'success');
          },
          error: (error: any) => {
            this.loading = false;
            this.generalService.alertMessage('Error', 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo.', 'error');
          }
        });
      }
    });
  }

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.userService.enableRecordById(id),
    disable: (id: number) => this.userService.disableRecordById(id),
  };

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
        this.userService.deleteRecordById(id).subscribe({
          next: (response) => {
            this.dataUser = response.data;
            this.dataTransformada = this.formatedData(this.dataUser);
            this.loading = false;
            this.generalService.alertMessage('¡Eliminado!', 'El registro ha sido eliminado correctamente.', 'success');
          },
          error: (error) => {
            this.loading = false;
            this.generalService.alertMessage('Error', 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo.', 'error');
          }
        });
      }
    });
  }

  openModalView(data: any) {
    let rol = this.dataRol.filter((t: any) => t.id === data.rol_id);
    console.log(rol)
    Swal.fire({
      title: 'Usuarios',
      html: `
        <div id="custom-icon-container">
          <p><strong>Foto: </strong><p id="foto-placeholder"></p></p>
          <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
          <p><strong>Usuario : </strong> <span>${data.username}</span> </p>
          <p><strong>Rol : </strong> <span>${rol[0].name}</span> </p>
          <p><strong>Fecha de Creación: </strong> <span>${moment(data.created_at).format('DD/MM/YYYY hh:mm:ss A')}</span></p>
          <p><strong>Última actualización: </strong> <span>${moment(data.updated_at).format('DD/MM/YYYY hh:mm:ss A')}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      didOpen: () => {
        const fotoPlaceholder = document.getElementById('foto-placeholder');
        const svgContainer = document.getElementById('svg-container');

        if (fotoPlaceholder && svgContainer) {
          fotoPlaceholder.innerHTML = svgContainer.innerHTML;
        }
      }
    });
  }

  onFetchData(params: any): void {
    this.getDataUser({
      search: params.search,
      sortColumn: params.sortColumn,
      sortOrder: params.sortOrder,
      page: params.page,
      pageSize: params.pageSize
    });
  }

}