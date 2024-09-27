import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/companies/company/company.service';
import { GeneralService } from '../../../services/general/general.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.css',
})
export class CompanyComponent implements OnInit {
  public dataCompany: any = [];
  public dataCompanyTrasnform: any = [];
  public fieldsTable: any = [];
  public columnAlignments: any = [];
  public showForm: boolean = false;
  public formCompany!: FormGroup;
  public action: string = 'save';
  public dataTemp: any = [];
  public selectedFile: any;
  public loading: boolean = true;
  public showAddButton: boolean = false;
  public showImportButton: boolean = false;
  public showExportButton: boolean = false;
  public totalRecord: number = 0;
  public loadingTable: boolean = false;
  public acciones: boolean = true;
  public parameterDefect = {
    search: '',
    sortColumn: 'name',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
  };
  public environment = environment;

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private generalService: GeneralService,
  ) { }

  async ngOnInit() {
    this.createForm();
    this.dataCompanyTrasnform = await this.getData();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
    this.loading = false;
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formCompany.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  getTextClass() {
    return this.formCompany.get('is_active')?.value ? 'text-success' : 'text-red';
  }

  resetForms() {
    this.selectedFile = '';
    this.formCompany.reset();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file)
      this.selectedFile = await this.generalService.convertToBase64Files(file);
      console.log(this.selectedFile)
    }
  }

  handleAction(event: { id: number; action: string }) {
    this.dataTemp = [];
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataCompany.find((item: any) => item.id === id);
    console.log(this.dataTemp)

    if (action === 'edit') {
      this.setDataForm();
      this.showForm = true;
    }

    if (action === 'delete') {
      this.deleteRecord(id);
    }

    if (action === 'view') {
      this.openModalView(this.dataTemp);
    }

    if (action === 'ban') {
      this.disableOrEnableRecord(this.dataTemp);
    }
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addCompany();
        break;
      case 'import':
        this.importData();
        break;
      case 'export':
        this.exportData();
        break;
    }
  }

  public addCompany() {
    this.showForm = true;
    this.formCompany.reset();
    this.action = 'save';
  }

  public backToTable() {
    this.showForm = false;
    this.formCompany.reset();
  }

  private async getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.companyService.getDataCompanies(this.parameterDefect).subscribe(
        response => {
          this.dataCompany = response.data;
          this.totalRecord = response.total;
          resolve(this.formatedData(response.data));
        },
        error => reject(error)
      );
    });
  }

  public formatedData(response: any, fecth = false) {
    if (response.length === 0 && fecth) {
      return [{
        "No se encontraron resultados": "No se encontraron registros que coincidan con los criterios de búsqueda. Intente con otros términos.",
      }];
    }
    return response.map((item: any) => {
      return {
        id: item.id,
        Nombre: item.name,
        Logo: (item.logo !== null) ? environment.apiStorage + item.logo : null,
        "Correo electrónico": item.email,
        "Razón social": item.legal_representative,
        is_disabled: item.is_active,
      };
    });
  }

  private getFieldsTable() {
    return ['Nombre', 'Correo electrónico', 'Razón social', 'Logo'];
  }

  private getColumnAlignments() {
    return ['left', 'left', 'center', 'center'];
  }

  validateNumberInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    const isNumber = /^[0-9]+$/.test(event.key);

    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  public createForm() {
    this.formCompany = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      logo: [''],
      business_name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      tax_id: ['', [Validators.required, Validators.minLength(8)]],
      legal_representative: ['', [Validators.required, Validators.minLength(3)]],
      is_active: [false],
    });
  }

  onSubmit() {
    if (this.formCompany.valid) {
      let data = {
        name: this.formCompany.get('name')?.value,
        email: this.formCompany.get('email')?.value,
        logo: this.selectedFile || null,
        business_name: this.formCompany.get('business_name')?.value,
        phone: this.formCompany.get('phone')?.value,
        tax_id: this.formCompany.get('tax_id')?.value,
        legal_representative: this.formCompany.get('legal_representative')?.value,
        is_active:
          this.formCompany.get('is_active')?.value === null
            ? false
            : this.formCompany.get('is_active')?.value,
      };

      if (this.action === 'save') {
        this.saveNewCompany(data);
      }

      if (this.action === 'edit') {
        this.editCompany(data, this.dataTemp.id);
      }
    }
  }

  async setDataForm(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.formCompany.controls['name'].setValue(this.dataTemp.name);
        this.formCompany.controls['email'].setValue(this.dataTemp.email);
        this.formCompany.controls['business_name'].setValue(this.dataTemp.business_name);
        this.formCompany.controls['phone'].setValue(this.dataTemp.phone);
        this.formCompany.controls['tax_id'].setValue(this.dataTemp.tax_id);
        this.formCompany.controls['legal_representative'].setValue(this.dataTemp.legal_representative);
        this.formCompany.controls['is_active'].setValue(this.dataTemp.is_active === 1 ? true : false);
        this.formCompany.markAllAsTouched();
        resolve();
      }
      catch (error) {
        reject(error);
      }
    })
  }

  disableOrEnableRecord(data: any) {
    const actionText = (data.is_active === 0) ? 'habilitar' : 'inhabilitar';
    const actionTextPlural = (data.is_active === 0) ? 'habilitados' : 'inhabilitados';
    const confirmButtonText =
      (data.is_active === 0) ? 'Sí, habilitar' : 'Sí, inhabilitar';
    const successMessage =
      (data.is_active === 0)
        ? 'El registro ha sido habilitado correctamente.'
        : 'El registro ha sido inhabilitado correctamente.';

    Swal.fire({
      title: `¿Deseas ${actionText} este registro?`,
      html: `<strong>Tenga en cuenta que al ${actionText} esta compañía, todas las sucursales asociadas y los usuarios de dichas sucursales también serán ${actionTextPlural}. Asegúrese de que esto sea lo que desea hacer.</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f39c12',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        const action = data.is_active === 0 ? 'enable' : 'disable';
        this.actionMap[action](data.id).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.onFetchData(this.parameterDefect);
              this.generalService.alertMessage(
                '¡Éxito!',
                successMessage,
                'success'
              );
            } else {
              this.generalService.alertMessage(
                'Error',
                'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo. Si el problema persiste, comunícate con soporte técnico',
                'error'
              );
            }
            this.loading = false;
          },
          error: (error: any) => {
            this.loading = false;
            this.generalService.alertMessage(
              'Error',
              'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo. Si el problema persiste, comunícate con soporte técnico',
              'error'
            );
          },
        });
      }
    });
  }

  public saveNewCompany(data: any) {
    this.loading = true;
    this.companyService.sendCompany(data).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.onFetchData(this.parameterDefect);
          this.resetForms();
          this.showForm = false;
          this.loading = false;
          this.generalService.alertMessage('¡Éxito!', response.original.message, 'success')
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

  public editCompany(data: any, id: number) {
    this.loading = true;
    this.companyService.editCompany(data, id).subscribe({
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

  deleteRecord(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro permanentemente. ¡No podrás revertirlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.companyService.deleteRecordById(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.onFetchData(this.parameterDefect);
              this.generalService.alertMessage(
                '¡Eliminado!',
                'El registro ha sido eliminado correctamente.',
                'success'
              );
            } else {
              const branchesMessage = response.branches.join(', ');
              const fullMessage = `No puedes eliminar la compañía porque tiene sucursales asociadas:<br><br><strong>${branchesMessage}</strong><br><br>Por favor, elimina primero las sucursales antes de intentar eliminar la compañía.`;

              this.generalService.alertMessageHtml(
                'Error',
                fullMessage,
                'error'
              );
            }
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.generalService.alertMessage(
              'Error',
              'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo. Si el problema persiste, comunícate con soporte técnico',
              'error'
            );
          },
        });
      }
    });
  }

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.companyService.enableRecordById(id),
    disable: (id: number) => this.companyService.disableRecordById(id),
  };

  openModalView(data: any) {
    Swal.fire({
      title: 'Companía',
      html: `
        <div id="custom-icon-container">
          <p><strong>Logo: </strong><p id="foto-placeholder"></p></p>
          <p><strong>Nombre: </strong> <span>${data.name}</span></p>
          <p><strong>Correo electrónico: </strong> <span>${data.email}</span></p>
          <p><strong>Razón Social: </strong> <span>${data.business_name}</span></p>
          <p><strong>Teléfono: </strong> <span>${data.phone}</span></p>
          <p><strong>NIT: </strong> <span>${data.tax_id}</span></p>
          <p><strong>Representante Legal: </strong> <span>${data.legal_representative}</span></p>
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

  public importData() {
    this.generalService.alertMessageInCreation();
  }

  public exportData() {
    this.generalService.alertMessageInCreation();
  }

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.companyService.getDataCompanies(params).subscribe((response) => {
      this.dataCompanyTrasnform = this.formatedData(response.data, true);
      this.dataCompany = response.data;
      this.totalRecord = response.total;
      if (response.data.length === 0) {
        this.fieldsTable = ["No se encontraron resultados"];
        this.columnAlignments = ["center"];
        this.acciones = false;
      } else {
        this.fieldsTable = this.getFieldsTable();
        this.columnAlignments = this.getColumnAlignments();
        this.acciones = true;
      }
      this.loadingTable = false;
    }, (error) => {
      this.loadingTable = false;
      console.error('Error fetching data', error);
    });
  }
}
