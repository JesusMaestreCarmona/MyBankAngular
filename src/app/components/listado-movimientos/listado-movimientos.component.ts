import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cuenta, Movimiento, Usuario } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-listado-movimientos',
  templateUrl: './listado-movimientos.component.html',
  styleUrls: ['./listado-movimientos.component.scss']
})
export class ListadoMovimientosComponent implements OnInit {

  usuarioAutenticado: Usuario;
  cuentaActual: Cuenta;
  nombresDeColumnas: string[] = ['tipo', 'importe',  'fecha', 'descripcion'];
  movimientos = {
    lista: [],
    totalMovimientos: 0
  }
  dataSourceTabla: MatTableDataSource<Movimiento>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService, 
    private router: Router,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
    private movimientoService: MovimientoService,
    private cuentaService: CuentaService,
    private paginatorIntl: MatPaginatorIntl,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioAutenticado(false).subscribe(usuario => {
      if (usuario == null) {
        this.router.navigate(['/login']);
      }
      else {
        this.usuarioAutenticado = usuario;
      }
    });
    this.cuentaService.cambiosEnCuentaActual.subscribe(nuevaCuentaActual => {
      this.cuentaActual = nuevaCuentaActual;
      this.actualizarHistorial(null);
    });
  }

  ngAfterViewInit() {
    let idCuentaActual = this.cuentaService.recuperaCuentaActual();
    this.getCuenta(idCuentaActual != undefined ? parseInt(idCuentaActual) : -1);
    this.configuraEtiquetasDelPaginador();
  }

  configuraEtiquetasDelPaginador() {
    this.paginatorIntl.nextPageLabel = "Siguiente";
    this.paginatorIntl.previousPageLabel = "Anterior";
    this.paginatorIntl.firstPageLabel = "Primera";
    this.paginatorIntl.lastPageLabel = "Última";
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
  }

  getCuenta(id: number) {
    this.comunicacionDeAlertasService.abrirDialogCargando();
    this.cuentaService.getCuentaUsuario(id).subscribe(data => {
      this.comunicacionDeAlertasService.cerrarDialogo();
      if (data['result'] == 'ok') {
        let cuenta = data['cuenta'];
        if (cuenta != null) {
          this.cuentaActual = cuenta;
          this.cuentaService.emitirNuevoCambioEnCuentaActual(this.cuentaActual);
        }
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar la cuenta');
    });    
  }

  actualizarHistorial(event) {
    this.comunicacionDeAlertasService.abrirDialogCargando();
    let pagina = event == null ? 0 : event.pageIndex;
    let elementosPorPagina = event == null ? 10 : event.pageSize;
    this.movimientoService.getMovimientosCuentaPaginacion(this.cuentaActual.id, pagina, elementosPorPagina).subscribe(data => {
      this.comunicacionDeAlertasService.cerrarDialogo();
      if (data['result'] == 'ok') {
        this.movimientos.lista = data['movimientos'];
        this.movimientos.totalMovimientos = data['totalMovimientos'];
        if (this.movimientos.totalMovimientos != 0) {
          this.dataSourceTabla = new MatTableDataSource<Movimiento>(this.movimientos.lista);
          this.dataSourceTabla.sort = this.sort;
        }
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar los movimientos');
    });    
  }

}
