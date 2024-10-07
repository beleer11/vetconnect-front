import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service.service';
import { GeneralService } from '../../services/general/general.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLogin!: FormGroup;
  email: string = '';
  password: string = '';
  btnLogin: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private generalService: GeneralService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required]],
      recordar: [false],
    });
  }

  async login() {
    if (this.formLogin.valid) {
      this.btnLogin = true;
      const datos = this.formLogin.value;

      try {
        const response = await this.authService.login({
          email: datos.correoElectronico,
          password: datos.contraseña
        }).toPromise();

        this.storeUserData(response);

        this.router.navigate(['/dashboard']);
      } catch (error) {
        this.btnLogin = false;
        let errorMessage = this.getErrorMessage(error);
        const showCancelButton = errorMessage.includes('sesión activa en otro dispositivo');

        errorMessage = errorMessage += '<br><br>¿Te gustaría cerrar la sesión activa en este momento?';

        const result = await this.showAlert(errorMessage, showCancelButton);

        if (result.isConfirmed && showCancelButton) {
          await this.forceLogout(datos.correoElectronico);
          this.login();
        }
      }
    }
  }

  private storeUserData(response: any) {
    localStorage.setItem('vet_connect_token', JSON.stringify(response.vet_connect_token));
    if (response.permission_module) {
      localStorage.setItem('permissions', response.permission_module);
    }
    if (response.user_information) {
      localStorage.setItem('user_information', response.user_information);
    }
  }

  private getErrorMessage(error: any): string {
    return error.error.error || error.error.message;
  }

  private async showAlert(message: string, showCancelButton: boolean) {
    return await Swal.fire({
      title: 'Advertencia',
      html: message,
      icon: 'warning',
      showCancelButton: showCancelButton,
      cancelButtonColor: 'red',
      confirmButtonColor: 'blue',
      confirmButtonText: showCancelButton ? 'Sí' : 'OK',
      cancelButtonText: 'No',
    });
  }

  private async forceLogout(email: string) {
    Swal.fire({
      title: 'Cerrando sesión...',
      text: 'Por favor, espere mientras cerramos la sesión activa en otro dispositivo.',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await this.authService.forceLogout(email).toPromise();

      Swal.fire({
        title: 'Sesión Cerrada',
        text: 'La sesión activa en otro dispositivo ha sido cerrada exitosamente. Te llevaremos a tu cuenta en unos segundos...',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          this.router.navigate(['/dashboard']);
        }
      });
    } catch (err) {
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cerrar la sesión. Inténtalo de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
}
