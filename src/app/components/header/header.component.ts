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
  
  usuarioAutenticado: Usuario; // Guardo el usuario autenticado
  cuentaActual: Cuenta;
  cuentasDelUsuario: Cuenta[];
  totalPeticiones: number = 0;
  
  // Necesito varios objetos inyectados en este componente
  constructor(
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
    private autenticacionPorJWT: AutenticadorJwtService,
    private router: Router,
    private usuarioService: UsuarioService,
    private transferenciaService: TransferenciaService,
    private cuentaService: CuentaService,
    private dialog: MatDialog,
    private location: Location
  ) { }


  ngOnInit () {
    this.usuarioService.cambiosEnUsuarioAutenticado.subscribe(nuevoUsuarioAutenticado => {
      this.usuarioAutenticado = nuevoUsuarioAutenticado;
      if (this.usuarioAutenticado != null) {
        this.cuentaService.getAllCuentasUsuario().subscribe(data => {
          if (data['result'] == 'ok') {
            let cuentas = data['cuentas'];
            if (cuentas.length) this.cuentasDelUsuario = cuentas;
          }
          else 
            this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar la cuenta');
        });
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
      this.cuentaService.getAllCuentasUsuario().subscribe(data => {
        if (data['result'] == 'ok') {
          let cuentas = data['cuentas'];
          if (cuentas.length) this.cuentasDelUsuario = cuentas;
        }
        else 
          this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar la cuenta');
      });
    });
  }

  abrirDetalleCuenta(cuenta: Cuenta) {
    this.dialog.open(DetalleCuentaComponent, {
      width: '70%',
      height: '70%',
      data: cuenta,
    });
  }

  /**
   * El logo de la barra de herramientas nos llevará al listado de mensajes
   */
  navegarHaciaPrincipal() {
    if (this.usuarioAutenticado != null) this.router.navigate(['/portal']);
    else this.location.back();
  } 
  
  /**
   * Confirmación de que deseamos abandonar la sesión
   */
  dialogoAbandonarSesion() {
    this.comunicacionDeAlertasService.abrirDialogConfirmacion ('¿Realmente desea abandonar la sesión?').subscribe(opcionElegida => {
      if (opcionElegida == DialogTypes.RESPUESTA_ACEPTAR) {
        this.autenticacionPorJWT.eliminaJWT();
        this.usuarioAutenticado = null;
        this.cuentaService.eliminaCuentaActual();
        this.cuentaActual = null;
        this.router.navigate(['/login']);
      }
    });
  }

  navegarAHistorial() {
    this.router.navigate(['/portal']);
  }

  navegarASeleccionMovimiento () {
    this.router.navigate(['/seleccion-movimiento']);
  }

  navegarAListadoPeticiones () {
    this.router.navigate(['/listado-peticiones']);
  }

  navegarAMiCuenta() {
    this.router.navigate(['/modificar-datos']);
  }

}
