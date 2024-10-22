import { Component, Input } from '@angular/core';
import { GenerateExcelService } from 'src/app/services/generate-excel/generate-excel.service';
declare var bootstrap: any;

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent {

  @Input() component: string = '';
  @Input() title: string = '';

  public btnDisabled: boolean = false;

  constructor(private generateExcelService: GenerateExcelService) { }

  public setDataImport() {
    console.log("Aca va lo de importar la data");
  }

  public downloadExcel() {
    this.btnDisabled = true;
    this.generateExcelService.generateExcelTemplate(this.component);
    this.btnDisabled = false;
  }

  closeModal() {
    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }

}
