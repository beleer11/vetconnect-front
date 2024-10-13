import { Component, Input, ViewChild, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-card-pet',
  templateUrl: './card-pet.component.html',
  styleUrls: ['./card-pet.component.css'],
})
export class CardPetComponent implements AfterViewInit {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() dataPet: any = [];
  flippedCards: boolean[] = [];

  constructor() {
    this.flippedCards = Array(this.dataPet.length).fill(false);
  }

  ngAfterViewInit(): void {
  }

  toggleFlip(index: number): void {
    this.flippedCards[index] = !this.flippedCards[index];
  }

  generatePDF(pet: any): void {

  }

}
