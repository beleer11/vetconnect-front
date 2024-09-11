import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl: string = environment.apiUrl;
  private opcion: string = '';
  private id: number = 0;
  private data: any = null;

  private accessToken = localStorage
    .getItem('access_token')
    ?.replace(/['"]+/g, '');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }),
  };

  constructor(private http: HttpClient) { }

  getDataRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rol/index`, this.httpOptions);
  }

  getPermissionByRol(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/permission/getPermissionByRol/${id}`, this.httpOptions);
  }

  sendRol(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rol/setData`, data, this.httpOptions);
  }

  editRol(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/rol/editData/${id}`, data, this.httpOptions);
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rol/remove/${id}`, this.httpOptions);
  }

  disableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/rol/disable/${id}`, {}, this.httpOptions);
  }

  enableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/rol/enable/${id}`, {}, this.httpOptions);
  }


  /** Getter Setter Rol */

  public setData(data: any) {
    this.data = data;
  }

}
