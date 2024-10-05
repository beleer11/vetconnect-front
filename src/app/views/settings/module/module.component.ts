import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { ModuleService } from '../../../services/settings/module/module.service';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Observable } from 'rxjs';
import { GeneralService } from '../../../services/general/general.service';
interface Icon {
  name: string;
  svg: string;
}

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
})

export class ModuleComponent implements AfterViewInit {
  public dataModule: any = [];
  public dataModuleTrasnform: any = [];
  public showForm: boolean = false;
  public formModule!: FormGroup;
  public selectedIcon: string | null = null;
  public selectedIconSVG: string | null = null;
  public icons: any;
  public groupsModule: any;
  public action: string = 'save';
  public dataTemp: any = [];
  public loading: boolean = true;
  public showAddButton: boolean = false;
  public showImportButton: boolean = false;
  public showExportButton: boolean = false;
  public totalRecord: number = 0;
  public loadingTable: boolean = false;
  public acciones: boolean = true;
  public parameterDefect = {};
  public viewTable: boolean = false;

  constructor(
    private moduleService: ModuleService,
    private fb: FormBuilder,
    private router: Router,
    public iconSet: IconSetService,
    private generalService: GeneralService,
  ) {
    this.iconSet.icons = { ...freeSet };
  }

  async ngOnInit(): Promise<void> {
    this.icons = this.getIconsView('cil');
    this.createForm();
    this.loading = false;
  }

  ngAfterViewInit(): void {
    // Inicializar tooltips
    const tooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.forEach((tooltip) => {
      new bootstrap.Tooltip(tooltip as HTMLElement);
    });
  }

  private getData() {
    this.moduleService.getDataModule(this.parameterDefect).subscribe(
      response => {
        this.dataModule = response.data;
        this.totalRecord = response.total;
        this.dataModuleTrasnform = this.formatedData(response.data);
        this.loading = false;
        this.viewTable = true;
      });
  }

  public getFieldsTable() {
    return ['Nombre', 'Grupo', 'Icono', 'Ruta'];
  }

  public getColumnAlignments() {
    return ['left', 'left', 'left', 'left'];
  }

  public createForm() {
    this.formModule = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      url: ['', Validators.required],
      group: ['', Validators.required],
    });
    this.listGroupModule();
  }

  onSubmit() {
    if (this.formModule.valid) {
      let data = {
        "name": this.formModule.get('name')?.value,
        "url": this.formModule.get('url')?.value,
        "module_group_id": this.formModule.get('group')?.value,
        "icon": this.formModule.get('icon')?.value,
        "is_disabled": 1
      }
      if (this.action === 'save') {
        this.saveNewModule(data);
      }

      if (this.action === 'edit') {
        this.editModule(data, this.dataTemp.id);
      }
    }
  }

  getIconsView(prefix: string) {
    return Object.entries(this.iconSet.icons).filter((icon) => {
      return icon[0].startsWith(prefix);
    });
  }

  toKebabCase(str: string) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  selectIcon(name: string) {
    this.selectedIcon = name;
    this.formModule.patchValue({ icon: name });
  }

  isIconSelected(name: string): boolean {
    return this.selectedIcon === name;
  }

  listGroupModule() {
    this.moduleService.listGroupModule().subscribe({
      next: (response) => {
        this.groupsModule = response;
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  public addModule() {
    this.showForm = true;
    this.formModule.reset();
    this.action = 'save';
  }

  public backToTable() {
    this.showForm = false;
    this.formModule.reset();
    this.selectedIcon = null;
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
        Nombre: item.name,
        Grupo: item.group_name,
        Icono: this.getIconSVG(item.icon),
        Ruta: item.url,
      };
    });
  }

  private getIconSVG(iconName: string): string {
    const icon = this.icons.find((icon: any) => this.toKebabCase(icon[0]) === iconName);
    return icon ? icon[0] : '';
  }

  public saveNewModule(data: any) {
    this.loading = true;
    this.moduleService.sendModule(data).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.onFetchData(this.parameterDefect);
          this.loading = false;
          this.showForm = false;
          this.formModule.reset();
          this.selectedIcon = null;
          this.generalService.alertMessage('¡Éxito!', response.original.message, 'success');
        } else {
          this.loading = false;
          this.generalService.alertMessage('Advertencia', response.original.message, 'warning');
        }
      },
      error: (error) => {
        this.loading = false;
        this.generalService.alertMessage(
          '¡Ups! Algo salió mal',
          'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo o contacta a nuestro equipo de soporte si el problema persiste. ¡Estamos aquí para ayudarte!',
          'warning'
        );
      }
    });
  }

  public editModule(data: any, id: number) {
    this.loading = true;
    this.moduleService.editModule(data, id).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.onFetchData(this.parameterDefect);
          this.loading = false;
          this.showForm = false;
          this.formModule.reset();
          this.selectedIcon = null;
          this.generalService.alertMessage('¡Éxito!', response.original.message, 'success');
        } else {
          this.loading = false;
          this.generalService.alertMessage('Advertencia', response.original.message, 'warning');
        }
      },
      error: (error) => {
        this.loading = false;
        this.generalService.alertMessage(
          '¡Ups! Algo salió mal',
          'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo o contacta a nuestro equipo de soporte si el problema persiste. ¡Estamos aquí para ayudarte!',
          'warning'
        );
      }
    });
  }

  handleAction(event: { id: number, action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataModule.find((item: any) => item.id === id);

    if (action === "edit") {
      this.loading = true;
      this.formModule.controls["name"].setValue(this.dataTemp.name);
      this.formModule.controls["url"].setValue(this.dataTemp.url);
      this.formModule.controls["group"].setValue(this.dataTemp.module_group_id);
      this.formModule.controls["icon"].setValue(this.dataTemp.icon);
      this.formModule.markAllAsTouched();
      this.selectedIcon = this.dataTemp.icon;
      this.loading = false;
      this.showForm = true;
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
        this.moduleService.deleteRecordModuleById(id).subscribe({
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

  private actionMap: { [key: string]: (id: number) => Observable<any> } = {
    enable: (id: number) => this.moduleService.enableRecordModuleById(id),
    disable: (id: number) => this.moduleService.disableRecordModuleById(id),
  };

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
          next: (response) => {
            this.onFetchData(this.parameterDefect);
            this.loading = false;
            this.generalService.alertMessage('¡Éxito!', successMessage, 'success');
          },
          error: (error) => {
            this.loading = false;
            this.generalService.alertMessage('Error', 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo. Si el problema persiste, comunícate con soporte técnico', 'error');
          }
        });
      }
    });

  }

  openModalView(data: any) {
    Swal.fire({
      title: 'Módulo',
      html: `
        <div id="custom-icon-container">
          <p><strong>Icono : </strong><p id="icon-placeholder"></p></p>
          <p><strong>Nombre : </strong> <span>${data.name}</span> </p>
          <p><strong>Grupo : </strong> <span>${data.group_name}</span> </p>
          <p><strong>Ruta : </strong> <span>${data.url}</span> </p>
          <p><strong>Fecha de Creación: </strong> <span>${moment(data.created_at).format('DD/MM/YYYY hh:mm:ss A')}</span></p>
          <p><strong>Última actualización: </strong> <span>${moment(data.updated_at).format('DD/MM/YYYY hh:mm:ss A')}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      didOpen: () => {
        const iconPlaceholder = document.getElementById('icon-placeholder');
        const svgContainer = document.getElementById('svg-container');

        if (iconPlaceholder && svgContainer) {
          iconPlaceholder.innerHTML = svgContainer.innerHTML;
        }
      }
    });
  }

  openInformation() {
    Swal.fire({
      title: 'Información Importante',
      html: `
        <div id="custom-icon-container">
          <p>Debe ingresar la url de la ruta para el módulo ejemplo: /home. </p>
          <p>Esta ruta se debe parametrizar en el código</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      didOpen: () => {
        const iconPlaceholder = document.getElementById('icon-placeholder');
        const svgContainer = document.getElementById('svg-container');

        if (iconPlaceholder && svgContainer) {
          iconPlaceholder.innerHTML = svgContainer.innerHTML;
        }
      }
    });
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formModule.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addModule();
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

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.moduleService.getDataModule(params).subscribe((response) => {
      this.dataModuleTrasnform = this.formatedData(response.data, true);
      this.dataModule = response.data;
      this.totalRecord = response.total;
      this.acciones = true;
      this.loadingTable = false;
    }, (error) => {
      this.loadingTable = false;
      console.error('Error fetching data', error);
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
    this.dataModuleTrasnform = this.getData();
  }

}
