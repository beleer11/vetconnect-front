import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { ModuleService } from '../../../services/parameter/module/module.service';
import * as bootstrap from 'bootstrap';
interface Icon {
  name: string;
  svg: string;
}

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
})

export class ModuleComponent implements AfterViewInit {
  public dataModule: any = [];
  public dataModuleTrasnform: any = [];
  public fieldsTable: any = [];
  public columnAlignments: any = [];
  public showForm: boolean = false;
  public formModule!: FormGroup;
  public selectedIcon: string | null = null;
  public selectedIconSVG: string | null = null;
  public icons: any;

  constructor(
    private moduleService: ModuleService,
    private fb: FormBuilder,
    private router: Router,
    public iconSet: IconSetService
  ) {
    this.iconSet.icons = { ...freeSet };
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    let prefix = 'cil';
    this.icons = this.getIconsView(prefix);
    console.log('Icons:', this.icons); // Verifica los valores

    this.dataModuleTrasnform = await this.getData();
    this.fieldsTable = this.getFieldsTable();
    this.columnAlignments = this.getColumnAlignments();
  }

  ngAfterViewInit(): void {
    // Inicializar tooltips
    const tooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.forEach((tooltip) => {
      new bootstrap.Tooltip(tooltip as HTMLElement);
    });
  }

  private async getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.moduleService.getDataModule().subscribe(
        response => {
          this.dataModule = response;
          const transformedData = response.map((item: any) => {
            return {
              id: item.id,
              Nombre: item.name,
              Icono: item.icon,
              Ruta: item.url,
            };
          });
          resolve(transformedData);
        },
        error => reject(error)
      );
    });
  }

  private getFieldsTable() {
    return ['Nombre', 'Icono', 'Ruta'];
  }

  private getColumnAlignments() {
    return ['left', 'left', 'left'];
  }

  public createForm() {
    this.formModule = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      url: ['', Validators.required],
      group: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.formModule.valid) {
      console.log(this.formModule.value);
    }
  }

  getIconsView(prefix: string) {
    return Object.entries(this.iconSet.icons).filter((icon) => {
      return icon[0].startsWith(prefix);
    });
  }

  toKebabCase(str: string) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  selectIcon(name: string) {
    this.selectedIcon = name;
    this.formModule.patchValue({ icon: name });
  }

  isIconSelected(name: string): boolean {
    return this.selectedIcon === name;
  }
}
