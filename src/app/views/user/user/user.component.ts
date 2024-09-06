import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  public dataUser: any = [];
  public dataTransformada: any = [];
  public fieldsTable: any = [];
  public environment = environment;
  public columnAlignments: any = [];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }


  async ngOnInit(): Promise<void> {
    this.dataTransformada = await this.getDataUser();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
  }

  private async getDataUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getDataUser().subscribe(
        response => {
          this.dataUser = response;
          // Transformar los datos
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
