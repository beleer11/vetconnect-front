import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {
  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();  // Método para retroceder a la última página
  }
}
