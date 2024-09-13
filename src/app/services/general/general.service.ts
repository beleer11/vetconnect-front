import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private apiUrl: string = environment.apiUrl;

  private accessToken = localStorage
    .getItem('vet_connect_token')
    ?.replace(/['"]+/g, ''); // Eliminar comillas

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }),
  };

  constructor(private http: HttpClient) { }

  getAllData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/allData/${id}`, this.httpOptions);
  }

  convertToBase64Files(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  public alertMessage(title: any, text: any, icon: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK'
    });
  }

  public alertMessageInCreation() {
    Swal.fire({
      title: '¡Estamos trabajando en ello!',
      html: `La acción que está intentando realizar está actualmente en construcción.<br>
      Nuestro equipo está trabajando arduamente para ofrecerle esta funcionalidad lo antes posible.<br><br>
      Agradecemos su paciencia y comprensión.<br><br>
      ¡Le notificaremos cuando esté disponible para que pueda comenzar a utilizarla!<br><br>
      Si tiene alguna pregunta o necesita asistencia adicional, no dude en contactarnos.`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }



}
