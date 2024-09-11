import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

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
  getDataModule(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/module/index`, this.httpOptions);
  }

  sendModule(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/module/setData`, data, this.httpOptions);
  }

  editModule(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/module/editData/` + id, data, this.httpOptions);
  }

  deleteRecordModuleById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/module/remove/${id}`, this.httpOptions);
  }

  disableRecordModuleById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/module/disable/${id}`, {}, this.httpOptions);
  }

  enableRecordModuleById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/module/enable/${id}`, {}, this.httpOptions);
  }

  /** Grupo de modulo **/
  sendGroup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/module/groupModule/setData`, data, this.httpOptions);
  }

  editGroup(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/module/groupModule/editData/` + id, { "name": data }, this.httpOptions);
  }

  getDataGroupModule(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/module/groupModule/index`, this.httpOptions);
  }

  deleteRecordGroupModuleById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/module/groupModule/remove/${id}`, this.httpOptions);
  }

  disableRecordGroupModuleById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/module/groupModule/disable/${id}`, {}, this.httpOptions);
  }

  enableRecordGroupModuleById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/module/groupModule/enable/${id}`, {}, this.httpOptions);
  }

  listGroupModule(): Observable<any> {
    return this.http.get(`${this.apiUrl}/module/groupModule/list`, this.httpOptions);
  }
}
