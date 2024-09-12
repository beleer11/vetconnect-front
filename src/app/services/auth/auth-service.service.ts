import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private accessToken = localStorage
    .getItem('vet_connect_token')
    ?.replace(/['"]+/g, '');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    }),
  };

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  getUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, this.httpOptions);
  }

  logout(): Observable<any> {
    const accessToken = localStorage.getItem('vet_connect_token')?.replace(/['"]+/g, '');
    if (accessToken) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        })
      };

      return this.http.post<any>(`${this.apiUrl}/logout`, {}, httpOptions);
    } else {
      console.warn('No access token found');
      return of(null);
    }
  }


  register(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, formData);
  }
}
