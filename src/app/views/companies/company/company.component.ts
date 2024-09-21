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
    private userService: UserService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private generalService: GeneralService,
  ) { }

  async ngOnInit() {
    this.dataCompanyTrasnform = await this.getData();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
    this.loading = false;
    this.createForm();
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

    /*
    if (action === "edit") {
      this.loading = true;
      this.formCompany.controls["nombre"].setValue(this.dataTemp.name);
      this.formCompany.controls["description"].setValue(this.dataTemp.description);
      this.formCompany.markAllAsTouched();
      this.companyService.getPermissionByCompany(this.dataTemp.id).subscribe(
        response => {
          this.checkedPermisosAsignados(response.original);
        },
        error => {
          console.log(error.message);
        }
      );
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
      */
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

  public createForm() {
    this.formCompany = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      logo: [''],
      razon_social: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      nit: ['', [Validators.required, Validators.minLength(8)]],
      representante_legal: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.formCompany.valid) {
      let data = {
        name: this.formCompany.get('nombre')?.value,
        description: this.formCompany.get('description')?.value,
        permissions: this.dataPermissionSelected
      };

      if (this.action === 'save') {
        this.saveNewCompany(data);
      }

      if (this.action === 'edit') {
        this.editCompany(data, this.dataTemp.id);
      }
    }
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

  disableOrEnableRecord(data: any) {
    const actionText = data.is_disabled === 0 ? 'habilitar' : 'inhabilitar';
    const confirmButtonText =
      data.is_disabled === 0 ? 'Sí, habilitar' : 'Sí, inhabilitar';
    const successMessage =
      data.is_disabled === 0
        ? 'El registro ha sido habilitado correctamente.'
        : 'El registro ha sido inhabilitado correctamente.';

    Swal.fire({
      title: `¿Deseas ${actionText} este registro?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f39c12',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        const action = data.is_disabled === 0 ? 'enable' : 'disable';
        this.actionMap[action](data.id).subscribe({
          next: (response) => {
            this.dataCompany = response.data;
            this.dataCompanyTrasnform = this.formatedData(this.dataCompany);
            this.loading = false;
            this.generalService.alertMessage('¡Éxito!', successMessage, 'success');
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

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formCompany.get(controlName);
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
