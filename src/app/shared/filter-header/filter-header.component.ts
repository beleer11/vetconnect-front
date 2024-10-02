import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BranchService } from '../../services/companies/branch/branch.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-filter-header',
  templateUrl: './filter-header.component.html',
  styleUrl: './filter-header.component.css',
  animations: [
    trigger('accordionAnimation', [
      state('open', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('open <=> closed', [
        style({ overflow: 'hidden' }),  // Agregamos overflow al inicio para evitar glitches
        animate('500ms ease-in-out', style({
          height: '*',
          opacity: 1
        }))
      ])
    ])
  ]
})
export class FilterHeaderComponent {
  @Input() date: boolean = false;
  @Input() rol: boolean = false;
  @Input() companyAndRol: boolean = false;
  @Input() state: boolean = false;
  @Input() name: boolean = false;
  @Input() email: boolean = false;
  @Input() title: string = '';
  @Output() filterDataEvent: EventEmitter<any> = new EventEmitter();
  @Output() changeFilter: EventEmitter<any> = new EventEmitter();

  public formFilter!: FormGroup;
  public today = new Date();
  public year = this.today.getFullYear();
  public month = String(this.today.getMonth() + 1).padStart(2, '0');
  public day = String(this.today.getDate()).padStart(2, '0');
  public dateInitValue = `${this.year}-${this.month}-01`;
  public dateFinishValue = `${this.year}-${this.month}-${this.day}`;
  public loadingBranch: boolean = false;
  public dataCompany: any = [];
  public dataBranch: any = [];
  public searchControl = new FormControl('');
  public isAccordionOpen = true;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService
  ) { }

  async ngOnInit() {
    this.createForm();
    this.formFilter.valueChanges.subscribe(() => {
      this.onFilterChange();
    });
  }

  onFilterChange(): void {
    this.changeFilter.emit(false);
  }

  public createForm() {
    this.formFilter = this.fb.group({});

    if (this.date) {
      this.formFilter.addControl('dateInit', this.fb.control(this.dateInitValue, [Validators.required]));
      this.formFilter.addControl('dateFinish', this.fb.control(this.dateFinishValue, [Validators.required]));
    }

    if (this.state) {
      this.formFilter.addControl('state', this.fb.control(true));
    }

    if (this.rol) {
      this.formFilter.addControl('rol_id', this.fb.control(''));
    }

    if (this.companyAndRol) {
      this.formFilter.addControl('company_id', this.fb.control(''));
      this.formFilter.addControl('branch_id', this.fb.control({ value: '', disabled: true }));
      this.getDataCompany();
    }

    if (this.name) {
      this.formFilter.addControl('name', this.fb.control('', [Validators.minLength(3)]));
    }

    if (this.email) {
      this.formFilter.addControl('email', this.fb.control('', [Validators.email]));
    }

    this.formFilter.markAllAsTouched();
  }

  getDataCompany() {
    this.branchService.getListCompany().subscribe(
      async response => {
        this.dataCompany = response;
      },
      error => {
        console.log(error.message);
      }
    );
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formFilter.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  onSubmit() {
    let data = {
      dateInit: this.formFilter.controls['dateInit'].value,
      dateFinish: this.formFilter.controls['dateFinish'].value,
      company_id: (this.formFilter.controls['company_id']?.value === undefined || this.formFilter.controls['company_id']?.value === null) ? '' : this.formFilter.controls['company_id'].value,
      branch_id: (this.formFilter.controls['branch_id']?.value === undefined || this.formFilter.controls['branch_id']?.value === null) ? '' : this.formFilter.controls['branch_id'].value,
      state: (this.formFilter.controls['state']?.value === undefined || this.formFilter.controls['state']?.value === null) ? '' : this.formFilter.controls['state'].value,
      name: (this.formFilter.controls['name']?.value === undefined || this.formFilter.controls['name']?.value === null) ? '' : this.formFilter.controls['name'].value,
      email: (this.formFilter.controls['email']?.value === undefined || this.formFilter.controls['email']?.value === null) ? '' : this.formFilter.controls['email'].value,
    }
    this.filterDataEvent.emit(data);
  }

  public getBranchByCompany(id: any) {
    this.loadingBranch = true;
    this.branchService.getCompanyByBranch(id).subscribe(
      async response => {
        this.dataBranch = response;
        this.loadingBranch = false;
        this.formFilter.controls['branch_id'].enable();
      },
      error => {
        console.log(error.message);
        this.loadingBranch = true;
      }
    );
  }

  clearSelectionCompany(): void {
    this.formFilter.get('company_id')?.reset();
    this.formFilter.get('company_id')?.markAsTouched();
    this.formFilter.controls['branch_id'].disable();
    this.clearSelectionBranch();
    this.dataBranch = [];
  }

  clearSelectionBranch(): void {
    this.formFilter.get('branch_id')?.reset();
    this.formFilter.get('branch_id')?.markAsTouched();
  }

  clearForm() {
    this.formFilter.reset();
    this.formFilter.controls['state'].setValue(true);
    this.formFilter.controls['dateInit'].setValue(this.dateInitValue);
    this.formFilter.controls['dateFinish'].setValue(this.dateFinishValue);
    if (this.formFilter.get('branch_id')) {
      this.formFilter.controls['branch_id'].disable();
    }

    this.formFilter.markAllAsTouched();
    this.dataBranch = [];
  }

  getTextClass() {
    return this.formFilter.get('state')?.value ? 'text-success' : 'text-red';
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

}
