import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

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

  getDataCustomer(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customer/index`, {
      params: params,
      ...this.getHttpOptions(),
    });
  }

  listCustomer() {
    return this.http.get<string>(`${this.apiUrl}/customer/listCustomer`, this.getHttpOptions());
  }

  sendCustomer(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/customer/setData`, data, this.getHttpOptions());
  }

  editCustomer(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/customer/editData/${id}`, data, this.getHttpOptions());
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customer/remove/${id}`, this.getHttpOptions());
  }

  disableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/customer/disable/${id}`, {}, this.getHttpOptions());
  }

  enableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/customer/enable/${id}`, {}, this.getHttpOptions());
  }
}
