import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { GeneralService } from './services/general/general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'VetConnect';
  public isLoading = true;

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private generalService: GeneralService
  ) {
    titleService.setTitle(this.title);
    iconSetService.icons = iconSubset as any;
  }

  ngOnInit(): void {
    this.generalService.startInactivityMonitoring();
    this.isLoading = false;
  }
}
