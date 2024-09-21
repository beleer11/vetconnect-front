import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth-service.service';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  @Output() logoutEvent: EventEmitter<any> = new EventEmitter();

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  public user_information: any | null = null;
  public environment = environment;

  constructor(private classToggler: ClassToggleService, private authService: AuthService, private router: Router) {
    super();
    const storedUserInfo = localStorage.getItem('user_information');
    this.user_information = storedUserInfo ? JSON.parse(storedUserInfo).data : null;
  }

  logout() {
    this.logoutEvent.emit(true);
    this.authService.logout().subscribe(
      (response) => {
        localStorage.removeItem('vet_connect_token');
        localStorage.removeItem('permissions');
        localStorage.removeItem('user_information');
        this.logoutEvent.emit(false);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
