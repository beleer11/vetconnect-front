import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class GenerateExcelService {

  constructor() { }

  generateExcelTemplate(component: string): void {
    let sheetName: any;
    let headers: any;
    let data: any[] = [];

    headers = this.getHeaders(component);

    sheetName = this.getSheetName(component);

    const worksheetData = [headers, ...data];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}_data_import.xlsx`);
  }

  getHeaders(component: string) {
    let header;
    if (component === 'customers') {
      header = ['Nombre', 'Dirección', 'Teléfono', 'Correo', 'Documento'];
    } else if (component === 'pet') {
      header = ['Nombre', 'Edad', 'Tipo de Mascota', 'Raza', 'Sexo', 'Descripción'];
    }
    return header;
  }

  getSheetName(component: string) {
    let sheetName
    if (component === 'customers') {
      sheetName = 'clientes';
    } else if (component === 'pet') {
      sheetName = 'mascotas';
    }
    return sheetName
  }
}
