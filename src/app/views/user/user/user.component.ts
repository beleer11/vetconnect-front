import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user/user.service';
import { RolService } from 'src/app/services/user/rol/rol.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import moment from 'moment';
import * as bootstrap from 'bootstrap';

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
  public showForm: boolean = true;
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
  public searchTerm = '';
  public dataRol: any = [];
  filteredRoles: any[] = this.dataRol;
  searchControl = new FormControl('');
  public permissionSuggested: any = [];


  constructor(
    private userService: UserService,
    private rolService: RolService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder
  ) { }


  async ngOnInit(): Promise<void> {
    //this.dataTransformada = await this.getDataUser();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
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
      rol_id: [{}, Validators.required]
    });
    this.loading = false;
    this.listPermission();
  }

  private async getDataUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getDataUser().subscribe(
        response => {
          this.dataUser = response;
          resolve(this.formatedData(response));
        },
        error => reject(error)
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
        "Foto": environment.apiStorage + item.image_profile,
        "Fecha creación": moment(item.created_at).format('DD/MM/YYYY hh:mm:ss A'),
        "Ultima actualización": moment(item.updated_at).format('DD/MM/YYYY hh:mm:ss A')
      };
    });
  }

  private getFieldsTable() {
    return ['Nombres', 'Usuario', 'Correo', 'Foto', 'Fecha creación', 'Ultima actualización'];
  }

  private getColumnAlignments() {
    return ['left', 'left', 'left', 'center', 'center', 'center'];
  }

  public addGroupModule() {
    this.resetForms();
    this.action = 'save';
  }

  resetForms() {
    this.formUser.reset();
    this.textSelectAll = 'Seleccionar todo';
    this.dataPermissionSelected = [];
    this.selectAllCheck = true;
  }

  public backToTable() {
    this.showForm = false;
    this.resetForms();
  }

  onSubmit() {
    //if (this.formUser.valid) {
    let data = {
      name: this.formUser.get('name')?.value,
      username: this.formUser.get('username')?.value,
      email: this.formUser.get('email')?.value,
      password: this.formUser.get('password')?.value,
      image_profile: this.formUser.get('image_profile')?.value,
      is_disabled: this.formUser.get('is_disabled')?.value,
      permissions: this.dataPermissionSelected
    }
    if (this.action === 'save') {
      console.log(data);
    }

    if (this.action === 'edit') {
      //this.editGroupModule(this.formGroupModule.get('nombre')?.value, this.dataTemp.id);
    }
    //}
  }

  public saveNewUser(nombre: string) {
    this.loading = true;
    /*this.moduleService.sendGroup({ "name": nombre }).subscribe({
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
    });*/
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

  public getRol() {
    this.rolService.getDataRoles().subscribe(
      response => {
        this.dataRol = response.original;
        this.filteredRoles = this.dataRol;
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

    this.loading = false;
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

  selectRol(id: number) {
    this.rolService.getPermissionByRol(id).subscribe(
      response => {
        this.permissionSuggested = response.original;
      },
      error => {
        console.log(error.message);
      }
    );
  }

  suggestedPermission() {
    this.checkedPermisosAsignados(this.permissionSuggested);
  }

}