import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <app-loading-spinner [isLoading]="isLoading" spinnerImage="assets/my-spinner.gif"></app-loading-spinner>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  title = 'VetConnect';

  //controla la visibilidad del spinner de carga
  isLoading = true;

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = iconSubset as any;

    // Simulación de una carga para probar el spinner
    setTimeout(() => {
      this.isLoading = false; // Se detiene el spinner después de 3 segundos
    }, 3000);
  }

  ngOnInit(): void { }
}
