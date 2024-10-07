import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user/user.service';
import { GeneralService } from '../../../services/general/general.service';
import { BranchService } from '../../../services/companies/branch/branch.service';
import { RolService } from '../../../services/user/rol/rol.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { PermissionService } from '../../../services/user/permission/permission.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css'],
})
export class UserProfilComponent implements OnInit {
  public loading: boolean = true;
  public user_information: any | null = null;
  public environment = environment;
  public formUserProfil!: FormGroup;
  public dataBranch: any = [];
  public permissionSuggested: any = [];
  public dataRol: any = [];
  public dataPermission: any = [];
  public dataCompany: any = [];
  public selectedFile: any;
  public passwordVisible = false;
  public passwordStrengthMessage: string | null = null;
  public passwordStrengthClass: string | null = null;
  public dataPermissionSelected: any = [];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private branchService: BranchService,
    private rolService: RolService,
    private location: Location,
    private permissionService: PermissionService
  ) {
    const storedUserInfo = localStorage.getItem('user_information');
    this.user_information = storedUserInfo
      ? JSON.parse(storedUserInfo).data
      : null;
  }

  async ngOnInit() {
    this.createForm();
    console.log(this.user_information);
  }

  public createForm() {
    this.formUserProfil = this.fb.group({
      name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      password: ['', Validators.required],
      image_profile: [''],
      is_disabled: [{ value: '', disabled: true }],
      rol_id: [{ value: '', disabled: true }, Validators.required],
      company_id: [{ value: '', disabled: true }, Validators.required],
      branch_id: [{ value: {}, disabled: true }, Validators.required],
    });
    this.listPermission();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  checkPasswordStrength() {
    const password = this.formUserProfil.get('password')?.value;
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
        this.getPermissionByUser();
      },
      error => {
        console.log(error.message);
      }
    );
  }

  getPermissionByUser() {
    this.permissionService.getPermissionByUser(this.user_information.id).subscribe(
      response => {
        this.checkedPermisosAsignados(response.original);
        this.getRol();
      },
      error => {
        console.log(error.message);
      }
    );
  }

  checkedPermisosAsignados(permissions: any) {

    // Limpia el array de permisos seleccionados
    this.dataPermissionSelected = [];

    // Recorre los permisos recibidos del backend
    permissions.forEach((p: any) => {
      console.log(this.dataPermissionSelected)
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
  }

  public checkedPermiso(moduleId: number, permisoId: number): boolean {
    // Encuentra el módulo específico en dataPermissionSelected
    const module = this.dataPermissionSelected.find((item: any) => item.module === moduleId);

    // Si el módulo existe, verifica si el permiso está en el array de permisos del módulo
    if (module) {
      return module.permissions.includes(permisoId);
    }
    return false;
  }

  async getRol(): Promise<void> {
    try {
      let response: any;
      response = await this.rolService.listRol().toPromise();
      this.dataRol = response?.data;
      this.dataCompany = await this.getCompanyData();
    } catch (error: any) {
      console.error('Error al obtener roles:', error.message);
    }
  }

  async getCompanyData(): Promise<void> {
    try {
      this.branchService.getListCompany().subscribe(
        async response => {
          this.dataCompany = response;
          this.getBranchByCompany();
        },
        error => {
          console.log(error.message);
        }
      );
    } catch (error: any) {
      console.error('Error al obtener roles:', error.message);
    }
  }

  getBranchByCompany() {
    this.branchService.getCompanyByBranch(this.user_information.company_id).subscribe(
      async response => {
        this.dataBranch = response;
        this.setDataForm();
      },
      error => {
        console.log(error.message);
      }
    );
  }

  setDataForm() {
    this.formUserProfil.controls['name'].setValue(this.user_information.name);
    this.formUserProfil.controls['email'].setValue(this.user_information.email);
    this.formUserProfil.controls['image_profile'].setValue(this.user_information.image_profile);
    this.formUserProfil.controls['rol_id'].setValue(this.user_information.rol_id)
    this.formUserProfil.controls['username'].setValue(this.user_information.username);
    this.formUserProfil.controls["company_id"].setValue(this.user_information.company_id);
    this.formUserProfil.controls["branch_id"].setValue(this.user_information.branch_id);
    this.formUserProfil.controls["is_disabled"].setValue((this.user_information.is_disabled === 1) ? true : false);
    this.loading = false;
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = await this.generalService.convertToBase64Files(file);
    }
  }
  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formUserProfil.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  getTextClass() {
    return this.formUserProfil.get('is_disabled')?.value ? 'text-success' : 'text-red';
  }

  openInformation() {
    Swal.fire({
      title: 'Información Importante',
      html: `<div id="custom-icon-container"><p>Solo se permiten imágenes en formatos PNG, JPEG y JPG.</p></div>`,
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

  getModulesByGroup(groupId: number) {
    const res = this.dataPermission.modules.filter((module: any) => module.module_group_id === groupId);
    return res;
  }

  onSubmit() {
    if (this.formUserProfil.valid) {
      let data = {
        name: this.formUserProfil.get('name')?.value,
        username: this.formUserProfil.get('username')?.value,
        email: this.formUserProfil.get('email')?.value,
        password: this.formUserProfil.get('password')?.value,
        rol_id: this.formUserProfil.get('rol_id')?.value,
        image_profile: this.selectedFile || null,
        is_disabled: (this.formUserProfil.get('is_disabled')?.value === null) ? false : this.formUserProfil.get('is_disabled')?.value,
        company_id: this.formUserProfil.get('company_id')?.value,
        branch_id: this.formUserProfil.get('branch_id')?.value,
        permissions: this.dataPermissionSelected
      };
      this.editUser(data, this.user_information.id);
    }
  }

  public editUser(data: any, id: number) {
    this.loading = true;
    this.userService.editUser(data, id).subscribe({
      next: (response) => {
        if (response.original.success) {
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

  goBack() {
    this.location.back();
  }
}
