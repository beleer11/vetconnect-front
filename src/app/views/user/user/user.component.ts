import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  public dataUser: any = [];
  public dataTransformada: any = [];
  public fieldsTable: any = [];
  public columnAlignments: any = [];
  public loading: boolean = true;
  public showForm: boolean = false;
  public formGroupModule!: FormGroup;
  public action: string = 'save';

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }


  async ngOnInit(): Promise<void> {
    this.dataTransformada = await this.getDataUser();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
    this.loading = false;
  }

  private async getDataUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getDataUser().subscribe(
        response => {
          this.dataUser = response;
          const transformedData = response.map((item: any) => {
            return {
              "id": item.id,
              "Nombres": item.name,
              "Usuario": item.username,
              "Correo": item.email,
              "Foto": environment.apiStorage + item.image_profile,
              "Fecha creación": moment(item.created_at).format('DD/MM/YYYY hh:mm:ss A'),
              "Ultima actualización": moment(item.updated_at).format('DD/MM/YYYY hh:mm:ss A')
            };
          });
          resolve(transformedData);
        },
        error => reject(error)
      );
    });
  }

  private getFieldsTable() {
    return ['Nombres', 'Usuario', 'Correo', 'Foto', 'Fecha creación', 'Ultima actualización'];
  }

  private getColumnAlignments() {
    return ['left', 'left', 'left', 'center', 'center', 'center'];
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

  onSubmit() {
    if (this.formGroupModule.valid) {
      if (this.action === 'save') {
        this.saveNewUser(this.formGroupModule.get('nombre')?.value);
      }

      if (this.action === 'edit') {
        //this.editGroupModule(this.formGroupModule.get('nombre')?.value, this.dataTemp.id);
      }
    }
  }

  public saveNewUser(nombre: string) {
    this.loading = true;
    /*this.moduleService.sendGroup({ "name": nombre }).subscribe({
      next: (response) => {
        if (response.original.success) {
          this.dataModule = response.original.data;
          if (Array.isArray(this.dataModule)) {
            this.dataModuleTrasnform = this.formatedData(this.dataModule);
          } else {
            this.dataModuleTrasnform = [];
          }

          this.loading = false;
          this.showForm = false;
          this.alertMessage('¡Éxito!', response.original.message, 'success');
        } else {
          this.loading = false;
          this.alertMessage('Advertencia', response.original.message, 'warning');
        }
      },
      error: (error) => {
        this.loading = false;
        this.alertMessage('Error', 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.', 'error');
      }
    });*/
  }

}
