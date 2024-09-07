import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private apiUrl: string = environment.apiUrl;

  private accessToken = localStorage
    .getItem('access_token')
    ?.replace(/['"]+/g, '');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }),
  };

  constructor(private http: HttpClient) { }

  getDataModule(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/module/index`, this.httpOptions);
  }

  sendGroup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/module/groupModule/setData`, data, this.httpOptions);
  }

  getDataGroupModule(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/module/groupModule/index`, this.httpOptions);
  }
}
