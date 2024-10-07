import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IconSetService } from '@coreui/icons-angular';
import { GeneralService } from 'src/app/services/general/general.service';
import { freeSet } from '@coreui/icons';

@Component({
  selector: 'app-type-pet',
  templateUrl: './type-pet.component.html',
  styleUrl: './type-pet.component.css'
})
export class TypePetComponent {
  public loading: boolean = true;
  public showForm: boolean = false;
  public showTypePet: boolean = false;
  public formTypePet!: FormGroup;
  public action: string = 'save';
  public viewTable: boolean = false;
  public parameterDefect = {};
  public dataTypePetTrasnform: any = [];

  constructor(
    public iconSet: IconSetService,
    private generalService: GeneralService,
    //private typePetService: TypePetService,
  ) {
    this.iconSet.icons = { ...freeSet };
  }

  private getData() {
    /* this.TypePetService.getDataModule(this.parameterDefect).subscribe(
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
      }); */
  }

  public addTypePet() {
    this.showForm = true;
    this.formTypePet.reset();
    this.action = 'save';
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
    this.dataTypePetTrasnform = this.getData();
  }
}
