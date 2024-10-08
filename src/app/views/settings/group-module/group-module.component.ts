import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleService } from '../../../services/settings/module/module.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Observable } from 'rxjs';
import { GeneralService } from '../../../services/general/general.service';
import { IconSetService } from '@coreui/icons-angular';

@Component({
  selector: 'app-group-module',
  templateUrl: './group-module.component.html',
  styleUrls: ['./group-module.component.css'],
})
export class GroupModuleComponent implements OnInit {
  public dataModule: any = [];
  public dataModuleTrasnform: any = [];
  public fieldsTable: any = [];
  public columnAlignments: any = [];
  public showForm: boolean = false;
  public formGroupModule!: FormGroup;
  public action: string = 'save';
  public dataTemp: any = [];
  public loading: boolean = true;
  public showAddButton: boolean = false;
  public showImportButton: boolean = false;
  public showExportButton: boolean = false;
  public totalRecord: number = 0;
  public loadingTable: boolean = false;
  public acciones: boolean = true;
  public viewTable: boolean = false;
  public icons: any;
  public parameterDefect = {};

  constructor(
    private moduleService: ModuleService,
    private fb: FormBuilder,
    public iconSet: IconSetService,
    private generalService: GeneralService
  ) { }

  async ngOnInit(): Promise<void> {
    this.icons = this.getIconsView('cil');
    this.createForm();
    this.loading = false;
  }

  private getData() {
    this.moduleService.getDataGroupModule(this.parameterDefect).subscribe(
      response => {
        this.dataModule = response.data;
        this.totalRecord = response.total;
        this.dataModuleTrasnform = this.formatedData(response.data);
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

  getFieldsTable() {
    return ['Nombre', 'Fecha creación', 'Ultima actualización'];
  }

  getColumnAlignments() {
    return ['left', 'center', 'center'];
  }

  public createForm() {
    this.formGroupModule = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ]+(\\s[a-zA-ZáéíóúÁÉÍÓÚÑñ]+)*$')]],
    });
  }

  getIconsView(prefix: string) {
    return Object.entries(this.iconSet.icons).filter((icon) => {
      return icon[0].startsWith(prefix);
    });
  }

  onSubmit() {
    if (this.formGroupModule.valid) {
      if (this.action === 'save') {
        this.saveNewGroupModule(this.formGroupModule.get('nombre')?.value);
      }

      if (this.action === 'edit') {
        this.editGroupModule(
          this.formGroupModule.get('nombre')?.value,
          this.dataTemp.id
        );
      }
    }
  }

  handleAction(event: { id: number; action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataModule.find((item: any) => item.id === id);

    if (action === 'edit') {
      this.formGroupModule.controls['nombre'].setValue(this.dataTemp.name);
      this.formGroupModule.markAllAsTouched();
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

  public addGroupModule() {
    this.showForm = true;
    this.formGroupModule.reset();
    this.action = 'save';
  }

  public backToTable() {
    this.showForm = false;
    this.formGroupModule.reset();
  }

  public saveNewGroupModule(nombre: string) {
    this.loading = true;
    this.moduleService.sendGroup({ name: nombre }).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.onFetchData(this.parameterDefect);
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
        this.generalService.alertMessage(
          'Error',
          'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
          'error'
        );
      },
    });
  }

  public editGroupModule(nombre: string, id: number) {
    this.loading = true;
    this.moduleService.editGroup(nombre, id).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.onFetchData(this.parameterDefect);
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
        this.generalService.alertMessage(
          'Error',
          'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
          'error'
        );
      },
    });
  }

  public formatedData(response: any) {
    if (response.length === 0) {
      return [
        {
          'No se encontraron resultados': 'No se encontraron registros que coincidan con los criterios de búsqueda. Intente con otros términos.',
        },
      ];
    }
    return response.map((item: any) => {
      return {
        id: item.id,
        is_disabled: item.is_disabled,
        Nombre: item.name,
        'Fecha creación': moment(item.created_at).format(
          'DD/MM/YYYY hh:mm:ss A'
        ),
        'Ultima actualización': moment(item.updated_at).format(
          'DD/MM/YYYY hh:mm:ss A'
        ),
      };
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
        this.moduleService.deleteRecordGroupModuleById(id).subscribe({
          next: (response) => {
            this.onFetchData(this.parameterDefect);
            this.loading = false;
            this.generalService.alertMessage(
              '¡Eliminado!',
              'El registro ha sido eliminado correctamente.',
              'success'
            );
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
            this.onFetchData(this.parameterDefect);
            this.loading = false;
            this.generalService.alertMessage('¡Éxito!', successMessage, 'success');
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
    enable: (id: number) => this.moduleService.enableRecordGroupModuleById(id),
    disable: (id: number) =>
      this.moduleService.disableRecordGroupModuleById(id),
  };

  openModalView(data: any) {
    Swal.fire({
      title: 'Grupo Módulo',
      html: `
        <div>
        <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
        <p> <strong>Fecha de Creación: </strong> <span>${moment(
        data.created_at
      ).format('DD/MM / YYYY hh: mm:ss A')}</span></p>
          <p> <strong>Ultima actualización: </strong> <span>${moment(
        data.updated_at
      ).format('DD/MM / YYYY hh: mm:ss A')}</span></p>
            </div>
              `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addGroupModule();
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

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formGroupModule.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.moduleService.getDataGroupModule(params).subscribe(
      (response) => {
        this.dataModuleTrasnform = this.formatedData(response.data);
        this.dataModule = response.data;
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

  setFilter(event: any) {
    this.loading = true;
    this.viewTable = false;
    this.parameterDefect = {
      dateInit: event.dateInit,
      dateFinish: event.dateFinish,
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

