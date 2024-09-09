import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Inicio',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    title: true,
    name: 'Usuarios'
  },
  {
    name: 'Usuarios',
    url: '/user',
    iconComponent: { name: 'cil-user' }
  },
  {
    title: true,
    name: 'Configuración'
  },
  {
    name: 'Módulos',
    url: '/module',
    iconComponent: { name: 'cil-view-module' }
  },
  {
    name: 'Grupo de Módulo',
    url: '/group-module',
    iconComponent: { name: 'cil-object-group' }
  },
  {
    name: 'Permisos',
    url: '/permission',
    iconComponent: { name: 'cil-door' }
  }
];
