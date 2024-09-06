import { Component, OnInit } from '@angular/core';
import { ModuleService } from '../../../services/parameter/module/module.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrl: './module.component.css'
})

export class ModuleComponent implements OnInit {

  public dataModule: any = [];
  public dataModuleTrasnform: any = [];
  public fieldsTable: any = [];
  public columnAlignments: any = [];

  constructor(
    private moduleService: ModuleService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }


  async ngOnInit(): Promise<void> {
    this.dataModuleTrasnform = await this.getData();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
  }

  private async getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.moduleService.getDataModule().subscribe(
        response => {
          this.dataModule = response;
          const transformedData = response.map((item: any) => {
            return {
              "id": item.id,
              "Nombres": item.name,
              "Usuario": item.username,
              "Correo": item.email,
              "Foto": environment.apiStorage + item.image_profile,
              "Fecha de creación": new Date(item.created_at).toLocaleDateString(),
              "Fecha ultima actualización": new Date(item.updated_at).toLocaleDateString()
            };
          });
          resolve(transformedData);
        },
        error => reject(error)
      );
    });
  }

  private getFieldsTable() {
    return ['Nombres', 'Usuario', 'Correo', 'Foto', 'Fecha de creación', 'Fecha ultima actualización'];
  }

  private getColumnAlignments() {
    return ['left', 'left', 'left', 'center', 'center', 'center'];
  }

}
