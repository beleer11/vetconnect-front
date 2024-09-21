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

  constructor(private http: HttpClient) {}

  // Método GET para obtener los datos de la sucursal
  getDataBranch(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/branch/index`, {
      params: params,
      ...this.getHttpOptions(),
    });
  }

  getPermissionByCompany(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/permission/getPermissionByCompany/${id}`,
      this.getHttpOptions()
    );
  }
}
