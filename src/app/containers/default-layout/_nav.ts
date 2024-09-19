import { INavData } from '@coreui/angular';

export function getNavItemsFromPermissions(): [INavData[], boolean] {
  const navItems: INavData[] = [];
  let hasPermissions = false; // Variable para rastrear si hay permisos

  // Añadir el ítem de inicio por defecto
  navItems.push({
    name: 'Inicio',
    url: '/dashboard',
    iconComponent: { name: 'cil-home' },
  });

  // Recuperar permisos desde localStorage
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  // Procesar grupos y módulos
  permissions.forEach((group: any) => {
    // Añadir un título para el grupo de módulos
    navItems.push({
      title: true,
      name: group.group_module_name
    });

    group.modules.forEach((module: any) => {
      // Verificar permisos del módulo
      const hasVerPermission = module.permissions.some((permission: any) => permission.module_name === 'Ver');

      // Solo añadir el módulo si no tiene el permiso de 'Ver'
      if (!hasVerPermission) {
        navItems.push({
          name: module.module_name,
          url: module.module_url,
          iconComponent: { name: module.module_icon }
        });
        hasPermissions = true;
      }
    });
  });

  return [navItems, !hasPermissions];
}
