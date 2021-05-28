import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cuenta, Usuario } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-seleccion-movimiento',
  templateUrl: './seleccion-movimiento.component.html',
  styleUrls: ['./seleccion-movimiento.component.scss']
})
export class SeleccionMovimientoComponent implements OnInit {

  usuarioAutenticado: Usuario;
  cuentaActual: Cuenta;
  solicitarDineroForm: FormGroup;
  enviarDineroForm: FormGroup;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private cuentaService: CuentaService,
    private transferenciaService: TransferenciaService,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService
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
      if (this.solicitarDineroForm != undefined) this.solicitarDineroForm.reset({});
      if (this.enviarDineroForm != undefined) this.enviarDineroForm.reset({});
    });
  }

  crearFormulariosReactivos() {
    this.solicitarDineroForm = new FormGroup({
      iban: new FormControl ('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/)], [this.comprobarSiExisteEmail()]),
      descripcion: new FormControl ('', [Validators.required, Validators.maxLength(200)]),
      importe: new FormControl ('', [Validators.required, Validators.min(0.01)])
    });

    this.enviarDineroForm = new FormGroup({
      iban: new FormControl ('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/)], [this.comprobarSiExisteEmail()]),
      descripcion: new FormControl ('', [Validators.required, Validators.maxLength(200)]),
      importe: new FormControl ('', [Validators.required, Validators.min(0.01), Validators.max(this.cuentaActual.saldo)])
    });
  }

  comprobarSiExisteEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.cuentaService.buscarIban(control.value).pipe(
        map(data => {
          return (data['ibanEncontrado'] == true)? null : { ibanEncontrado: true };
        })
      );
    };
  }

  getCuenta(id: number) {
    this.cuentaService.getCuentaUsuario(id).subscribe(data => {
      if (data['result'] == 'ok') {
        let cuenta = data['cuenta'];
        if (cuenta != null) {
          this.cuentaActual = cuenta;
          this.cuentaService.emitirNuevoCambioEnCuentaActual(this.cuentaActual);
          this.crearFormulariosReactivos();
        }
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar la cuenta');
    });    
  }

  solicitarDinero() {
    this.transferenciaService.realizarPeticion(
      this.cuentaActual.id,
      this.solicitarDineroForm.controls.iban.value,
      this.solicitarDineroForm.controls.descripcion.value,
      this.solicitarDineroForm.controls.importe.value
    ).subscribe(data => {
      if (data['result'] == 'ok') {
        this.comunicacionDeAlertasService.abrirDialogInfo('La petición se ha realizado con éxito').subscribe(() => {
          this.router.navigate(['/portal']);
        });
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al realizar la petición');
    });    
  }

  enviarDinero() {
    this.transferenciaService.realizarTransferencia(
      this.cuentaActual.id,
      this.enviarDineroForm.controls.iban.value,
      this.enviarDineroForm.controls.descripcion.value,
      this.enviarDineroForm.controls.importe.value
    ).subscribe(data => {
      if (data['result'] == 'ok') {
        this.comunicacionDeAlertasService.abrirDialogInfo('La transferencia se ha realizado con éxito').subscribe(() => {
          this.router.navigate(['/portal']);
        });
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al realizar la transferencia');
    });    
  }

}
