import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = environment.apiUrl;
  private opcion: string = '';
  private id: number = 0;
  private data: any = null;

  private accessToken = localStorage
    .getItem('vet_connect_token')
    ?.replace(/['"]+/g, '');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }),
  };

  constructor(private http: HttpClient) { }


  getDataUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/index`, this.httpOptions);
  }

  generateUsername(nombre: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/user/generate-username?name=${nombre}`, this.httpOptions);
  }

  listPermission() {
    return this.http.get<string>(`${this.apiUrl}/user/listPermission`, this.httpOptions);
  }

  sendUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/setData`, data, this.httpOptions);
  }

  editUser(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/editData/${id}`, data, this.httpOptions);
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/remove/${id}`, this.httpOptions);
  }

  disableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/disable/${id}`, {}, this.httpOptions);
  }

  enableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/enable/${id}`, {}, this.httpOptions);
  }

}
