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

  private getHttpOptions() {
    const accessToken = localStorage.getItem('vet_connect_token')?.replace(/['"]+/g, '');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
    };
  }

  constructor(private http: HttpClient) { }

  getDataRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rol/index`, this.getHttpOptions());
  }

  getPermissionByRol(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/permission/getPermissionByRol/${id}`, this.getHttpOptions());
  }

  sendRol(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rol/setData`, data, this.getHttpOptions());
  }

  editRol(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/rol/editData/${id}`, data, this.getHttpOptions());
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rol/remove/${id}`, this.getHttpOptions());
  }

  disableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/rol/disable/${id}`, {}, this.getHttpOptions());
  }

  enableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/rol/enable/${id}`, {}, this.getHttpOptions());
  }


  /** Getter Setter Rol */

  public setData(data: any) {
    this.data = data;
  }

}
