import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private apiUrl: string = environment.apiUrl;
  private permissions: any = JSON.parse(localStorage.getItem('permissions') || '{}');

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

  /** Modulo **/
  getDataPermission(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/permission/index`, { params: params, ...this.getHttpOptions() });
  }

  sendPermission(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/permission/setData`, data, this.getHttpOptions());
  }

  editPermission(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/permission/editData/` + id, data, this.getHttpOptions());
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/permission/remove/${id}`, this.getHttpOptions());
  }

  disableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/permission/disable/${id}`, {}, this.getHttpOptions());
  }

  enableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/permission/enable/${id}`, {}, this.getHttpOptions());
  }

  getPermissionByUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/permission/getPermissionByUser/${id}`, this.getHttpOptions());
  }

  hasPermission(moduleName: string, action: string): boolean {
    for (const group of this.permissions) {
      for (const module of group.modules) {

        if (module.module_name === moduleName) {
          return module.permissions.some((perm: any) => {
            return perm.name === action;
          });
        }
      }
    }
    return false;
  }
}
