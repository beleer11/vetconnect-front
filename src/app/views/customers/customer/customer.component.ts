import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GeneralService } from 'src/app/services/general/general.service';
import { CustomerService } from '../../../services/customers/customer/customer.service';
import moment from 'moment';
import { environment } from 'src/environments/environment';

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
  public dataCustomerTrasnform: any = [];

  constructor(
    private generalService: GeneralService,
    private customerService: CustomerService,
  ) { }


  async ngOnInit(): Promise<void> {
    //this.icons = this.getIconsView('cil');
    //this.createForm();
    this.loading = false;
  }

  private getData() {
    this.customerService.getDataCustomer(this.parameterDefect).subscribe(
      response => {
        this.dataCustomer = response.data;
        this.totalRecord = response.total;
        this.dataCustomerTrasnform = this.formatedData(response.data);
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


}
