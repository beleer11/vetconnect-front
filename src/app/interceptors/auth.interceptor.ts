import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general/general.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private generalService: GeneralService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Agregar un token a las cabeceras de la solicitud si existe
    const token = localStorage.getItem('vet_connect_token')?.replace(/['"]+/g, '');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.status);
        if (error.status === 401) {
          localStorage.removeItem('vet_connect_token');
          localStorage.removeItem('permissions');
          localStorage.removeItem('user_information');
          this.generalService.alertMessage(
            'Advertencia',
            'Hemos detectado que tu cuenta ha sido usada para iniciar sesión en otro dispositivo. Si no reconoces esta acción, te recomendamos contactar al soporte técnico de inmediato para proteger tu información.',
            'warning'
          );
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
}
