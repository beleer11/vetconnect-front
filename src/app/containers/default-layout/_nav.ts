import { INavData } from '@coreui/angular';

export function getNavItemsFromPermissions(): INavData[] {
  const navItems: INavData[] = [];

  // Añadir el ítem de inicio por defecto
  navItems.push({
    name: 'Inicio',
    url: '/dashboard',
    iconComponent: { name: 'cil-home' }, // Puedes ajustar el ícono según sea necesario
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
      const hasVerPermission = module.permissions.some((permission: any) => permission.name === 'Ver' && permission.id === 1);
      console.log(hasVerPermission);

      // Solo añadir el módulo si no tiene el permiso de 'Ver'
      if (hasVerPermission) {
        navItems.push({
          name: module.module_name,
          url: module.module_url, // Usa la URL proporcionada en la estructura
          iconComponent: { name: module.module_icon } // Usa el ícono proporcionado en la estructura
        });
      }
    });
  });

  return navItems;
}
