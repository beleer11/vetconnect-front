import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconSetService } from '@coreui/icons-angular';
import { GeneralService } from 'src/app/services/general/general.service';
import { TypePetService } from '../../../services/parameter/type-pet/type-pet.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-type-pet',
  templateUrl: './type-pet.component.html',
  styleUrl: './type-pet.component.css'
})
export class TypePetComponent implements OnInit {
  public loading: boolean = true;
  public showForm: boolean = false;
  public showTypePet: boolean = false;
  public formTypePet!: FormGroup;
  public action: string = 'save';
  public viewTable: boolean = false;
  public parameterDefect = {};
  public dataTypePetTrasnform: any = [];
  public dataTypePet: any = []
  public totalRecord: number = 0;
  public icons: any;
  public acciones: boolean = true;
  public loadingTable: boolean = false;
  public dataTemp: any = [];
  public selectedIcon: string | null = null;

  constructor(
    private typePetService: TypePetService,
    private fb: FormBuilder,
    public iconSet: IconSetService,
    private generalService: GeneralService
  ) { }

  async ngOnInit(): Promise<void> {
    this.createForm();
    this.loading = false;
  }

  private getData() {
    this.typePetService.getDataTypePet(this.parameterDefect).subscribe(
      response => {
        this.dataTypePet = response.data;
        this.totalRecord = response.total;
        this.dataTypePetTrasnform = this.formatedData(response.data);
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

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addTypePet();
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
    const control = this.formTypePet?.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  public addTypePet() {
    this.showForm = true;
    this.formTypePet.reset();
    this.action = 'save';
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
        'Fecha creación': moment(item.created_at).format(
          'DD/MM/YYYY hh:mm:ss A'
        )
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
        this.typePetService.deleteRecordTypePetById(id).subscribe({
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

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.typePetService.enableRecordTypePetById(id),
    disable: (id: number) =>
      this.typePetService.disableRecordTypePetById(id),
  };

  openModalView(data: any) {
    Swal.fire({
      title: 'Tipo de Mascota',
      html: `
        <div>
        <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
        <p><strong>Descripción : </strong> <span>${data.description}</span> </p>
        <p> <strong>Fecha de Creación: </strong> <span>${moment(
        data.created_at
      ).format('DD/MM / YYYY hh: mm:ss A')}</span></p>
            </div>
              `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  }

  public createForm() {
    this.formTypePet = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ]+(\\s[a-zA-ZáéíóúÁÉÍÓÚÑñ]+)*$')]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.formTypePet.valid) {
      let data = {
        name: this.formTypePet.get('nombre')?.value,
        description: this.formTypePet.get('description')?.value,
      };

      if (this.action === 'save') {
        this.saveNewTypePet(data);
      }

      if (this.action === 'edit') {
        this.editTypePet(data, this.dataTemp.id);
      }
    }
  }

  handleAction(event: { id: number; action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataTypePet.find((item: any) => item.id === id);

    if (action === 'edit') {
      this.formTypePet.controls['nombre'].setValue(this.dataTemp.name);
      this.formTypePet.controls["description"].setValue(this.dataTemp.description);
      this.formTypePet.markAllAsTouched();
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

  public backToTable() {
    this.showForm = false;
    this.formTypePet.reset();
  }

  public saveNewTypePet(data: any) {
    this.loading = true;
    this.typePetService.sendTypePet(data).subscribe({
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

  public editTypePet(data: any, id: number) {
    this.loading = true;
    this.typePetService.editTypePet(data, id).subscribe({
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

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.typePetService.getDataTypePet(params).subscribe(
      (response) => {
        this.dataTypePetTrasnform = this.formatedData(response.data);
        this.dataTypePet = response.data;
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

  getFieldsTable() {
    return ['Nombre', 'Descripción', 'Fecha creación'];
  }

  getColumnAlignments() {
    return ['left', 'center', 'center'];
  }
}
