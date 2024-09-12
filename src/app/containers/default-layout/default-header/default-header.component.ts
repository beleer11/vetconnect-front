import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth-service.service';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService, private authService: AuthService, private router: Router) {
    super();
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        localStorage.removeItem('vet_connect_token');
        localStorage.removeItem('permissions');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
