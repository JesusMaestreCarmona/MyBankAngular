import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cuenta, Divisa } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { DivisaService } from 'src/app/services/divisa.service';

@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.component.html',
  styleUrls: ['./detalle-cuenta.component.scss']
})
export class DetalleCuentaComponent implements OnInit {

  idCuentaActual: number;
  cuentaForm: FormGroup;
  divisas: Divisa[];
  saldoCambioMoneda: number;
  nuevaDivisa: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public cuenta: Cuenta,
    private dialogRef: MatDialogRef<DetalleCuentaComponent>,
    private cuentaService: CuentaService,
    private divisaService: DivisaService,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
  ) { }

  ngOnInit(): void {
    this.idCuentaActual = parseInt(this.cuentaService.recuperaCuentaActual());
    
    this.divisaService.getAllDivisas().subscribe(data => {
      if (data['result'] == 'ok') this.divisas = data['divisas'];
      else this.cerrarDialogo(); 
    });

    this.cuentaForm = new FormGroup({
      divisa: new FormControl (this.cuenta.divisa.id, []),
      descripcion: new FormControl (this.cuenta.descripcion, [Validators.maxLength(200)])
    });
  }

  seleccionarCuenta() {
    this.cuentaService.emitirNuevoCambioEnCuentaActual(this.cuenta);
    this.cuentaService.almacenaCuentaActual(this.cuenta.id);
    this.cerrarDialogo();
    this.comunicacionDeAlertasService.mostrarMensajesSnackbar(['Cuenta seleccionada con éxito'], '', 1000);
  }

  actualizarCuenta() {
    this.cuentaService.actualizarCuenta(
      this.cuenta.id,
      this.cuentaForm.controls.descripcion.value,
      this.cuentaForm.controls.divisa.value
    ).subscribe(data => {
      let mensaje = 'Ha habido un error al actualizar la cuenta'
      if (data['result'] == 'ok') { 
        mensaje = 'Cuenta actualizada con éxito';
        this.cuentaService.emitirNuevoCambioEnCuentaActual(data['cuentaActualizada']);
      }
      this.cerrarDialogo();
      this.comunicacionDeAlertasService.mostrarMensajesSnackbar([mensaje], '', 1000);
    });
  }

  seleccionarDivisa() {
    this.nuevaDivisa = this.divisas.filter(divisa => divisa.id == this.cuentaForm.controls.divisa.value)[0];
    this.divisaService.getCambioMoneda(this.cuenta.divisa.descripcion, this.nuevaDivisa['descripcion']).subscribe(data => {
      if (data['result'] == 'ok')
        this.saldoCambioMoneda = parseFloat(data['cambioMoneda']) * this.cuenta.saldo;
      else {
        this.cerrarDialogo();
        this.comunicacionDeAlertasService.mostrarMensajesSnackbar(['Ha habido un problema al cambiar de divisa'], '', 1000);
      }
    });
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }  

}
