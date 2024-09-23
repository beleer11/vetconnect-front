import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { CompanyService } from '../../../services/companies/company/company.service';
import { GeneralService } from '../../../services/general/general.service';
import { UserService } from 'src/app/services/user/user/user.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { Observable } from 'rxjs';

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
  public parameterDefect = {
    search: '',
    sortColumn: 'name',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
  };

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private generalService: GeneralService,
  ) { }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formCompany.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  getTextClass() {
    return this.formCompany.get('is_disabled')?.value ? 'text-success' : 'text-red';
  }

  async ngOnInit() {
    this.createForm();
    this.dataCompanyTrasnform = await this.getData();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
    this.loading = false;
  }

  resetForms() {
    this.formCompany.reset();
    this.textSelectAll = 'Seleccionar todo';
    this.dataPermissionSelected = [];
    this.selectAllCheck = true;
  }

  handleAction(event: { id: number; action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataCompany.find((item: any) => item.id === id);

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
      // Devuelve un mensaje personalizado cuando no hay datos
      return [{
        "No se encontraron resultados": "No se encontraron registros que coincidan con los criterios de búsqueda. Intente con otros términos.",
      }];
    }
    return response.map((item: any) => {
      return {
        id: item.id,
        is_disabled: item.is_disabled,
        "Nombre": item.name,
        "Correo": item.email,
        "Razón social": item.legal_representative,
      };
    });
  }

  private getFieldsTable() {
    return ['Nombre', 'Correo', 'Razón social'];
  }

  private getColumnAlignments() {
    return ['left', 'left', 'center'];
  }

  validateNumberInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    const isNumber = /^[0-9-()+]+$/.test(event.key);

    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  public createForm() {
    this.formCompany = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      logo: [''],
      razon_social: ['', Validators.required, Validators.minLength(3)],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      nit: ['', [Validators.required]],
      representante_legal: ['', [Validators.required, Validators.minLength(3)]],
      is_disabled: [false, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.formCompany.valid) {
      let data = {
        nombre: this.formCompany.get('nombre')?.value,
        email: this.formCompany.get('email')?.value,
        logo: this.formCompany.get('logo')?.value,
        razon_social: this.formCompany.get('razonSocial')?.value,
        telefono: this.formCompany.get('telefono')?.value,
        nit: this.formCompany.get('nit')?.value,
        representante_legal: this.formCompany.get('representante')?.value,
      };
      console.log(data);
      if (this.action === 'save') {
        this.saveNewCompany(data);
      }
      if (this.action === 'edit') {
        this.editCompany(data, this.dataTemp.id);
      }
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


  public saveNewCompany(data: any) {
    this.loading = true;
    this.companyService.sendCompany(data).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.dataCompany = response.original.data;
          if (Array.isArray(this.dataCompany)) {
            this.dataPermissionSelected = [];
            this.dataCompanyTrasnform = this.formatedData(this.dataCompany);
          } else {
            this.dataCompanyTrasnform = [];
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
        this.generalService.alertMessage('Error', 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
      }
    });
  }

  public editCompany(data: any, id: number) {
    this.loading = true;
    this.companyService.editCompany(data, id).subscribe({
      next: (response) => {
        if (response && response.original.data) {
          this.dataCompany = response.original.data;

          if (Array.isArray(this.dataCompany)) {
            this.dataPermissionSelected = [];
            this.dataCompanyTrasnform = this.formatedData(this.dataCompany);
          } else {
            this.dataCompanyTrasnform = [];
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
            this.dataCompany = response.data;
            this.dataCompanyTrasnform = this.formatedData(this.dataCompany);
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

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.companyService.enableRecordById(id),
    disable: (id: number) => this.companyService.disableRecordById(id),
  };

  openModalView(data: any) {
    Swal.fire({
      title: 'Companía',
      html: `
        <div id="custom-icon-container">
          <p><strong>Nombre: </strong> <span>${data.nombre}</span></p>
          <p><strong>Correo electrónico: </strong> <span>${data.email}</span></p>
          <p><strong>Razón Social: </strong> <span>${data.razon_social}</span></p>
          <p><strong>Teléfono: </strong> <span>${data.telefono}</span></p>
          <p><strong>NIT: </strong> <span>${data.nit}</span></p>
          <p><strong>Representante Legal: </strong> <span>${data.representante_legal}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
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
