import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl: string = environment.apiUrl;
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

  constructor(private http: HttpClient) {}

  // Método GET para obtener los datos de la compañía
  getDataCompany(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/company/index`, { params: params, ...this.getHttpOptions() });
  }

  getDataCompanies(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/company/index`, { params: params, ...this.getHttpOptions() });
  }

  sendCompany(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/company/setData`, data, this.getHttpOptions());
  }

  editCompany(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/company/editData/${id}`, data, this.getHttpOptions());
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/company/remove/${id}`, this.getHttpOptions());
  }

  disableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/company/disable/${id}`, {}, this.getHttpOptions());
  }

  enableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/company/enable/${id}`, {}, this.getHttpOptions());
  }

  public setData(data: any) {
    this.data = data;
  }

}
