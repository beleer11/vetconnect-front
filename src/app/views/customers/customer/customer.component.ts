import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general/general.service';
import { CustomerService } from '../../../services/customers/customer/customer.service';
import moment from 'moment';
import * as bootstrap from 'bootstrap';
import { BranchService } from 'src/app/services/companies/branch/branch.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  public loading: boolean = true;
  public showForm: boolean = false;
  public formCustomer!: FormGroup;
  public action: string = 'save';
  public viewTable: boolean = false;
  public parameterDefect = {};
  public totalRecord: number = 0;
  public dataCustomer: any = [];
  public icons: any;
  public searchControl = new FormControl('');
  public dataBranch: any = [];
  public loadingBranch: boolean = false;
  public userCompanyId: number = 0;
  public loadingTable: boolean = false;
  public dataTransformada: any = [];
  public acciones: boolean = true;
  public dataTemp: any = [];

  constructor(
    private generalService: GeneralService,
    private customerService: CustomerService,
    private branchService: BranchService,
    private fb: FormBuilder,
  ) {
    const storedUserInfo = localStorage.getItem('user_information');
    this.userCompanyId = storedUserInfo
      ? JSON.parse(storedUserInfo).data.company_id
      : null;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
  }

  private getData() {
    this.customerService.getDataCustomer(this.parameterDefect).subscribe(
      response => {
        this.dataCustomer = response.data;
        this.totalRecord = response.total;
        this.dataTransformada = this.formatedData(response.data);
        this.loading = false;
        this.viewTable = true;
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

  public createForm() {
    this.formCustomer = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ]+(\\s[a-zA-ZáéíóúÁÉÍÓÚÑñ]+)*$')]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.email]],
      document: ['', [Validators.minLength(10), Validators.maxLength(20)]],
      is_active: [true],
      branch_id: [{ value: '' }, Validators.required],
    });
    this.loading = false;
    this.getBranch();
  }

  public formatedData(response: any) {
    if (response.length === 0) {
      return [{
        "No se encontraron resultados": "No se encontraron registros que coincidan con los criterios de búsqueda. Intente con otros términos.",
      }];
    }

    return response.map((item: any) => {
      return {
        "id": item.id,
        "is_disabled": item.is_active,
        "Nombres": item.name,
        "Teléfono": item.phone,
        "Sucursal": item.branch_name,
        "Dirección": item.address,
      };
    });
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addCustomer();
        break;
      case 'import':
        this.importData();
        break;
      case 'export':
        this.exportData();
        break;
    }
  }

  public importData() {
    this.generalService.alertMessageInCreation();
  }

  public exportData() {
    this.generalService.alertMessageInCreation();
  }

  getBranch() {
    this.branchService.getCompanyByBranch(this.userCompanyId).subscribe(
      (response: any) => {
        console.log(response);
        this.dataBranch = response;
      },
      error => {
        console.log(error.message);
      }
    );
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formCustomer.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  public addCustomer() {
    this.showForm = true;
    this.formCustomer.reset();
    this.formCustomer.controls['document'].markAsTouched();
    this.formCustomer.controls['email'].markAsTouched();
    this.action = 'save';
  }

  setFilter(event: any) {
    this.loading = true;
    this.viewTable = false;
    this.parameterDefect = {
      name: event.name,
      phone: event.phone,
      branch_id: event.branch_id,
      dateInit: event.dateInit,
      dateFinish: event.dateFinish,
      state: event.state,
      search: '',
      sortColumn: 'name',
      sortOrder: 'desc',
      page: 1,
      pageSize: 10
    }
    this.getData();
  }

  public getBranchByCompany(id: any) {
    this.loadingBranch = true;
    this.branchService.getCompanyByBranch(id).subscribe(
      async response => {
        this.dataBranch = response;
        this.loadingBranch = false;
        this.formCustomer.controls['branch_id'].enable();
      },
      error => {
        console.log(error.message);
        this.loadingBranch = true;
      }
    );
  }

  onSubmit() {
    if (this.formCustomer.valid) {
      let data = {
        name: this.formCustomer.get('name')?.value,
        address: this.formCustomer.get('address')?.value,
        phone: this.formCustomer.get('phone')?.value,
        email: (this.formCustomer.get('email')?.value === null || this.formCustomer.get('email')?.value === '') ? null : this.formCustomer.get('email')?.value,
        branch_id: this.formCustomer.get('branch_id')?.value,
        is_active: (this.formCustomer.get('is_active')?.value === null) ? false : this.formCustomer.get('is_active')?.value,
        document: (this.formCustomer.get('document')?.value === null || this.formCustomer.get('document')?.value === '') ? null : this.formCustomer.get('document')?.value,
      };
      console.log(data);

      if (this.action === 'save') {
        this.saveNewCustomer(data);
      }

      if (this.action === 'edit') {
        this.editCustomer(data, this.dataTemp.id);
      }
    }
  }

  public saveNewCustomer(data: {}) {
    this.loading = true;
    this.customerService.sendCustomer(data).subscribe({
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

  public editCustomer(data: any, id: number) {
    this.loading = true;
    this.customerService.editCustomer(data, id).subscribe({
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

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.customerService.getDataCustomer(params).subscribe((response) => {
      this.dataTransformada = this.formatedData(response.data);
      this.dataCustomer = response.data;
      this.totalRecord = response.total;
      this.loadingTable = false;
    }, (error) => {
      this.loadingTable = false;
      console.error('Error fetching data', error);
    });
  }

  async handleAction(event: { id: number, action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataCustomer.find((item: any) => item.id === id);

    if (action === "edit") {
      try {
        this.loading = true;
        this.resetForms();
        await this.setDataForm();
      } catch (error) {
        console.error('Error en el flujo de edición:', error);
        this.loading = false;
      }
    }

    if (action === "delete") {
      this.deleteRecord(id);
    }

    if (action === "view") {
      this.openModalView(this.dataTemp);
    }

    if (action === "ban") {
      this.disableOrEnableRecord(this.dataTemp);
    }
  }

  async setDataForm(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.formCustomer.controls["name"].setValue(this.dataTemp.name);
        this.formCustomer.controls["phone"].setValue(this.dataTemp.phone);
        this.formCustomer.controls["address"].setValue(this.dataTemp.address);
        this.formCustomer.controls["email"].setValue(this.dataTemp.email);
        this.formCustomer.controls["document"].setValue(this.dataTemp.document);
        this.formCustomer.controls["is_active"].setValue((this.dataTemp.is_active === 1) ? true : false);
        this.getBranchByCompany(this.userCompanyId);
        this.formCustomer.controls["branch_id"].setValue(this.dataTemp.branch_id);
        // Marcar los controles como tocados y verificar su validez
        this.formCustomer.markAllAsTouched();
        this.loading = false;
        this.showForm = true;

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

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
        this.customerService.deleteRecordById(id).subscribe({
          next: (response) => {
            this.onFetchData(this.parameterDefect);
            this.loading = false;
            this.generalService.alertMessage('¡Eliminado!', 'El registro ha sido eliminado correctamente.', 'success');
          },
          error: (error) => {
            this.loading = false;
            this.generalService.alertMessage('Error', 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo. Si el problema persiste, comunícate con soporte técnico', 'error');
          }
        });
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
            this.onFetchData(this.parameterDefect);
            this.loading = false;
            this.generalService.alertMessage('¡Éxito!', successMessage, 'success');
          },
          error: (error: any) => {
            this.loading = false;
            this.generalService.alertMessage('Error', 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo. Si el problema persiste, comunícate con soporte técnico', 'error');
          }
        });
      }
    });
  }

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.customerService.enableRecordById(id),
    disable: (id: number) => this.customerService.disableRecordById(id),
  };

  openModalView(data: any) {
    let cliente = this.dataCustomer.filter((t: any) => t.id === data.rol_id);
    Swal.fire({
      title: 'Usuarios',
      html: `
        <div id="custom-icon-container">
          <p><strong>Foto: </strong><p id="foto-placeholder"></p></p>
          <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
          <p><strong>Teléfono : </strong> <span>${data.phone}</span> </p>
          <p><strong> : </strong> <span>${cliente[0].name}</span> </p>
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

  clearSelection(): void {
    this.formCustomer.get('company_id')?.reset();
  }

  clearSelectionBranch(): void {
    this.formCustomer.get('branch_id')?.reset();
    this.formCustomer.get('branch_id')?.markAsTouched();
  }

  getTextClass() {
    return this.formCustomer.get('is_disabled')?.value ? 'text-success' : 'text-red';
  }

  goToPreviewTab() {
    const tabTriggerEl = document.querySelector('#general-tab') as HTMLElement;
    const tab = new bootstrap.Tab(tabTriggerEl);
    tab.show();
  }

  resetForms() {
    this.formCustomer.reset();
    this.formCustomer.untouched;
    this.goToPreviewTab();
  }

  public backToTable() {
    this.showForm = false;
    this.resetForms();
  }

  public getFieldsTable() {
    return ['Nombres', 'Teléfono', 'Sucursal', 'Dirección'];
  }

  public getColumnAlignments() {
    return ['left', 'left', 'left', 'center'];
  }

  flipCard() {
    const cardContainer = document.querySelector('.card-container');
    cardContainer?.classList.toggle('is-flipped');
    console.log('entra');
  }






}
