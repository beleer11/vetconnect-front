import { Component, Input, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-card-pet',
  templateUrl: './card-pet.component.html',
  styleUrls: ['./card-pet.component.css'],
})
export class CardPetComponent implements AfterViewInit {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() dataPet: any = [];
  private dataPetOriginal: any = []; // Copia de los datos originales
  flippedCards: boolean[] = [];
  public searchValue: string = '';
  public currentSortColumn: string = '';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public viewAcciones: boolean = false;
  public isLoading: boolean = false;
  public currentPage: number = 1;
  public pageSize: number = 2; // Mostrar 2 elementos por página
  public totalPages: number = 0;
  @Input() totalRecords: number = 0;
  @Output() fetchDataEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.flippedCards = Array(this.dataPet.length).fill(false);
  }

  ngAfterViewInit(): void {
    // Hacer una copia de los datos originales
    this.dataPetOriginal = [...this.dataPet];
    this.totalRecords = this.dataPetOriginal.length;
    this.calculateTotalPages();
    this.applySortingAndPagination();
  }

  toggleFlip(index: number): void {
    this.flippedCards[index] = !this.flippedCards[index];
  }

  generatePDF(pet: any): void {
    // Lógica para generar PDF
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applySortingAndPagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applySortingAndPagination();
    }
  }

  applySortingAndPagination(): void {
    this.isLoading = true;
    this.paginateDataPet();
    this.emitFetchDataEvent();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  paginateDataPet(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataPet = this.dataPetOriginal.slice(startIndex, endIndex);
  }

  emitFetchDataEvent(): void {
    const params = {
      search: this.searchValue,
      sortColumn: this.currentSortColumn,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      pageSize: this.pageSize,
    };
    this.fetchDataEvent.emit(params);
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
    this.calculateTotalPages();
    this.applySortingAndPagination();
  }
}
