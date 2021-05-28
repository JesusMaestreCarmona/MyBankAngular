import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Transferencia, Usuario } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
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
    private transferenciaService: TransferenciaService,
    private router: Router,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService
  ) { }

  /**
   * 
   */
  ngOnInit() {
    this.usuarioService.getUsuarioAutenticado().subscribe(usuario => {
      this.usuarioAutenticado = usuario;
      this.transferenciaService.getCambioMoneda(this.transferencia.cuenta_origen.divisa.descripcion, this.transferencia.cuenta_destino.divisa.descripcion).subscribe(data => {
        if (data['result'] == 'ok') {
          this.importeCambioMoneda = parseFloat(data['cambioMoneda']) * this.transferencia.importe;
        }
        else 
          this.comunicacionDeAlertasService.abrirDialogInfo('Ha habido un problema al cargar el detalle').subscribe(() => {
            this.router.navigate(['/portal']);
          });
      });
    });
  }

  aceptarPeticion() {
    this.transferenciaService.aceptarPeticion(this.transferencia.id).subscribe(data => {
      if (data['result'] == 'ok') {
        this.comunicacionDeAlertasService.abrirDialogInfo('La petición se ha aceptado con éxito').subscribe(() => {
          this.router.navigate(['/portal']);
        });
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al tramitar la petición');
    });    
  }

  rechazarPeticion() {
    this.transferenciaService.rechazarPeticion(this.transferencia.id).subscribe(data => {
      if (data['result'] == 'ok') {
        this.comunicacionDeAlertasService.abrirDialogInfo('La petición se ha rechazado con éxito').subscribe(() => {
          this.router.navigate(['/portal']);
        });
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al rechazar la petición');
    });    
  }

  /**
   * 
   */
  cerrarDialogo() {
    this.dialogRef.close();
  }

}
