import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypePetService {
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

  getDataTypePet(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type-pet/index`, { params: params, ...this.getHttpOptions() });
  }

  deleteRecordTypePetById(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/type-pet/remove/${id}`,
      this.getHttpOptions()
    );
  }

  disableRecordTypePetById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/type-pet/disable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  enableRecordTypePetById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/type-pet/enable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  sendTypePet(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/type-pet/setData`,
      data,
      this.getHttpOptions()
    );
  }

  editTypePet(data: any, id: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/type-pet/editData/` + id,
      data,
      this.getHttpOptions()
    );
  }

  listTypePet(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type-pet/list`, { ...this.getHttpOptions() });
  }

}
