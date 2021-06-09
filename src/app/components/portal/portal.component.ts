import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Cuenta, Transferencia, Usuario } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CuentaService } from 'src/app/services/cuenta.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { DetalleTransferenciaComponent } from '../detalle-transferencia/detalle-transferencia.component';
import { AutenticadorJwtService } from 'src/app/services/autenticador-jwt.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  usuarioAutenticado: Usuario;
  cuentaActual: Cuenta;
  nombresDeColumnas: string[] = ['destinatario', 'descripcion', 'importe',  'fecha'];
  transferencias = {
    lista: [],
    totalTransferencias: 0
  }
  dataSourceTabla: MatTableDataSource<Transferencia>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService, 
    private router: Router,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
    private transferenciaService: TransferenciaService,
    private cuentaService: CuentaService,
    private paginatorIntl: MatPaginatorIntl,
    private dialog: MatDialog,
    private autenticadorJWT: AutenticadorJwtService
  ) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioAutenticado(false).subscribe(usuario => {
      if (usuario == null) {
        this.router.navigate(['/login']);
      }
      else {
        this.usuarioAutenticado = usuario;
        let cuentaActual = this.cuentaService.recuperaCuentaActual();
        let idCuentaActual = (cuentaActual != undefined) ? parseInt(cuentaActual) : -1;
        this.getCuenta(idCuentaActual);
        this.configuraEtiquetasDelPaginador();    
      }
    });

    this.cuentaService.cambiosEnCuentaActual.subscribe(nuevaCuentaActual => {
      this.cuentaActual = nuevaCuentaActual;
      this.cuentaService.almacenaCuentaActual(this.cuentaActual.id);
      this.actualizarHistorial(null);
    });
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
    this.cuentaService.getCuentaUsuario(id).subscribe(data => {
      let error = false;
      if (data['result'] == 'ok') {
        let cuenta = data['cuenta'];
        if (cuenta != null) {
          this.cuentaActual = cuenta;
          this.cuentaService.emitirNuevoCambioEnCuentaActual(this.cuentaActual);
        }
        else error = true;
      }
      else error = true;
      if (error) {
        this.comunicacionDeAlertasService.abrirDialogInfo('Ha habido un problema al cargar la cuenta').subscribe(result => {
          this.autenticadorJWT.eliminaJWT();
          this.usuarioAutenticado = null;
          this.router.navigate(['/login']);
        });
      }
    });    
  }

  actualizarHistorial(event) {
    this.comunicacionDeAlertasService.abrirDialogCargando();
    let pagina = event == null ? 0 : event.pageIndex;
    let elementosPorPagina = event == null ? 10 : event.pageSize;
    this.transferenciaService.getTransferenciasCuentaPaginacion(this.cuentaActual.id, pagina, elementosPorPagina).subscribe(data => {
      this.comunicacionDeAlertasService.cerrarDialogo();
      if (data['result'] == 'ok') {
        this.transferencias.lista = data['transferencias'];
        this.transferencias.totalTransferencias = data['totalTransferencias'];
        if (this.transferencias.totalTransferencias != 0) {
          this.dataSourceTabla = new MatTableDataSource<Transferencia>(this.transferencias.lista);
          this.dataSourceTabla.sort = this.sort;
        }
        this.comprobarPeticionesANotificar();
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar las transferencias');
    });    
  }

  comprobarPeticionesANotificar() {
    this.transferenciaService.getPeticionesANotificar(this.cuentaActual.id).subscribe(data => {
      this.usuarioService.emitirNuevoCambioEnUsuarioAutenticado();
      let peticionesANotificar = data['peticiones'];
      let mensajesAMostrar = [];
      peticionesANotificar.forEach(peticion => {
        mensajesAMostrar.push(`Ha recibido una petición de ${peticion.cuenta_destino.titular.nombre} ${peticion.cuenta_destino.titular.apellido1} 
        ${peticion.cuenta_destino.titular.apellido2}`);
      });
      let accion = 'Listado peticiones';
      this.comunicacionDeAlertasService.mostrarMensajesSnackbar(mensajesAMostrar, accion, 3000);
    });
  }

  seleccionarTransferencia(transferencia: Transferencia) {
    const dialogRef = this.dialog.open(DetalleTransferenciaComponent, {
      width: '70%',
      height: '80%',
      data: transferencia,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.actualizarHistorial(null);
    });
  }

}
