import { BranchService } from './../../../services/companies/branch/branch.service';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import * as bootstrap from 'bootstrap';
import { GeneralService } from '../../../services/general/general.service';
import { UserService } from '../../../services/user/user/user.service';
import { CompanyService } from '../../../services/companies/company/company.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css',
})
export class BranchComponent {
  public loading: boolean = true;
  public showForm: boolean = false;
  public dataBranch: any = [];
  public showAddButton: boolean = false;
  public showImportButton: boolean = false;
  public showExportButton: boolean = false;
  public action: string = 'save';
  public dataBranchTrasnform: any = [];
  public acciones: boolean = true;
  public loadingTable: boolean = false;
  public totalRecord: number = 0;
  public dataTemp: any = [];
  public dataCompany: any = [];
  public formBranch!: FormGroup;
  public searchControl = new FormControl('');
  public parameterDefect = {};
  public viewTable: boolean = false;

  constructor(
    private branchService: BranchService,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private companyService: CompanyService
  ) { }

  async ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.formBranch = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      company_id: [{}, Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      is_active: [false],
    });
    this.loading = false;
    this.listCompany();
  }

  public listCompany() {
    this.branchService.getListCompany().subscribe(
      (response) => {
        this.dataCompany = response;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private getData() {
    this.branchService.getDataBranch(this.parameterDefect).subscribe(
      (response) => {
        this.dataBranch = response.data;
        this.totalRecord = response.total;
        this.dataBranchTrasnform = this.formatedData(response.data);
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
      });
  }

  public getFieldsTable() {
    return ['Nombre', 'Compañía', 'Dirección', 'Descripción', 'Teléfono'];
  }

  public getColumnAlignments() {
    return ['left', 'left', 'center', 'center'];
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addBranch();
        break;
      case 'import':
        this.importData();
        break;
      case 'export':
        this.exportData();
        break;
    }
  }

  public addBranch() {
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
    this.formBranch.reset();
    this.formBranch.untouched;
  }

  public backToTable() {
    this.showForm = false;
    this.resetForms();
  }

  public formatedData(response: any) {
    if (response.length === 0) {
      return [
        {
          'No se encontraron resultados': 'No se encontraron registros que coincidan con los criterios de búsqueda. Intente con otros términos.',
        }
      ];
    }

    return response.map((item: any) => {
      return {
        id: item.id,
        Nombre: item.name,
        Compañía: item.company_name,
        Dirección: item.address,
        Descripción: item.description,
        Teléfono: item.phone,
        is_disabled: item.is_active,
      };
    });
  }

  onSubmit() {
    if (this.formBranch.valid) {
      let data = {
        name: this.formBranch.get('name')?.value,
        description: this.formBranch.get('description')?.value,
        company_id: this.formBranch.get('company_id')?.value,
        address: this.formBranch.get('address')?.value,
        phone: this.formBranch.get('phone')?.value,
        is_active:
          this.formBranch.get('is_active')?.value === null
            ? false
            : this.formBranch.get('is_active')?.value,
      };
      if (this.action === 'save') {
        this.saveNewBranch(data);
      }

      if (this.action === 'edit') {
        this.editBranch(data, this.dataTemp.id);
      }
    }
  }

  public saveNewBranch(data: any) {
    this.loading = true;
    this.branchService.sendBranch(data).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.onFetchData(this.parameterDefect);
          this.resetForms();
          this.showForm = false;
          this.loading = false;
          this.generalService.alertMessage(
            '¡Éxito!',
            response.original?.message || 'Operación exitosa',
            'success'
          );
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
        this.generalService.alertMessage(
          'Error',
          'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
          'error'
        );
      },
    });
  }

  async setDataForm(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.formBranch.controls['name'].setValue(this.dataTemp.name);
        this.formBranch.controls['description'].setValue(
          this.dataTemp.description
        );
        this.formBranch.controls['company_id'].setValue(
          this.dataTemp.company_id
        );
        this.formBranch.controls['address'].setValue(this.dataTemp.address);
        this.formBranch.controls['phone'].setValue(this.dataTemp.phone);
        this.formBranch.controls['is_active'].setValue(
          this.dataTemp.is_active === 1 ? true : false
        );

        // Marcar los controles como tocados y verificar su validez
        this.formBranch.markAllAsTouched();

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  disableOrEnableRecord(data: any) {
    const actionText = data.is_active === 0 ? 'habilitar' : 'inhabilitar';
    const actionTextPlural = (data.is_active === 0) ? 'habilitados' : 'inhabilitados';
    const confirmButtonText =
      data.is_active === 0 ? 'Sí, habilitar' : 'Sí, inhabilitar';
    const successMessage =
      data.is_active === 0
        ? 'El registro ha sido habilitado correctamente.'
        : 'El registro ha sido inhabilitado correctamente.';

    Swal.fire({
      title: `¿Deseas ${actionText} este registro?`,
      html: `<strong>Tenga en cuenta que al ${actionText} esta sucursal, los usuarios de esta sucursal también serán ${actionTextPlural}. Asegúrese de que esto sea lo que desea hacer.</strong>`,
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

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.branchService.enableRecordById(id),
    disable: (id: number) => this.branchService.disableRecordById(id),
  };

  public editBranch(data: any, id: number) {
    this.loading = true;
    this.branchService.editBranch(data, id).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.onFetchData(this.parameterDefect);
          this.resetForms();
          this.showForm = false;
          this.loading = false;
          this.generalService.alertMessage(
            '¡Éxito!',
            response.original?.message || 'Operación exitosa',
            'success'
          );
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
        this.generalService.alertMessage(
          'Error',
          'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
          'error'
        );
      },
    });
  }

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.branchService.getDataBranch(params).subscribe(
      (response) => {
        this.dataBranchTrasnform = this.formatedData(response.data);
        this.dataBranch = response.data;
        this.totalRecord = response.total;
        this.acciones = true;
        this.loadingTable = false;
      },
      (error) => {
        this.loadingTable = false;
        console.error('Error fetching data', error);
      }
    );
  }

  handleAction(event: { id: number; action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataBranch.find((item: any) => item.id === id);

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

  clearSelection(): void {
    this.formBranch.get('company_id')?.reset();
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formBranch.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  getTextClass() {
    return this.formBranch.get('is_active')?.value
      ? 'text-success'
      : 'text-red';
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);

    if (
      event.key === 'Backspace' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Delete'
    ) {
      return true;
    }

    if (!/^[0-9]+$/.test(char)) {
      event.preventDefault();
      return false;
    }

    return true;
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
        this.branchService.deleteRecordById(id).subscribe({
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
              const fullMessage = `No puedes eliminar la sucursal porque tiene usuarios asociados:<br><br><strong>${branchesMessage}</strong><br><br>Por favor, elimina primero los usuarios antes de intentar eliminar la sucursal.`;
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

  openModalView(data: any) {
    Swal.fire({
      title: 'Sucursal',
      html: `
        <div id="custom-icon-container">
          <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
          <p><strong>Descripción : </strong> <span>${data.description
        }</span> </p>
          <p><strong>Compañía : </strong> <span>${data.company_name}</span> </p>
          <p><strong>Dirección : </strong> <span>${data.address}</span> </p>
          <p><strong>Teléfono : </strong> <span>${data.phone}</span> </p
          <p><strong>Fecha de Creación: </strong> <span>${moment(
          data.created_at
        ).format('DD/MM/YYYY hh:mm:ss A')}</span></p>
          <p><strong>Última actualización: </strong> <span>${moment(
          data.updated_at
        ).format('DD/MM/YYYY hh:mm:ss A')}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  }

  setFilter(event: any) {
    this.loading = true;
    this.viewTable = false;
    this.parameterDefect = {
      dateInit: event.dateInit,
      dateFinish: event.dateFinish,
      company_id: event.company_id,
      branch_id: event.branch_id,
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
