import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Transferencia, Usuario } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { DivisaService } from 'src/app/services/divisa.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-detalle-transferencia',
  templateUrl: './detalle-transferencia.component.html',
  styleUrls: ['./detalle-transferencia.component.scss']
})
export class DetalleTransferenciaComponent implements OnInit {

  usuarioAutenticado: Usuario;
  importeCambioMoneda: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public transferencia: Transferencia,
    private dialogRef: MatDialogRef<DetalleTransferenciaComponent>,
    private usuarioService: UsuarioService,
    private router: Router,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
    private divisaService: DivisaService,
    private movimientoService: MovimientoService,
  ) { }

  ngOnInit() {
    this.usuarioService.getUsuarioAutenticado().subscribe(usuario => {
      this.usuarioAutenticado = usuario;
      this.divisaService.getCambioMoneda(this.transferencia.cuenta_destino.divisa.descripcion, this.transferencia.cuenta_origen.divisa.descripcion).subscribe(data => {
        if (data['result'] == 'ok') {
          this.importeCambioMoneda = parseFloat(data['cambioMoneda']) * this.transferencia.importe;
        }
        else 
          this.comunicacionDeAlertasService.abrirDialogInfo('Ha habido un problema al cargar el detalle').subscribe(() => {
            this.router.navigate(['/listado-transferencias']);
          });
      });
    });
  }

  aceptarPeticion() {
    this.movimientoService.realizarMovimiento(this.transferencia.id, 'Aceptar petición').subscribe(data => {
      if (data['result'] == 'ok') {
        this.comunicacionDeAlertasService.abrirDialogInfo('La petición se ha aceptado con éxito').subscribe(() => {
          this.router.navigate(['/listado-transferencias']);
        });
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al tramitar la petición');
    });    
  }

  rechazarPeticion() {
    this.movimientoService.realizarMovimiento(this.transferencia.id, 'Rechazar petición').subscribe(data => {
      if (data['result'] == 'ok') {
        this.comunicacionDeAlertasService.abrirDialogInfo('La petición se ha rechazado con éxito').subscribe(() => {
          this.router.navigate(['/listado-transferencias']);
        });
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al rechazar la petición');
    });    
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }

}
