import { Component, Input } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrl: './import-excel.component.css'
})
export class ImportExcelComponent {
  @Input() component: string = '';
  @Input() title: string = '';


  public setDataImport() {

    console.log("Aca va lo de importar la data")
  }

  public downloadExcel() {
    console.log("Aca se va a consumir el servicio que va a ahacer brahiam")

  }

  closeModal() {
    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }
}
