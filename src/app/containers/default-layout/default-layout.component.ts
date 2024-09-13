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

  ngOnInit() {
    const [items, noPermissions] = getNavItemsFromPermissions();
    this.navItems = items;
  }

  constructor() { }
}
