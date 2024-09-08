import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';

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
    private iconSetService: IconSetService
  ) {
    titleService.setTitle(this.title);
    iconSetService.icons = iconSubset as any;

  }

  ngOnInit(): void {
    this.isLoading = false;
  }
}
