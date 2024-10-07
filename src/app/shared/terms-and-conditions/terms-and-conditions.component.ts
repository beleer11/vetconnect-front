import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GridModule, CardModule } from '@coreui/angular';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [
    GridModule,
    CardModule
  ],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent implements OnInit {
  constructor(private location: Location) { }
  ngOnInit() {
    window.scrollTo(0, 0);  // Esto asegura que la página comience en la parte superior.
  }
  goBack(): void {
    this.location.back();  // Método para retroceder a la última página
  }
}
