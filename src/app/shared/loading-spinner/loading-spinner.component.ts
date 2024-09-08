import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent implements OnInit {

  randomText: string = '';

  texts: string[] = [
    "🐾 ¡Un momento, estamos cuidando los detalles para ti! 🐾",
    "🐾 ¡Cargando los últimos detalles para ofrecerte la mejor experiencia en gestión! 🐾",
    "🐾 ¡Estamos ajustando todo para que tu administración sea más eficiente y efectiva! 🐾",
    "🐾 ¡Cargando, para mejorar tu experiencia y la de tus clientes! 🐾",
    "🐾 ¡Ajustando cada detalle para que tu gestión sea impecable! 🐾",
    "🐾 ¡Preparando la plataforma para ofrecerte el mejor soporte en tu día a día! 🐾",
    "🐾 ¡En unos segundos, tendrás acceso a herramientas mejoradas para tu veterinaria! 🐾"
  ];

  ngOnInit(): void {
    this.getRandomText();
  }

  getRandomText() {
    const randomIndex = Math.floor(Math.random() * this.texts.length);
    this.randomText = this.texts[randomIndex];
  }
}
