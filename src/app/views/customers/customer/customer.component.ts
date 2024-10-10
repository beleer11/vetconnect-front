import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general/general.service';
import { CustomerService } from '../../../services/customers/customer/customer.service';
import moment from 'moment';

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
  public dataCustomerTransform: any = [];
  public icons: any;
  public filteredCustomer: any[] = this.dataCustomer;
  public searchControl = new FormControl('');
  public dataBranch: any = [];
  public loadingBranch: boolean = false;

  constructor(
    private generalService: GeneralService,
    private customerService: CustomerService,
    private fb: FormBuilder,
  ) { }


  async ngOnInit(): Promise<void> {
    this.createForm();
    this.loading = false;
  }

  private getData() {
    this.customerService.getDataCustomer(this.parameterDefect).subscribe(
      response => {
        this.dataCustomer = response.data;
        this.totalRecord = response.total;
        this.dataCustomerTransform = this.formatedData(response.data);
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
      address: ['', [Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.email]],
      document: ['', [Validators.minLength(10), Validators.maxLength(20)]],
      is_disabled: [true],
      branch_id: [{ value: {}, disabled: true }],
      pet_id: [{ value: {}, disabled: true }, Validators.required],
    });
    this.loading = false;
    this.getCustomer();
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
        "is_disabled": item.is_disabled,
        "Nombre": item.name,
        "Télefono": item.Telefono,
        "Sucursal": item.branch_id,
        "Fecha creación": moment(item.created_at).format('DD/MM/YYYY hh:mm:ss A'),
        "Ultima actualización": moment(item.updated_at).format('DD/MM/YYYY hh:mm:ss A')
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

  getCustomer() {
    this.customerService.listCustomer().subscribe(
      (response: any) => {
        this.dataCustomer = response?.data;
        this.filteredCustomer = this.dataCustomer;
        this.getData();
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
    console.log(this.parameterDefect);
    this.getData();
  }

  onSubmit() {
    if (this.formCustomer.valid) {
      let data = {
        name: this.formCustomer.get('name')?.value,
        address: this.formCustomer.get('address')?.value,
        phone: this.formCustomer.get('phone')?.value,
        email: this.formCustomer.get('email')?.value,
        branch_id: this.formCustomer.get('branch_id')?.value,
        pet_id: this.formCustomer.get('pet_id')?.value,
        is_disabled: (this.formCustomer.get('is_disabled')?.value === null) ? false : this.formCustomer.get('is_disabled')?.value,
      };

      /* if (this.action === 'save') {
        this.saveNewRol(data);
      }

      if (this.action === 'edit') {
        this.editRol(data, this.dataTemp.id);
      } */
    }
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

}
