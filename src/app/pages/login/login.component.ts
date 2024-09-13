import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLogin!: FormGroup;
  email: string = '';
  password: string = '';
  mesageError: string = '';
  btnLogin: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
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

  login() {
    if (this.formLogin.valid) {
      this.mesageError = '';
      this.btnLogin = true;
      const datos = this.formLogin.value;
      this.authService
        .login({ email: datos.correoElectronico, password: datos.contraseña })
        .subscribe(
          (response) => {
            localStorage.setItem(
              'vet_connect_token',
              JSON.stringify(response.vet_connect_token)
            );
            if (response.permission_module) {
              localStorage.setItem('permissions', response.permission_module);
            }
            if (response.user_information) {
              localStorage.setItem('user_information', response.user_information);
            }
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            this.btnLogin = false;
            this.mesageError = error.error.error;
            setTimeout(() => {
              this.mesageError = '';
            }, 6000);
            this.router.navigate(['/login']);
          }
        );
    } else {
      this.mesageError = 'Por favor ingresa los datos';
      setTimeout(() => {
        this.mesageError = '';
      }, 3000);
    }
  }
}
