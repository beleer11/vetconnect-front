import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private apiUrl: string = environment.apiUrl;

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

  /** Modulo **/
  getDataPermission(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/permission/index`, this.httpOptions);
  }

  sendPermission(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/permission/setData`, data, this.httpOptions);
  }

  editPermission(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/permission/editData/` + id, data, this.httpOptions);
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/permission/remove/${id}`, this.httpOptions);
  }

  disableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/permission/disable/${id}`, {}, this.httpOptions);
  }

  enableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/permission/enable/${id}`, {}, this.httpOptions);
  }
}
