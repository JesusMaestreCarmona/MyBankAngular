import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cuenta, Usuario } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/services/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { DialogTypes } from '../dialogo-general/dialog-data-type';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { MatDialog } from '@angular/material/dialog';
import { DetalleCuentaComponent } from '../detalle-cuenta/detalle-cuenta.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  usuarioAutenticado: Usuario;
  cuentaActual: Cuenta;
  cuentasDelUsuario: Cuenta[];
  totalPeticiones: number = 0;
  
  constructor(
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
    private autenticadorJWT: AutenticadorJwtService,
    private router: Router,
    private usuarioService: UsuarioService,
    private transferenciaService: TransferenciaService,
    private cuentaService: CuentaService,
    private dialog: MatDialog,
    public location: Location
  ) { }


  ngOnInit () {
    this.usuarioService.cambiosEnUsuarioAutenticado.subscribe(nuevoUsuarioAutenticado => {
      this.usuarioAutenticado = nuevoUsuarioAutenticado;
      if (this.usuarioAutenticado != null) {
        this.getAllCuentasUsuario()
      }  
    });
    this.cuentaService.cambiosEnCuentaActual.subscribe(nuevaCuentaActual => {
      this.cuentaActual = nuevaCuentaActual;
      if (this.cuentaActual != null) {
        this.transferenciaService.getCountPeticiones(this.cuentaActual.id).subscribe(data => {
          if (data['totalPeticiones'] != null) {
            this.totalPeticiones = data['totalPeticiones'];
          }
        });        
      }
      this.getAllCuentasUsuario()
    });
  }

  getAllCuentasUsuario() {
    this.cuentaService.getAllCuentasUsuario().subscribe(data => {
      if (data['result'] == 'ok') {
        let cuentas = data['cuentas'];
        if (cuentas.length) this.cuentasDelUsuario = cuentas;
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar las cuentas del usuario');
    });
  }

  abrirDetalleCuenta(cuenta: Cuenta) {
    this.dialog.open(DetalleCuentaComponent, {
      width: '80%',
      height: '80%',
      data: cuenta,
    });
  }

  navegarHaciaPrincipal() {
    if (this.usuarioAutenticado != null) this.router.navigate(['/listado-transferencias']);
    else this.location.back();
  }
  
  dialogoAbandonarSesion() {
    this.comunicacionDeAlertasService.abrirDialogConfirmacion ('¿Realmente desea abandonar la sesión?').subscribe(opcionElegida => {
      if (opcionElegida == DialogTypes.RESPUESTA_ACEPTAR) {
        this.autenticadorJWT.eliminaJWT();
        this.usuarioAutenticado = null;
        this.cuentaService.eliminaCuentaActual();
        this.cuentaActual = null;
        this.router.navigate(['/login']);
      }
    });
  }

  navegarAListadoDeTransferencias() {
    this.router.navigate(['/listado-transferencias']);
  }

  navegarAListadoDeMovimientos() {
    this.router.navigate(['/listado-movimientos']);
  }

  navegarAListadoPeticiones () {
    this.router.navigate(['/listado-peticiones']);
  }

  navegarASeleccionMovimiento () {
    this.router.navigate(['/seleccion-movimiento']);
  }

  navegarAMiCuenta() {
    this.router.navigate(['/modificar-datos']);
  }

}
