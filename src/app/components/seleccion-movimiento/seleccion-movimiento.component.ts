import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cuenta, Divisa, Usuario } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/services/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-seleccion-movimiento',
  templateUrl: './seleccion-movimiento.component.html',
  styleUrls: ['./seleccion-movimiento.component.scss']
})
export class SeleccionMovimientoComponent implements OnInit {

  usuarioAutenticado: Usuario;
  cuentaActual: Cuenta;
  movimientoForm: FormGroup;
  tiposMovimiento: string[] = ['Solicitar dinero', 'Enviar dinero', 'Retirar dinero', 'Ingresar dinero'];
  movimientos = {
    lista: [],
    totalMovimientos: 0
  }

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private cuentaService: CuentaService,
    private movimientoService: MovimientoService,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
    private autenticadorJWT: AutenticadorJwtService
  ) { }

  ngOnInit(): void {
    this.comunicacionDeAlertasService.abrirDialogCargando();
    this.usuarioService.getUsuarioAutenticado(false).subscribe(usuario => {
      if (usuario == null) {
        this.router.navigate(['/login']);
      }
      else {
        this.usuarioAutenticado = usuario;
        let idCuentaActual = this.cuentaService.recuperaCuentaActual();
        this.getCuenta(idCuentaActual != undefined ? parseInt(idCuentaActual) : -1);
        this.comunicacionDeAlertasService.cerrarDialogo();
      }
    });
    this.cuentaService.cambiosEnCuentaActual.subscribe(nuevaCuentaActual => {
      this.cuentaActual = nuevaCuentaActual;
      if (this.movimientoForm != undefined) this.crearFormularioReactivo();
    });
  }

  getCuenta(id: number) {
    this.cuentaService.getCuentaUsuario(id).subscribe(data => {
      let error = false;
      if (data['result'] == 'ok') {
        let cuenta = data['cuenta'];
        if (cuenta != null) {
          this.cuentaActual = cuenta;
          this.cuentaService.emitirNuevoCambioEnCuentaActual(this.cuentaActual);
          this.crearFormularioReactivo();
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

  crearFormularioReactivo() {
    this.movimientoForm = new FormGroup({
      tipo: new FormControl ('', [Validators.required]),
      iban: new FormControl ('', [Validators.required, Validators.maxLength(50), Validators.pattern(/[a-zA-Z0-9]+/)], [this.comprobarSiExisteIban()]),
      descripcion: new FormControl ('', [Validators.required, Validators.maxLength(200)]),
      importe: new FormControl (0, [Validators.required, Validators.min(0.01)]),
    });
  }

  comprobarSiExisteIban(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.cuentaService.buscarIban(control.value).pipe(
        map(data => {
          return (data['ibanEncontrado'] == true)? null : { ibanNoEncontrado: true };
        })
      );
    };
  }

  realizarMovimiento() {
    this.movimientoService.realizarMovimiento(
      this.cuentaActual.id,
      this.movimientoForm.controls.tipo.value,
      this.movimientoForm.controls.iban.value,
      this.movimientoForm.controls.descripcion.value,
      this.movimientoForm.controls.importe.value,
    ).subscribe(data => {
      let mensaje = (data['result'] == 'ok') ? 'Movimiento realizado con éxito' : 'Ha habido un problema al realizar el movimiento'
      this.comunicacionDeAlertasService.abrirDialogInfo(mensaje).subscribe(result => {
        this.router.navigate(['/listado-transferencias']);
      });
    });
  }

  comprobarTipoMovimiento() {
    let importeValidators = [Validators.required, Validators.min(0)];
    if (this.movimientoForm.controls.tipo.value === 'Enviar dinero' || this.movimientoForm.controls.tipo.value === 'Retirar dinero') {
      importeValidators.push(Validators.max(this.cuentaActual.saldo));
    }
    if (this.movimientoForm.controls.tipo.value !== 'Enviar dinero' && this.movimientoForm.controls.tipo.value !== 'Solicitar dinero') {
      this.movimientoForm.controls.iban.setErrors(null);
    }
    this.movimientoForm.controls.importe.setValidators(importeValidators);
    this.movimientoForm.controls.importe.updateValueAndValidity();
  }

}
