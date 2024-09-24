import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
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

  // Método GET para obtener los datos de la sucursal
  getDataBranch(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/branch/index`, {
      params: params,
      ...this.getHttpOptions(),
    });
  }

  getListCompany(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/company/listCompany`,
      this.getHttpOptions()
    );
  }

  sendBranch(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/branch/setData`,
      data,
      this.getHttpOptions()
    );
  }

  editBranch(data: any, id: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/branch/editData/${id}`,
      data,
      this.getHttpOptions()
    );
  }

  disableRecordById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/branch/disable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  enableRecordById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/branch/enable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/branch/remove/${id}`,
      this.getHttpOptions()
    );
  }

  getCompanyByBranch(id: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/branch/getCompanyByBranch/${id}`,
      this.getHttpOptions()
    );
  }
}
