import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconSetService } from '@coreui/icons-angular';
import { GeneralService } from '../../../services/general/general.service';
import moment from 'moment';
import { TypeBreedService } from '../../../services/parameter/type-breed/type-breed.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-types-breeds',
  templateUrl: './types-breeds.component.html',
  styleUrl: './types-breeds.component.css'
})
export class TypesBreedsComponent implements OnInit {
  public loading: boolean = true;
  public showForm: boolean = false;
  public formTypesBreeds!: FormGroup;
  public action: string = 'save';
  public viewTable: boolean = false;
  public parameterDefect = {};
  public dataTypesBreeds: any = [];
  public totalRecord: number = 0;
  public dataTypesBreedsTransform: any = [];
  public acciones: boolean = true;
  public loadingTable: boolean = false;
  public dataTemp: any = [];
  public icons: any;

  constructor(
    private typeBreedsService: TypeBreedService,
    private fb: FormBuilder,
    public iconSet: IconSetService,
    private generalService: GeneralService
  ) { }

  async ngOnInit(): Promise<void> {
    this.icons = this.getIconsView('cil');
    this.createForm();
    this.loading = false;
  }

  public createForm() {
    this.formTypesBreeds = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ]+(\\s[a-zA-ZáéíóúÁÉÍÓÚÑñ]+)*$')]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  getIconsView(prefix: string) {
    return Object.entries(this.iconSet.icons).filter((icon) => {
      return icon[0].startsWith(prefix);
    });
  }

  onSubmit() {
    if (this.formTypesBreeds.valid) {
      let data = {
        name: this.formTypesBreeds.get('nombre')?.value,
        description: this.formTypesBreeds.get('description')?.value,
      };
      if (this.action === 'save') {
        this.saveNewTypesBreeds(data);
      }

      if (this.action === 'edit') {
        this.editTypesBreeds(data, this.dataTemp.id);
      }
    }
  }

  public editTypesBreeds(data: any, id: number) {
    this.loading = true;
    this.typeBreedsService.editTypesBreeds(data, id).subscribe({
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

  private getData() {
    this.typeBreedsService.getDataTypesBreeds(this.parameterDefect).subscribe(
      response => {
        this.dataTypesBreeds = response.data;
        this.totalRecord = response.total;
        this.dataTypesBreedsTransform = this.formatedData(response.data);
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
    return ['Nombre', 'Descripción', 'Fecha de creación'];
  }

  getColumnAlignments() {
    return ['left', 'center', 'center'];
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formTypesBreeds.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addTypesBreeds();
        break;
      case 'import':
        this.importData();
        break;
      case 'export':
        this.exportData();
        break;
    }
  }

  public addTypesBreeds() {
    this.showForm = true;
    this.formTypesBreeds.reset();
    this.action = 'save';
  }

  public importData() {
    this.generalService.alertMessageInCreation();
  }

  public exportData() {
    this.generalService.alertMessageInCreation();
  }

  public saveNewTypesBreeds(data: any) {
    this.loading = true;
    this.typeBreedsService.sendTypesBreeds(data).subscribe({
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
        is_disabled: item.is_active,
        Nombre: item.name,
        'Descripción': item.description,
        'Fecha de creación': moment(item.created_at).format(
          'DD/MM/YYYY hh:mm:ss A'
        ),
      };
    });
  }

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.typeBreedsService.getDataTypesBreeds(params).subscribe(
      (response) => {
        this.dataTypesBreedsTransform = this.formatedData(response.data);
        this.dataTypesBreeds = response.data;
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
    this.dataTemp = this.dataTypesBreeds.find((item: any) => item.id === id);
    if (action === 'edit') {
      this.formTypesBreeds.controls['nombre'].setValue(this.dataTemp.name);
      this.formTypesBreeds.controls['description'].setValue(this.dataTemp.description);
      this.formTypesBreeds.markAllAsTouched();
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
        this.typeBreedsService.deleteRecordById(id).subscribe({
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

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.typeBreedsService.enableRecordTypesBreedsById(id),
    disable: (id: number) =>
      this.typeBreedsService.disableRecordTypesBreedsById(id),
  };

  openModalView(data: any) {
    Swal.fire({
      title: 'Tipo de raza',
      html: `
        <div>
        <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
        <p><strong>Descripción : </strong> <span>${data.description}</span> </p>
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
  disableOrEnableRecord(data: any) {
    const actionText = data.is_active === 0 ? 'habilitar' : 'inhabilitar';
    const confirmButtonText =
      data.is_active === 0 ? 'Sí, habilitar' : 'Sí, inhabilitar';
    const successMessage =
      data.is_active === 0
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
        const action = data.is_active === 0 ? 'enable' : 'disable';
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

  public backToTable() {
    this.showForm = false;
    this.formTypesBreeds.reset();
  }

}
