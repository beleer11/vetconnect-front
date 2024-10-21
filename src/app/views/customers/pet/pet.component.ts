import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../../services/general/general.service';
import moment from 'moment';
import { PetService } from '../../../services/customers/pet/pet.service';
import { TypePetService } from '../../../services/parameter/type-pet/type-pet.service';
import { TypeBreedService } from '../../../services/parameter/type-breed/type-breed.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-pet',
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css'
})
export class PetComponent {

  public loading: boolean = true;
  public showForm: boolean = false;
  public formPet!: FormGroup;
  public action: string = 'save';
  public viewTable: boolean = false;
  public parameterDefect = {};
  public totalRecord: number = 0;
  public dataPet: any = [{
    id: 1,
    name: "Pepe",
    pet_type_name: "Canino",
    type_breed_name: "Criollo",
    age: 2,
    image: "https://st4.depositphotos.com/27201292/41849/i/450/depositphotos_418498294-stock-photo-vertical-shot-white-dog-forest.jpg",
    sex: "Macho",
    description: "Esta algo feito pero no le falta amor",
    birth_date: "12 de febrero 2022",
    sterilized: "No",
    is_active: "Si",
    customer_name: "Antonio Ledezma Madas",
    company_name: "Animal House",
    branch_name: "Gigante Huila",
    phone: "00000000000",
    doc_vet_name: "Fabián Mauricio Quintero Trujillo",
    img_firma: "https://static.vecteezy.com/system/resources/previews/025/866/358/non_2x/fake-autograph-samples-hand-drawn-signatures-examples-of-documents-certificates-and-contracts-with-inked-and-handwritten-lettering-vector.jpg"
  }, {
    id: 2,
    name: "Bruno",
    pet_type_name: "Canino",
    type_breed_name: "Huzky",
    age: 2,
    image: "https://vignette.wikia.nocookie.net/reinoanimalia/images/a/a9/Husky_siberiano_20.png/revision/latest?cb=20150513044750&path-prefix=es",
    sex: "Macho",
    description: "Esta mamadisimoooo!!",
    birth_date: "12 de febrero 2022",
    sterilized: "No",
    is_active: "Si",
    customer_name: "Antonio Ledezma Madas",
    company_name: "Animal House",
    branch_name: "Centro Huila",
    phone: "00000000000",
    doc_vet_name: "Fabián Mauricio Quintero Trujillo",
    img_firma: "https://static.vecteezy.com/system/resources/previews/025/866/358/non_2x/fake-autograph-samples-hand-drawn-signatures-examples-of-documents-certificates-and-contracts-with-inked-and-handwritten-lettering-vector.jpg"
  },
  {
    id: 3,
    name: "Mike",
    pet_type_name: "Gato",
    type_breed_name: "Criollo",
    age: 1,
    image: "https://mh-1-cdn.panthermedia.net/media/previews/0028000000/28986000/~european-wildcat-walking-on-sunlit-meadow_28986644_high.jpg",
    sex: "Macho",
    description: "Esta algo feito pero no le falta amor",
    birth_date: "10 de diciembre 2023",
    sterilized: "No",
    is_active: "Si",
    customer_name: "Antonio Ledezma Madas",
    company_name: "Animal House",
    branch_name: "Centro Huila",
    phone: "00000000000",
    doc_vet_name: "Fabián Mauricio Quintero Trujillo",
    img_firma: "https://static.vecteezy.com/system/resources/previews/025/866/358/non_2x/fake-autograph-samples-hand-drawn-signatures-examples-of-documents-certificates-and-contracts-with-inked-and-handwritten-lettering-vector.jpg"
  },
  {
    id: 4,
    name: "Pimpinela",
    pet_type_name: "Canino",
    type_breed_name: "Criollo",
    age: 2,
    image: "https://t2.uc.ltmcdn.com/es/posts/1/6/3/cuanto_debe_pesar_un_perro_salchicha_30361_orig.jpg",
    sex: "Hembra",
    description: "Esta algo feita pero no le falta amor",
    birth_date: "12 de febrero 2022",
    sterilized: "No",
    is_active: "Si",
    customer_name: "Antonio Ledezma Madas",
    company_name: "Animal House",
    branch_name: "Centro Huila",
    phone: "00000000000",
    doc_vet_name: "Fabián Mauricio Quintero Trujillo",
    img_firma: "https://static.vecteezy.com/system/resources/previews/025/866/358/non_2x/fake-autograph-samples-hand-drawn-signatures-examples-of-documents-certificates-and-contracts-with-inked-and-handwritten-lettering-vector.jpg"
  }
    , {
    id: 5,
    name: "Ringo",
    pet_type_name: "Canino",
    type_breed_name: "retriever",
    age: 2,
    image: "https://mh-2-cdn.panthermedia.net/media/previews/0011000000/11466000/~perro-de-pura-raza-mirando-lejos_11466499_high.jpg",
    sex: "Macho",
    description: "Esta algo feito pero no le falta amor",
    birth_date: "12 de febrero 2022",
    sterilized: "No",
    is_active: "Si",
    customer_name: "Antonio Ledezma Madas",
    company_name: "Animal House",
    branch_name: "Centro Huila",
    phone: "00000000000",
    doc_vet_name: "Fabián Mauricio Quintero Trujillo",
    img_firma: "https://static.vecteezy.com/system/resources/previews/025/866/358/non_2x/fake-autograph-samples-hand-drawn-signatures-examples-of-documents-certificates-and-contracts-with-inked-and-handwritten-lettering-vector.jpg"
  },
  {
    id: 6,
    name: "Mike",
    pet_type_name: "Canino",
    type_breed_name: "Pinscher",
    age: 2,
    image: "https://mh-2-cdn.panthermedia.net/media/previews/0011000000/11600000/~correr-chihuahua_11600327_high.jpg",
    sex: "Macho",
    description: "Esta algo feito pero no le falta amor",
    birth_date: "12 de febrero 2022",
    sterilized: "No",
    is_active: "Si",
    customer_name: "Antonio Ledezma Madas",
    company_name: "Animal House",
    branch_name: "Centro Huila",
    phone: "00000000000",
    doc_vet_name: "Fabián Mauricio Quintero Trujillo",
    img_firma: "https://static.vecteezy.com/system/resources/previews/025/866/358/non_2x/fake-autograph-samples-hand-drawn-signatures-examples-of-documents-certificates-and-contracts-with-inked-and-handwritten-lettering-vector.jpg"
  },
  {
    id: 7,
    name: "Rocky",
    pet_type_name: "Canino",
    type_breed_name: "Collie",
    age: 2,
    image: "https://mh-1-cdn.panthermedia.net/media/previews/0011000000/11600000/~perro-de-pura-raza_11600275_high.jpg",
    sex: "Macho",
    description: "Esta algo feito pero no le falta amor",
    birth_date: "12 de febrero 2022",
    sterilized: "No",
    is_active: "Si",
    customer_name: "Antonio Ledezma Madas",
    company_name: "Animal House",
    branch_name: "Centro Huila",
    phone: "00000000000",
    doc_vet_name: "Fabián Mauricio Quintero Trujillo",
    img_firma: "https://static.vecteezy.com/system/resources/previews/025/866/358/non_2x/fake-autograph-samples-hand-drawn-signatures-examples-of-documents-certificates-and-contracts-with-inked-and-handwritten-lettering-vector.jpg"
  }];
  public dataTypePet: any = [];
  public dataTypeBreed: any = [];
  public dataPetTransform: any = [];
  public searchControl = new FormControl('');
  public selectedFile: any;
  public today = new Date();
  public year = this.today.getFullYear();
  public month = String(this.today.getMonth() + 1).padStart(2, '0');
  public day = String(this.today.getDate()).padStart(2, '0');
  public dateToday = `${this.year}-${this.month}-${this.day}`;
  public acciones: boolean = true;
  public loadingTable: boolean = false;
  public dataTemp: any = [];
  public btnExportDisable: boolean = true;

  constructor(
    private generalService: GeneralService,
    private petService: PetService,
    private typePetService: TypePetService,
    private typeBreedService: TypeBreedService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit(): Promise<void> {
    this.createForm();
  }

  public createForm() {
    this.formPet = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ]+(\\s[a-zA-ZáéíóúÁÉÍÓÚÑñ]+)*$')]],
      age: ['', [Validators.required, Validators.minLength(1)]],
      type_breed_id: ['', [Validators.required]],
      type_pet_id: ['', [Validators.required]],
      image_pet: [''],
      sex: ['male', [Validators.required]],
      description: [''],
      birthdate: [{ value: this.dateToday, disable: false }, [Validators.required]],
      is_active: [true, [Validators.required]],
      sterilized: [true, [Validators.required]],
    });
    this.loading = false;
    this.getTypePet();
  }

  private getTypePet() {
    this.typePetService.listTypePet().subscribe(
      (response: any) => {
        this.dataTypePet = response;
        this.getTypeBreed();
      }, (error: any) => {
        console.log("Error: ", error)
      });
  }

  private getTypeBreed() {
    this.typeBreedService.listTypeBreed().subscribe(
      (response: any) => {
        this.dataTypeBreed = response;
      }, (error: any) => {
        console.log("Error: ", error)
      });
  }

  private getData() {
    this.petService.getDataPet(this.parameterDefect).subscribe(
      response => {
        this.dataPet = response.data;
        this.totalRecord = response.total;
        this.dataPetTransform = this.formatedData(response.data);
        this.loading = false;
        this.viewTable = true;
        this.btnExportDisable = false;
      }, error => {
        this.generalService.alertMessage(
          '¡Ups! Algo salió mal',
          'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo o contacta a nuestro equipo de soporte si el problema persiste. ¡Estamos aquí para ayudarte!',
          'warning'
        );
        this.loading = false;
        this.viewTable = false;
      });
  }

  public formatedData(response: any) {
    if (response.length === 0) {
      return [{
        "No se encontraron resultados": "No se encontraron registros que coincidan con los criterios de búsqueda. Intente con otros términos.",
      }];
    }

    return response.map((item: any) => {
      return {
        "id": item.id,
        "is_disabled": item.is_disabled,
        "Nombre": item.name,
        "Télefono": item.Telefono,
        "Sucursal": item.branch_id,
        "Fecha creación": moment(item.created_at).format('DD/MM/YYYY hh:mm:ss A'),
        "Ultima actualización": moment(item.updated_at).format('DD/MM/YYYY hh:mm:ss A')
      };
    });
  }

  handleButtonClick(action: string) {
    switch (action) {
      case 'add':
        this.addCustomer();
        break;
      case 'import':
        this.importData();
        break;
      case 'export':
        this.exportData();
        break;
    }
  }

  public addCustomer() {
    this.showForm = true;
    this.formPet.reset();
    this.action = 'save';
  }

  public importData() {
    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  public exportData() {
    const modalElement = document.getElementById('exportModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  setFilter(event: any) {
    this.loading = true;
    this.viewTable = false;
    this.parameterDefect = {
      name: event.name,
      dateInit: event.dateInit,
      dateFinish: event.dateFinish,
      state: event.state,
      search: '',
      sortColumn: 'name',
      sortOrder: 'desc',
      page: 1,
      pageSize: 10
    }
    this.getData();
  }

  onSubmit() {
    if (this.formPet.valid) {
      let data = {
        name: this.formPet.get('name')?.value,
        pet_type_id: this.formPet.get('type_pet_id')?.value,
        type_breed_id: this.formPet.get('type_breed_id')?.value,
        age: this.formPet.get('age')?.value,
        photo: (this.selectedFile) ? this.selectedFile : null,
        sex: this.formPet.get('sex')?.value,
        description: this.formPet.get('description')?.value,
        birth_date: this.formPet.get('birthdate')?.value,
        sterilized: this.formPet.get('sterilized')?.value,
        is_active: this.formPet.get('is_active')?.value,
      };

      /* if (this.action === 'save') {
        this.saveNewRol(data);
      }

      if (this.action === 'edit') {
        this.editRol(data, this.dataTemp.id);
      } */
    }
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formPet.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);

    if (
      event.key === 'Backspace' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Delete'
    ) {
      return true;
    }

    if (!/^[0-9]+$/.test(char)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  clearSelectionTypePet(): void {
    this.formPet.get('type_pet_id')?.reset();
    this.formPet.get('type_pet_id')?.markAsTouched();
  }

  clearSelectionTypeBreed(): void {
    this.formPet.get('type_breed_id')?.reset();
    this.formPet.get('type_breed_id')?.markAsTouched();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = await this.generalService.convertToBase64Files(file);
    }
  }

  openInformation() {
    Swal.fire({
      title: 'Información Importante',
      html: `<div id="custom-icon-container"><p>Solo se permiten imágenes en formatos PNG, JPEG y JPG.</p></div>`,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      didOpen: () => {
        const iconPlaceholder = document.getElementById('icon-placeholder');
        const svgContainer = document.getElementById('svg-container');

        if (iconPlaceholder && svgContainer) {
          iconPlaceholder.innerHTML = svgContainer.innerHTML;
        }
      }
    });
  }

  getTextClass(type: number) {
    if (type == 1) {
      return this.formPet.get('is_active')?.value ? 'text-success' : 'text-red';
    } else {
      return this.formPet.get('sterilized')?.value ? 'text-success' : 'text-red';
    }
  }

  public getFieldsTable() {
    return ['Nombres'];
  }

  public getColumnAlignments() {
    return ['left'];
  }

  onFetchData(params: any): void {
    this.loadingTable = true;
    this.petService.getDataPet(params).subscribe((response) => {
      this.dataPetTransform = this.formatedData(response.data);
      this.dataPet = response.data;
      this.totalRecord = response.total;
      this.loadingTable = false;
    }, (error) => {
      this.loadingTable = false;
      console.error('Error fetching data', error);
    });
  }

  handleAction(event: { id: number, action: string }) {
    const { id, action } = event;
    this.action = action;
    this.dataTemp = this.dataPet.find((item: any) => item.id === id);

    if (action === "edit") {
      try {
        this.loading = true;
        this.resetForms();
        this.setDataForm();
      } catch (error) {
        console.error('Error en el flujo de edición:', error);
        this.loading = false;
      }
    }

    if (action === "delete") {
      //this.deleteRecord(id);
    }

    if (action === "view") {
      //this.openModalView(this.dataTemp);
    }

    if (action === "ban") {
      //this.disableOrEnableRecord(this.dataTemp);
    }
  }

  resetForms() {
    this.formPet.reset();
    this.formPet.untouched;
    this.selectedFile = '';
  }

  setDataForm() {

  }

  public backToTable() {
    this.showForm = false;
    this.resetForms();
  }

  changeFilter(event: any){
    this.viewTable = false;
    this.btnExportDisable = true;
  }
}
