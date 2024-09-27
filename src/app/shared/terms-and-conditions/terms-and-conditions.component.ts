import { Component } from '@angular/core';
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
export class TermsAndConditionsComponent {
  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();  // Método para retroceder a la última página
  }
}
