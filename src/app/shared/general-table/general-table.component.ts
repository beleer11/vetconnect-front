import { ChangeDetectorRef, Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-general-table',
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.css']
})
export class GeneralTableComponent implements OnInit, OnChanges {

  @Input() columns: string[] = [];
  @Input() transformedData: any[] = [];
  @Input() data: any[] = [];
  @Input() acciones: boolean = false;
  @Input() columnAlignments: string[] = [];
  @Input() title: string = '';

  public searchValue: string = '';
  public filteredData: any[] = [];
  public currentSortColumn: string = '';
  public sortOrder: 'asc' | 'desc' = 'asc';

  // Paginador
  public currentPage: number = 1;
  public pageSize: number = 10;
  public totalPages: number = 0;
  public pagedData: any[] = [];
  public totalRecords: number = 0;


  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.columns.length > 0) {
      this.currentSortColumn = this.columns[0];
    }
    this.applySortingAndPagination();
  }

  ngOnChanges(): void {
    this.applySortingAndPagination();
    this.cdr.detectChanges();
  }

  onSearch(value: any): void {
    this.searchValue = value.target.value.toString();
    this.applySortingAndPagination();
  }

  clearSearch(): void {
    this.searchValue = '';
    this.applySortingAndPagination();
  }

  applySortingAndPagination(): void {
    this.filterData(this.searchValue);
    this.sortData(this.currentSortColumn, this.sortOrder);
    this.updatePagination();
    this.setPage(this.currentPage);
  }

  filterData(searchValue: string): void {
    const searchTerm = (searchValue || '').toLowerCase();
    this.filteredData = this.transformedData.filter(row => {
      return Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm)
      );
    });
    this.totalRecords = this.filteredData.length;
    this.updatePagination();
    this.setPage(1);
  }


  sortColumn(column: string): void {
    if (column === 'Foto') {
      return;
    }
    if (this.currentSortColumn === column) {
      this.sortOrder = this.sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      this.currentSortColumn = column;
      this.sortOrder = 'asc';
    }
    this.applySortingAndPagination();
  }

  sortData(column: string, order: 'asc' | 'desc'): void {
    this.filteredData = [...this.filteredData].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }
      return order === 'asc' ? comparison : -comparison;
    });
    this.updatePagination();
    this.setPage(this.currentPage);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }

  setPage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.filteredData.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
    this.applySortingAndPagination();
  }
}
