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
    name: 'Roles',
    url: '/rol',
    iconComponent: { name: 'cil-weightlifitng' }
  },
  {
    name: 'Permisos',
    url: '/permission',
    iconComponent: { name: 'cil-door' }
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
    title: true,
    name: 'Parametros'
  },
  {
    name: 'Compañía',
    url: '/company', //ruta del componente que se instacia en routing module
    iconComponent: { name: 'cil-industry' }
  }
];
