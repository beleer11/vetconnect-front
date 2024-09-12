import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

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

}
