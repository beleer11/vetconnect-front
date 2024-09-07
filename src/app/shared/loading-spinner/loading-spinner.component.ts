import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Input() spinnerImage: string = '';  // Permitir que el componente padre pase la imagen

  ngOnInit(): void {
    // Asignar imagen por defecto si no se pasa una desde el componente padre
    if (!this.spinnerImage) {
      this.spinnerImage = 'assets/images/angular.jpg';  // Ruta relativa desde la raíz del proyecto
    }
  }
}

