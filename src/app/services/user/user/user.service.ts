import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    const accessToken = localStorage.getItem('vet_connect_token')?.replace(/['"]+/g, '');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
    };
  }


  getDataUser(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/index`, { params: params, ...this.getHttpOptions() });
  }

  generateUsername(nombre: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/user/generate-username?name=${nombre}`, this.getHttpOptions());
  }

  listPermission() {
    return this.http.get<string>(`${this.apiUrl}/user/listPermission`, this.getHttpOptions());
  }

  sendUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/setData`, data, this.getHttpOptions());
  }

  editUser(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/editData/${id}`, data, this.getHttpOptions());
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/remove/${id}`, this.getHttpOptions());
  }

  disableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/disable/${id}`, {}, this.getHttpOptions());
  }

  enableRecordById(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/enable/${id}`, {}, this.getHttpOptions());
  }

}
