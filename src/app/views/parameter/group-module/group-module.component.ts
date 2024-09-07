import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleService } from '../../../services/parameter/module/module.service';

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

  constructor(
    private moduleService: ModuleService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.createForm();
    this.dataModuleTrasnform = await this.getData();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
  }

  private async getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.moduleService.getDataGroupModule().subscribe(
        response => {
          this.dataModule = response;
          const transformedData = response.map((item: any) => {
            return {
              id: item.id,
              Nombre: item.name
            };
          });
          resolve(transformedData);
        },
        error => reject(error)
      );
    });
  }

  private getFieldsTable() {
    return ['Nombre'];
  }

  private getColumnAlignments() {
    return ['left'];
  }

  public createForm() {
    this.formGroupModule = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (this.formGroupModule.valid) {
      const nombre = this.formGroupModule.get('nombre')?.value;

      this.moduleService.sendGroup({ "name": nombre }).subscribe({
        next: (response) => {
          // Manejar la respuesta del servidor
          console.log('Grupo enviado con éxito', response);
        },
        error: (error) => {
          // Manejar errores
          console.error('Error al enviar el grupo', error);
        }
      });
    }
  }

}
