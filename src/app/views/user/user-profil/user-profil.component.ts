import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user/user.service';
import { GeneralService } from '../../../services/general/general.service';
import { BranchService } from 'src/app/services/companies/branch/branch.service';
import { RolService } from 'src/app/services/user/rol/rol.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css'],
})
export class UserProfilComponent implements OnInit {
  public loading: boolean = true;
  public showForm: boolean = false;
  public user_information: any | null = null;
  public environment = environment;
  public formUserProfil!: FormGroup;
  public dataTemp: any = [];
  public loadingBranch: boolean = false;
  public dataBranch: any = [];
  public permissionSuggested: any = [];
  public dataRol: any = [];
  public searchControl = new FormControl('');
  public dataPermission: any = [];
  public filteredRoles: any[] = this.dataRol;
  public dataCompany: any = [];
  public dataTransformada: any = [];
  public totalRecord: number = 0;
  public dataUser: any = [];
  public selectedFile: any;
  public passwordVisible = false;
  public passwordStrengthMessage: string | null = null;
  public passwordStrengthClass: string | null = null;
  public parameterDefect = {
    search: '',
    sortColumn: 'name',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
  };

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private branchService: BranchService,
    private rolService: RolService,
  ) { }

  async ngOnInit() {
    this.createForm();
    const storedUserInfo = localStorage.getItem('user_information');
    this.user_information = storedUserInfo
      ? JSON.parse(storedUserInfo).data
      : null;
    console.log(this.user_information);

    await this.setDataForm();
  }

  public createForm() {
    this.formUserProfil = this.fb.group({
      name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      password: ['', Validators.required],
      image_profile: [{ value: '', disabled: true }],
      is_disabled: [true],
      rol_id: [{}, Validators.required],
      company_id: [{}, Validators.required],
      branch_id: [{ value: {}, disabled: true }, Validators.required],
    });
  }

  private async getDataUser(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getDataUser(params).subscribe(
        response => {
          this.totalRecord = response.total;
          this.dataUser = response.data;
          this.dataTransformada = this.formatedData(response.data);
          resolve(this.dataTransformada)
          this.loading = false;
        },
        error => {
          reject(error);
        }
      );
    });
  }

  public formatedData(response: any, fecth = false) {
    if (response.length === 0 && fecth) {
      // Devuelve un mensaje personalizado cuando no hay datos
      return [{
        "No se encontraron resultados": "No se encontraron registros que coincidan con los criterios de búsqueda. Intente con otros términos.",
      }];
    }

    // Si hay datos, los formatea
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
      let response: any;
      response = await this.rolService.listRol().toPromise();
      this.dataRol = response?.data;
      this.filteredRoles = this.dataRol;
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
          this.dataTransformada = await this.getDataUser(this.parameterDefect);
        },
        error => {
          console.log(error.message);
        }
      );
    } catch (error: any) {
      console.error('Error al obtener roles:', error.message);
    }
  }

  async setDataForm(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.formUserProfil.controls['name'].setValue(this.user_information.name);
        this.formUserProfil.controls['email'].setValue(this.user_information.email);
        this.formUserProfil.controls['image_profile'].setValue(this.user_information.image_profile);
        this.formUserProfil.controls['username'].setValue(this.user_information.username);
        console.log(this.user_information.rol_id)
        this.formUserProfil.controls["company_id"].setValue(this.dataTemp.company_id);
        this.formUserProfil.controls["branch_id"].setValue(this.dataTemp.branch_id);
        this.formUserProfil.controls["is_disabled"].setValue((this.dataTemp.is_disabled === 1) ? true : false);

        this.getBranchByCompany(this.dataTemp.company_id);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  clearSelection(): void {
    this.formUserProfil.get('rol_id')?.reset();
  }

  clearSelectionCompany(): void {
    this.formUserProfil.get('company_id')?.reset();
    this.formUserProfil.get('company_id')?.markAsTouched();
    this.formUserProfil.controls['branch_id'].disable();
    this.dataBranch = [];
  }

  clearSelectionBranch(): void {
    this.formUserProfil.get('branch_id')?.reset();
    this.formUserProfil.get('branch_id')?.markAsTouched();
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

  async selectRol(id: number): Promise<void> {
    try {
      const response = await this.rolService.getPermissionByRol(id).toPromise();
      this.permissionSuggested = response.original;
    } catch (error: any) {
      console.error('Error al seleccionar rol:', error.message);
      throw error;
    }
  }

  public getBranchByCompany(id: any) {
    this.loadingBranch = true;
    this.branchService.getCompanyByBranch(id).subscribe(
      async response => {
        this.dataBranch = response;
        this.loadingBranch = false;
        this.formUserProfil.controls['branch_id'].enable();
      },
      error => {
        console.log(error.message);
        this.loadingBranch = true;
      }
    );
  }
}
