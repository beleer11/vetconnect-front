import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
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
  public formPermission!: FormGroup;
  public action: string = 'save';
  public generating = false;
  public usernameDisabled = false;
  public passwordVisible = false;
  public passwordStrengthMessage: string | null = null;
  public passwordStrengthClass: string | null = null;
  public dataPermission: any = [];
  public dataPermissionSelected: any = [];

  constructor(
    private userService: UserService,
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
      image_profile: [null, Validators.required],
      is_disabled: [true]
    });
    this.formPermission = this.fb.group({
      checkPermission: ['', [Validators.required]]
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
    this.showForm = true;
    this.formUser.reset();
    this.action = 'save';
  }

  public backToTable() {
    this.showForm = false;
    this.formUser.reset();
  }

  onSubmit() {
    //if (this.formUser.valid) {
    if (this.action === 'save') {
      let data = {
        name: this.formUser.get('name')?.value,
        username: this.formUser.get('username')?.value,
        email: this.formUser.get('email')?.value,
        password: this.formUser.get('password')?.value,
        image_profile: this.formUser.get('image_profile')?.value,
        is_disabled: this.formUser.get('is_disabled')?.value,
        permissions: this.dataPermissionSelected
      }

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
        return 'Contraseña extremadamente fuerte';  // Nueva categoría añadida
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
        return 'password-extremely-strong';  // Nueva clase añadida
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

  getPermissionsByModule(moduleId: number) {
    const res = this.dataPermission.permissions.filter((permission: any) => permission.module_id === moduleId);
    return res;
  }

  public updatePermissionSelection(permission: any, moduleId: number) {
    const moduleIndex = this.dataPermissionSelected.findIndex((item: any) => item.module === moduleId);
    permission.selected = this.formPermission.get('checkPermission')?.value;

    if (moduleIndex > -1) {
      const permissionIndex = this.dataPermissionSelected[moduleIndex].permissions.indexOf(permission.id);

      if (permission.selected) {
        if (permissionIndex === -1) {
          this.dataPermissionSelected[moduleIndex].permissions.push(permission.id);
        }
      } else {
        if (permissionIndex > -1) {
          this.dataPermissionSelected[moduleIndex].permissions.splice(permissionIndex, 1);

          if (this.dataPermissionSelected[moduleIndex].permissions.length === 0) {
            this.dataPermissionSelected.splice(moduleIndex, 1);
          }
        }
      }
    } else {
      if (permission.selected) {
        this.dataPermissionSelected.push({
          module: moduleId,
          permissions: [permission.id]
        });
      }
    }
  }
}