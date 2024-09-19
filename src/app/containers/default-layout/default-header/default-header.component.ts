import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth-service.service';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  public user_information: any | null = localStorage.getItem('user_information');
  public image_profile: string = '';
  public environment = environment;

  constructor(private classToggler: ClassToggleService, private authService: AuthService, private router: Router) {
    super();
    this.image_profile = JSON.parse(this.user_information).image_profile;
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        localStorage.removeItem('vet_connect_token');
        localStorage.removeItem('permissions');
        localStorage.removeItem('user_information');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
