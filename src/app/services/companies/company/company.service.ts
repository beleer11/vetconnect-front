import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl: string = environment.apiUrl;

  private accessToken = localStorage
    .getItem('vet_connect_token')
    ?.replace(/['"]+/g, ''); // Obtenemos el token y eliminamos las comillas

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }),
  };

  constructor(private http: HttpClient) {}

  // Método GET para obtener los datos de la compañía
  getDataCompany(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/company/index`, this.httpOptions);
  }

  // Método POST para guardar los datos de una nueva compañía
  saveCompany(companyData: {
    name: string;
    email: string;
    business_name: string;
    phone: string;
    tax_id: string;
    legal_representative: string;
    is_active: boolean;
    logo: string | null;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/company/setData`, companyData, this.httpOptions);
  }
}
