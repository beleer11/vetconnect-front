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

      this.authService.login({ email: datos.correoElectronico, password: datos.contraseña }).subscribe(
        async (response) => {
          localStorage.setItem('vet_connect_token', JSON.stringify(response.vet_connect_token));

          if (response.permission_module) {
            localStorage.setItem('permissions', response.permission_module);
          }

          if (response.user_information) {
            localStorage.setItem('user_information', response.user_information);
          }

          this.router.navigate(['/dashboard']);
        },
        async (error) => {
          this.btnLogin = false;
          let errorMessage = error.error.error;
          let showCancelButton = false;

          if (errorMessage === 'Ya tienes una sesión activa en otro dispositivo o navegador. Por favor, cierra sesión primero.') {
            errorMessage += '<br><br>¿Te gustaría cerrar la sesión activa en este momento?';
            showCancelButton = true;
          }

          // Utiliza await para manejar la promesa de Swal.fire
          const result = await Swal.fire({
            title: 'Advertencia',
            html: errorMessage,
            icon: 'warning',
            showCancelButton: showCancelButton,
            cancelButtonColor: 'red',
            confirmButtonColor: 'blue',
            confirmButtonText: showCancelButton ? 'Sí' : 'OK',
            cancelButtonText: 'No',
          });

          if (result.isConfirmed && showCancelButton) {
            // Esperar a que se cierre el Swal antes de ejecutar el logout
            await Swal.fire({
              title: 'Sesión Cerrada',
              text: 'La sesión activa en otro dispositivo ha sido cerrada exitosamente. ¡Inicia sesión para continuar! 🔒',
              icon: 'success',
              confirmButtonText: 'OK',
            });

            // Luego ejecutar el logout
            this.authService.logout().subscribe(
              () => {
                localStorage.removeItem('vet_connect_token');
                localStorage.removeItem('permissions');
                localStorage.removeItem('user_information');
              },
              (error) => {
                console.error(error);
              }
            );
          }
        }
      );
    }
  }


}
