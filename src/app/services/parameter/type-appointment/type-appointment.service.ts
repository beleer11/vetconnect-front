import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeAppointmentService {
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

  getDataTypeAppointment(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type-appointment/index`, {
      params: params,
      ...this.getHttpOptions(),
    });
  }

  deleteRecordById(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/type-appointment/remove/${id}`,
      this.getHttpOptions()
    );
  }

  disableRecordTypeAppointmentById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/type-appointment/disable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  enableRecordTypeAppointmentById(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/type-appointment/enable/${id}`,
      {},
      this.getHttpOptions()
    );
  }

  sendTypeAppointment(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/type-appointment/setData`,
      data,
      this.getHttpOptions()
    );
  }

  editTypeAppointment(data: any, id: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/type-appointment/editData/` + id, data,
      this.getHttpOptions()
    );
  }

}
