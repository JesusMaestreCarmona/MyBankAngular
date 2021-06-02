import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cuenta, Divisa, Usuario } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { DivisaService } from 'src/app/services/divisa.service';
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
  movimientoForm: FormGroup;
  tiposMovimiento: string[] = ['Solicitar dinero', 'Enviar dinero', 'Retirar dinero', 'Ingresar dinero'];
  divisas: Divisa[] = [];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private cuentaService: CuentaService,
    private transferenciaService: TransferenciaService,
    private divisaService: DivisaService,
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
      if (this.movimientoForm != undefined) this.crearFormularioReactivo();
    });
  }

  getCuenta(id: number) {
    this.cuentaService.getCuentaUsuario(id).subscribe(data => {
      if (data['result'] == 'ok') {
        let cuenta = data['cuenta'];
        if (cuenta != null) {
          this.cuentaActual = cuenta;
          this.cuentaService.emitirNuevoCambioEnCuentaActual(this.cuentaActual);
          this.obtenerDivisas();
        }
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar la cuenta');
    });    
  }

  obtenerDivisas() {
    this.divisaService.getAllDivisas().subscribe(data => {
      if (data['result'] == 'ok') { 
        this.divisas = data['divisas'];
        this.crearFormularioReactivo();
      };
    });
  }

  crearFormularioReactivo() {
    this.movimientoForm = new FormGroup({
      tipo: new FormControl ('Solicitar dinero', [Validators.required]),
      iban: new FormControl ('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/)]),
      descripcion: new FormControl ('', [Validators.required, Validators.maxLength(200)]),
      importe: new FormControl (0, [Validators.required, Validators.min(0)]),
      divisa: new FormControl (this.cuentaActual.divisa.descripcion, [Validators.required]),
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

}
