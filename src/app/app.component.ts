import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset'; // Asegúrate de la ruta correcta
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'VetConnect';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = iconSubset as any; // Cast necesario para evitar problemas de tipo
  }

  ngOnInit(): void { }
}
