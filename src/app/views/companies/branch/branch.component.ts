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
import { GeneralService } from 'src/app/services/general/general.service';
import { UserService } from 'src/app/services/user/user/user.service';
import { CompanyService } from 'src/app/services/companies/company/company.service';

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
  public fieldsTable: any = [];
  public dataBranchTrasnform: any = [];
  public acciones: boolean = true;
  public columnAlignments: any = [];
  public loadingTable: boolean = false;
  public totalRecord: number = 0;
  public dataTemp: any = [];
  public dataCompany: any = [];
  public permissionSuggested: any = [];
  public formBranch!: FormGroup;
  public searchControl = new FormControl('');
  public parameterDefect = {
    search: '',
    sortColumn: 'name',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10,
  };

  constructor(
    private branchService: BranchService,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private companyService: CompanyService
  ) {}

  async ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.formBranch = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      rol_id: [null, Validators.required],
    });
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
    this.dataBranchTrasnform = this.getData();
  }

  private async getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.branchService.getDataBranch(this.parameterDefect).subscribe(
        (response) => {
          this.dataBranch = response.data;
          this.totalRecord = response.total;
          resolve(this.formatedData(response.data));
          this.loading = false;
        },
        (error) => reject(error)
      );
    });
  }

  private getFieldsTable() {
    return ['Nombre', 'Compañía', 'Dirección', 'Descripción', 'Teléfono'];
  }

  private getColumnAlignments() {
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
    this.goToPreviewTab();
  }

  public formatedData(response: any, fecth = false) {
    if (response.length === 0 && fecth) {
      // Devuelve un mensaje personalizado cuando no hay datos
      return [
        {
          'No se encontraron resultados':
            'No se encontraron registros que coincidan con los criterios de búsqueda. Intente con otros términos.',
        },
      ];
    }
    return response.map((item: any) => {
      return {
        id: item.id,
        Nombre: item.name,
        Compañía: item.company.name,
        Dirección: item.address,
        Descripción: item.description,
        Teléfono: item.phone,
      };
    });
  }

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.branchService.getDataBranch(params).subscribe(
      (response) => {
        this.dataBranchTrasnform = this.formatedData(response.data, true);
        this.dataBranch = response.data;
        this.totalRecord = response.total;
        if (response.data.length === 0) {
          this.fieldsTable = ['No se encontraron resultados'];
          this.columnAlignments = ['center'];
          this.acciones = false;
        } else {
          this.fieldsTable = this.getFieldsTable();
          this.columnAlignments = this.getColumnAlignments();
          this.acciones = true;
        }
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

    /*if (action === "edit") {
      this.loading = true;
      this.formRol.controls["nombre"].setValue(this.dataTemp.name);
      this.formRol.controls["description"].setValue(this.dataTemp.description);
      this.formRol.markAllAsTouched();
      this.rolService.getPermissionByRol(this.dataTemp.id).subscribe(
        response => {
          this.checkedPermisosAsignados(response.original);
        },
        error => {
          console.log(error.message);
        }
      );
    }

    if (action === "delete") {
      this.deleteRecord(id);
    }

    if (action === "view") {
      this.openModalView(this.dataTemp);
    }

    if (action === "ban") {
      this.disableOrEnableRecord(this.dataTemp);
    }*/
  }

  clearSelection(): void {
    this.formBranch.get('company_id')?.reset();
  }

  goToPreviewTab() {
    const tabTriggerEl = document.querySelector('#general-tab') as HTMLElement;
    const tab = new bootstrap.Tab(tabTriggerEl);
    tab.show();
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formBranch.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  async selectCompany(id: number): Promise<void> {
    try {
      const response = await this.companyService
        .getPermissionByCompany(id)
        .toPromise();
      this.permissionSuggested = response.original;
    } catch (error: any) {
      console.error('Error al seleccionar compañia:', error.message);
      throw error;
    }
  }
}
