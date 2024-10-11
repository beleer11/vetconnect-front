import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PetService {

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

  getDataPet(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pet/index`, {
      params: params,
      ...this.getHttpOptions(),
    });
  }

  listCustomer() {
    return this.http.get<string>(`${this.apiUrl}/customer/listCustomer`, this.getHttpOptions());
  }
}
