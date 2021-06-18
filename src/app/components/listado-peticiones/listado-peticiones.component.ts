import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cuenta, Transferencia, Usuario } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DetalleTransferenciaComponent } from '../detalle-transferencia/detalle-transferencia.component';

@Component({
  selector: 'app-listado-peticiones',
  templateUrl: './listado-peticiones.component.html',
  styleUrls: ['./listado-peticiones.component.scss']
})
export class ListadoPeticionesComponent implements OnInit {

  usuarioAutenticado: Usuario;
  cuentaActual: Cuenta;
  nombresDeColumnas: string[] = ['destinatario', 'descripcion', 'importe',  'fecha'];
  peticiones = {
    lista: [],
    totalPeticiones: 0
  }
  dataSourceTabla: MatTableDataSource<Transferencia>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filtros = [];

  constructor(
    private usuarioService: UsuarioService, 
    private router: Router,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
    private transferenciaService: TransferenciaService,
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
      this.actualizarHistorial(0, 10);
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
    document.querySelector('.mat-paginator-navigation-first').classList.add('mat-primary');
    document.querySelector('.mat-paginator-navigation-previous').classList.add('mat-primary');
    document.querySelector('.mat-paginator-navigation-next').classList.add('mat-primary');
    document.querySelector('.mat-paginator-navigation-last').classList.add('mat-primary');
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

  actualizarHistorial(pagina, elementosPorPagina, filtros = []) {
    this.comunicacionDeAlertasService.abrirDialogCargando();
    this.filtros = filtros;
    this.transferenciaService.getPeticionesCuentaPaginacion(this.cuentaActual.id, pagina, elementosPorPagina, this.filtros).subscribe(data => {
      this.comunicacionDeAlertasService.cerrarDialogo();
      if (data['result'] == 'ok') {
        this.peticiones.lista = data['peticiones'];
        this.peticiones.totalPeticiones = data['totalPeticiones'];
        if (this.peticiones.totalPeticiones != 0) {
          this.dataSourceTabla = new MatTableDataSource<Transferencia>(this.peticiones.lista);
          this.dataSourceTabla.sort = this.sort;
        }
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar las peticiones');
    });    
  }

  seleccionarTransferencia(transferencia: Transferencia) {
    const dialogRef = this.dialog.open(DetalleTransferenciaComponent, {
      width: '80%',
      height: '80%',
      data: transferencia,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.actualizarHistorial(0, 10);
    });
  }

  nuevaPeticion() {
    this.router.navigate(['/seleccion-movimiento'], { queryParams: { tipo: 'peticion' } });
  }

}
