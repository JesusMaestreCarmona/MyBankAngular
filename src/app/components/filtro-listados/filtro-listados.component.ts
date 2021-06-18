import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filtro-listados',
  templateUrl: './filtro-listados.component.html',
  styleUrls: ['./filtro-listados.component.scss']
})
export class FiltroListadosComponent implements OnInit {

  filterForm: FormGroup;
  tiposMovimiento: string[] = ['Solicitar dinero', 'Enviar dinero', 'Retirar dinero', 'Ingresar dinero'];
  @Output()
  ocultarFiltro = new EventEmitter<any>();
  @Output()
  filtrosSeleccionados = new EventEmitter<any[]>();
  filtros = [];
  deshabilitarBotonReiniciar: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      importe: new FormControl (null),
      fecha: new FormControl('')
    });
  }

  filtrar() {
    if (this.filterForm.controls.importe.value != '' && this.filterForm.controls.importe.value != null) this.filtros.push({ name: 'importe', value: '' + this.filterForm.controls.importe.value });
    if (this.filterForm.controls.fecha.value != '') this.filtros.push({ name: 'fecha', value: '' + this.filterForm.controls.fecha.value.getTime() });
    this.filtrosSeleccionados.emit(this.filtros);
    this.filtros = [];
    this.deshabilitarBotonReiniciar = false;
  }

  reiniciarFiltros() {
    this.filterForm.reset({ 'importe': null, 'fecha': '' });
    this.filtros = [];
    this.filtrosSeleccionados.emit(this.filtros);
    this.deshabilitarBotonReiniciar = true;
  }

  emitirOcultarFiltro() {
    this.ocultarFiltro.emit();
  }

}
