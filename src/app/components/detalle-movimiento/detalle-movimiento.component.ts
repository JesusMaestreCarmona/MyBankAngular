import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movimiento } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-detalle-movimiento',
  templateUrl: './detalle-movimiento.component.html',
  styleUrls: ['./detalle-movimiento.component.scss']
})
export class DetalleMovimientoComponent implements OnInit {

  idCuentaActual: number;
  cuentaForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public movimiento: Movimiento,
    private dialogRef: MatDialogRef<DetalleMovimientoComponent>,
  ) { }

  ngOnInit(): void {
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }  

}
