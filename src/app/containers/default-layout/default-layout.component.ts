import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { getNavItemsFromPermissions } from './_nav'; // Ajusta la ruta según tu estructura de archivos

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {

  public navItems: INavData[] = [];
  noPermissionsMessage: string | null = null;

  ngOnInit() {
    const [items, noPermissions] = getNavItemsFromPermissions();
    this.navItems = items;
    this.noPermissionsMessage = noPermissions ? 'No tiene permisos en ningún módulo' : null;
  }

  constructor() { }
}
