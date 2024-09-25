import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verifica si hay un token de autenticación en localStorage
    if (localStorage.getItem('vet_connect_token')) {
      return true; // Si hay un token, permite el acceso
    }

    // Si no hay token, redirige a la página de login
    this.router.navigate(['login']);
    return false; // Deniega el acceso
  }
}
