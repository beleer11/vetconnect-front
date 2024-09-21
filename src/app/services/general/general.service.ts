import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private apiUrl: string = environment.apiUrl;
  private userActivityObservable$: Observable<any>;
  private inactivityTimer$: Observable<any>;
  private userActivitySubscription: Subscription | null = null;
  private readonly INACTIVITY_TIME: number = 20 * 60 * 1000; // 20 minutos

  constructor(private http: HttpClient, private router: Router) {
    this.userActivityObservable$ = merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'keydown'),
      fromEvent(window, 'click')
    );

    this.inactivityTimer$ = timer(this.INACTIVITY_TIME);
    this.startInactivityMonitoring();
  }

  private getHttpOptions() {
    const accessToken = localStorage.getItem('vet_connect_token')?.replace(/['"]+/g, '');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
    };
  }

  // Monitoreo de inactividad y cierre de sesión
  startInactivityMonitoring() {
    console.log("entra a la funcion")
    this.userActivitySubscription = this.userActivityObservable$
      .pipe(
        switchMap(() => this.inactivityTimer$) // Reinicia el temporizador al detectar actividad
      )
      .subscribe(() => {
        this.handleInactivityLogout();
      });
  }

  stopInactivityMonitoring() {
    if (this.userActivitySubscription) {
      this.userActivitySubscription.unsubscribe();
    }
  }

  // Cierra sesión cuando hay inactividad
  private handleInactivityLogout() {
    console.log("entra a ceerar")
    localStorage.removeItem('vet_connect_token');
    localStorage.removeItem('permissions');
    localStorage.removeItem('user_information');
    this.router.navigate(['/login']);
    this.alertMessage(
      '¡Te hemos desconectado por seguridad!',
      'Por tu protección, hemos cerrado tu sesión debido a inactividad prolongada. Si deseas continuar, inicia sesión nuevamente para seguir disfrutando de nuestros servicios.',
      'info'
    );
  }

  // Convertir imágenes a base 64
  convertToBase64Files(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Alerta general
  public alertMessage(title: any, text: any, icon: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK'
    });
  }

  // Mensaje de alerta para procesos en construcción
  public alertMessageInCreation() {
    Swal.fire({
      title: '¡Estamos trabajando en ello!',
      html: `La acción que está intentando realizar está actualmente en construcción.<br>
      Nuestro equipo está trabajando arduamente para ofrecerle esta funcionalidad lo antes posible.<br><br>
      Agradecemos su paciencia y comprensión.<br><br>
      ¡Le notificaremos cuando esté disponible para que pueda comenzar a utilizarla!<br><br>
      Si tiene alguna pregunta o necesita asistencia adicional, no dude en contactarnos.`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }
}
