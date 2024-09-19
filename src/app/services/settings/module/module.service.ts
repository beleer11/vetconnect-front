import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private apiUrl: string = environment.apiUrl;

  private getHttpOptions() {
    const accessToken = localStorage
      .getItem('vet_connect_token')
      ?.replace(/['"]+/g, '');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
    };
  }

  constructor(private http: HttpClient) { }

  /** Modulo **/
  getDataModule(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/module/index`, { params: params, ...this.getHttpOptions() });
  }

  sendModule(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/module/setData`,
      data,
      this.getHttpOptions()
    );
  }

  editModule(data: any, id: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/module/editData/` + id,
      data,
      this.getHttpOptions()
    );
  }

  deleteRecordModuleById(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/module/remove/${id}`,
      this.getHttpOptions()
    );
  }

  disableRecordModuleById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/module/disable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  enableRecordModuleById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/module/enable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  /** Grupo de modulo **/
  sendGroup(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/module/groupModule/setData`,
      data,
      this.getHttpOptions()
    );
  }

  editGroup(data: any, id: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/module/groupModule/editData/` + id,
      { name: data },
      this.getHttpOptions()
    );
  }

  getDataGroupModule(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/module/groupModule/index`, {
      params: params,
      ...this.getHttpOptions(),
    });
  }

  deleteRecordGroupModuleById(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/module/groupModule/remove/${id}`,
      this.getHttpOptions()
    );
  }

  disableRecordGroupModuleById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/module/groupModule/disable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  enableRecordGroupModuleById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/module/groupModule/enable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  listGroupModule(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/module/groupModule/list`,
      this.getHttpOptions()
    );
  }
}
