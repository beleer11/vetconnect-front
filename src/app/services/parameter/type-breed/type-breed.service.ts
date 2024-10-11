import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeBreedService {

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

  getDataTypesBreeds(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type-breed/index`, {
      params: params,
      ...this.getHttpOptions(),
    });
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/type-breed/remove/${id}`,
      this.getHttpOptions()
    );
  }

  disableRecordTypesBreedsById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/type-breed/disable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  enableRecordTypesBreedsById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/type-breed/enable/${id}`,
      {},
      this.getHttpOptions()
    );
  }


  sendTypesBreeds(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/type-breed/setData`,
      data,
      this.getHttpOptions()
    );
  }

  editTypesBreeds(data: any, id: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/type-breed/editData/` + id, data,
      this.getHttpOptions()
    );
  }

  listTypeBreed(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type-breed/list`, { ...this.getHttpOptions() });
  }
}
