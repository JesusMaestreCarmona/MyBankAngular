import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogoGeneralComponent } from '../components/dialogo-general/dialogo-general.component';
import { DialogTypes } from '../components/dialogo-general/dialog-data-type';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class ComunicacionDeAlertasService {
  
  dialogConfig = new MatDialogConfig();
  posicionActualMensajesSnackbar: number = 0;

  constructor(private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
   }

  abrirDialogCargando() {
    this.cerrarDialogo();
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.ESPERANDO 
    };
    this.dialog.open(DialogoGeneralComponent, this.dialogConfig);
  }

  abrirDialogError(textoDeError: string) {
    this.cerrarDialogo();
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.ERROR,
      texto: textoDeError 
    };
    this.dialog.open(DialogoGeneralComponent, this.dialogConfig);
  }

  abrirDialogInfo(textoDeInfo: string): Observable<number> {
    this.cerrarDialogo();
    this.dialogConfig.data = {  
      tipoDialogo: DialogTypes.INFORMACION,
      texto: textoDeInfo
    };
    const dialogRef = this.dialog.open(DialogoGeneralComponent, this.dialogConfig);
    return dialogRef.afterClosed();
  }

  abrirDialogConfirmacion (textoDeConfirmacion: string): Observable<number> {
    this.cerrarDialogo();
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.CONFIRMACION,
      texto: textoDeConfirmacion
    };
    const dialogRef = this.dialog.open(DialogoGeneralComponent, this.dialogConfig);
    return dialogRef.afterClosed();
  }

  cerrarDialogo() {
    this.dialog.closeAll();
  }

  mostrarMensajesSnackbar(mensajesAMostrar: Array<string>, accion, duracion) {
    if (this.posicionActualMensajesSnackbar == mensajesAMostrar.length) {
      this.posicionActualMensajesSnackbar = 0;
      return;
    }
    let snackBarRef = this.snackBar.open(mensajesAMostrar[this.posicionActualMensajesSnackbar], accion, {
      duration: duracion
    }); 
    if (accion == 'Mis apuestas') {
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/misApuestas']);
      });
    }
    snackBarRef.afterDismissed().subscribe(() => {
      this.posicionActualMensajesSnackbar++;
      this.mostrarMensajesSnackbar(mensajesAMostrar, accion, duracion);
    }); 
  }

}
