import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { PermissionService } from '../../services/user/permission/permission.service';

@Component({
  selector: 'app-general-table',
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.css'],
})
export class GeneralTableComponent implements OnInit, OnChanges {
  @Input() columns: string[] = [];
  @Input() transformedData: any[] = [];
  @Input() data: any[] = [];
  @Input() acciones: boolean = false;
  @Input() columnAlignments: string[] = [];
  @Input() title: string = '';
  @Input() totalRecords: number = 0;
  @Input() loadingTable: boolean = true;
  @Output() actionEvent: EventEmitter<{ id: number; action: string }> = new EventEmitter();
  @Output() fetchDataEvent: EventEmitter<any> = new EventEmitter();

  public searchValue: string = '';
  public currentSortColumn: string = '';
  public sortOrder: 'asc' | 'desc' = 'asc';
  public viewAcciones: boolean = false;
  public isLoading: boolean = false;

  // Paginador
  public currentPage: number = 1;
  public pageSize: number = 10;
  public totalPages: number = 0;

  constructor(private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.hasAnyRequiredPermission();
    if (this.columns.length > 0) {
      this.currentSortColumn = this.columns[0];
    }
    this.sortOrder = 'desc';
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title'] || changes['acciones']) {
      this.hasAnyRequiredPermission();
    }

    if (changes['loadingTable']) {
      this.isLoading = changes['loadingTable'].currentValue;
    }

    if (changes['data']) {
      this.data = changes['data'].currentValue;
    }

    if (changes['transformedData']) {
      this.transformedData = changes['transformedData'].currentValue;
    }

    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  onSearch(): void {
    this.applySortingAndPagination();
  }

  clearSearch(): void {
    this.searchValue = '';
    this.applySortingAndPagination();
  }

  applySortingAndPagination(): void {
    this.isLoading = true;
    this.emitFetchDataEvent();
  }

  sortColumn(column: string): void {
    if (
      column === 'Foto' ||
      column === 'Icono' ||
      column === 'No se encontraron resultados'
    ) {
      return;
    }
    if (this.currentSortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortColumn = column;
      this.sortOrder = 'asc';
    }
    this.applySortingAndPagination();
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

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
    this.applySortingAndPagination();
  }

  onAction(id: number, action: string): void {
    this.actionEvent.emit({ id, action });
  }

  hasPermission(action: string): boolean {
    return this.permissionService.hasPermission(this.title, action);
  }

  hasAnyRequiredPermission(): boolean {
    return this.hasPermission('Editar') || this.hasPermission('Eliminar');
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
}
