import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private apiUrl: string = environment.apiUrl;
  private userActivityObservable$: Observable<any>;
  private inactivityTimer$: Observable<any>;
  private userActivitySubscription: Subscription | null = null;
  private readonly INACTIVITY_TIME: number = 20 * 60 * 1000; // 20 minutos


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.userActivityObservable$ = merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'keydown'),
      fromEvent(window, 'click')
    );

    this.inactivityTimer$ = timer(this.INACTIVITY_TIME);

    // Monitorea los cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Comienza el monitoreo de inactividad solo si no está en la página de login
        if (!this.router.url.includes('/login')) {
          this.startInactivityMonitoring();
        } else {
          this.stopInactivityMonitoring();
        }
      }
    });
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
    this.userActivitySubscription = this.userActivityObservable$
      .pipe(
        switchMap(() => this.inactivityTimer$) // Reinicia el temporizador al detectar actividad
      )
      .subscribe(() => {
        // Verifica si hay un token antes de manejar el cierre de sesión
        if (!this.router.url.includes('/login')) {
          this.handleInactivityLogout();
        }
      });
  }

  stopInactivityMonitoring() {
    if (this.userActivitySubscription) {
      this.userActivitySubscription.unsubscribe();
      this.userActivitySubscription = null; // Reinicia la suscripción
    }
  }

  // Cierra sesión cuando hay inactividad
  private handleInactivityLogout() {
    this.stopInactivityMonitoring(); // Detén el monitoreo antes de cerrar sesión
    this.authService.logout().subscribe(
      (response) => {
        localStorage.removeItem('vet_connect_token');
        localStorage.removeItem('permissions');
        localStorage.removeItem('user_information');
        this.router.navigate(['/login']);
        this.alertMessage(
          '¡Te hemos desconectado por seguridad!',
          'Por tu protección, hemos cerrado tu sesión debido a inactividad prolongada. Si deseas continuar, inicia sesión nuevamente para seguir disfrutando de nuestros servicios.',
          'info'
        );
      },
      (error) => {
        // Manejo de error en logout
        if (error.status === 401) {
          // Si ya estás desconectado, no hacer nada
          console.error('Usuario ya desconectado, no se puede cerrar sesión nuevamente.');
        } else {
          console.error(error);
        }
      }
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
