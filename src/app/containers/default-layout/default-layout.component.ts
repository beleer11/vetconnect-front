import { Component } from '@angular/core';

import { getNavItemsFromPermissions } from './_nav'; // Ajusta la ruta según tu estructura de archivos

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  public navItems = getNavItemsFromPermissions();

  constructor() { }
}
