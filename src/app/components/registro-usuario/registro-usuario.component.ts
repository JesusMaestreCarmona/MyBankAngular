import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Divisa } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/services/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { DivisaService } from 'src/app/services/divisa.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss']
})
export class RegistroUsuarioComponent implements OnInit {

  datosPrincipalesForm: FormGroup;
  datosSecundariosForm: FormGroup;
  datosCuentaForm: FormGroup;
  imagenActual: string;
  divisas: Divisa[];
  mostrarPassword: boolean = true;
  maxDate: Date;

  constructor(
    private usuarioService: UsuarioService,
    private cuentaService: CuentaService,
    private autenticadorJwtService: AutenticadorJwtService,
    private router: Router,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
    private divisaService: DivisaService
  ) { }

  ngOnInit(): void {
    this.divisaService.getAllDivisas().subscribe(data => {
      if (data['result'] == 'ok') { 
        this.divisas = data['divisas'];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const currentDay = new Date().getDate();
        this.maxDate = new Date(currentYear - 18, currentMonth, currentDay);    
        this.crearFormulariosReactivos();
      };
    });
  }

  crearFormulariosReactivos() {
    this.datosPrincipalesForm = new FormGroup({
      nombre: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      apellido1: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      apellido2: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      email: new FormControl ('', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)], [this.comprobarSiExisteEmail()]),
      password: new FormControl ('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      confirmPassword: new FormControl (''),
    });
    this.datosPrincipalesForm.controls.confirmPassword.setValidators([Validators.required, this.comprobarConfirmacionPassword()]);

    this.datosSecundariosForm = new FormGroup({
      fecha_nac: new FormControl ('', [Validators.required]),
      telefono: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      direccion: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      localidad: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      codigo_postal: new FormControl ('', [Validators.maxLength(50)]),
      estado: new FormControl ('', [Validators.maxLength(50)])
    });

    this.datosCuentaForm = new FormGroup({
      divisa: new FormControl ('', [Validators.required]),
      descripcion: new FormControl ('', [Validators.required, Validators.maxLength(200)])
    });
  }

  comprobarSiExisteEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.usuarioService.buscarEmail(control.value).pipe(
        map(data => {
          return (data['emailEncontrado'] == true)? { emailExiste: true } : null;
        })
      );
    };
  }

  comprobarConfirmacionPassword(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let error = null;
      if (control.value !== '') {
        error = control.value != this.datosPrincipalesForm.controls.password.value ? { errorConfirmacionPassword: true } : null;
      }
      return error;
    };
  }    

  registrarUsuario() {
    this.comunicacionDeAlertasService.abrirDialogCargando();
    this.usuarioService.registrarUsuario(
      this.imagenActual,
      this.datosPrincipalesForm.controls.nombre.value,
      this.datosPrincipalesForm.controls.apellido1.value,
      this.datosPrincipalesForm.controls.apellido2.value,
      this.datosPrincipalesForm.controls.email.value,
      this.datosPrincipalesForm.controls.password.value,
      this.datosSecundariosForm.controls.fecha_nac.value.getTime(),
      this.datosSecundariosForm.controls.telefono.value,
      this.datosSecundariosForm.controls.direccion.value,
      this.datosSecundariosForm.controls.localidad.value,
      this.datosSecundariosForm.controls.codigo_postal.value,
      this.datosSecundariosForm.controls.estado.value,
    ).subscribe(data => {
      this.comunicacionDeAlertasService.cerrarDialogo();
      if (data['result'] == 'ok') {
        this.usuarioService.autenticarUsuario(this.datosPrincipalesForm.controls.email.value, this.datosPrincipalesForm.controls.password.value).subscribe(data => {
          this.autenticadorJwtService.almacenaJWT(data.jwt); // Almaceno un nuevo JWT
          this.usuarioService.emitirNuevoCambioEnUsuarioAutenticado(); // Emito evento de cambio en usuario autenticado    
          this.creacionCuenta();
          this.comunicacionDeAlertasService.cerrarDialogo(); // Cierro el diálogo de espera
        });
      }
      else {
        this.comunicacionDeAlertasService.abrirDialogInfo('Ha habido un error durante el registro, será redirigido al login al cerrar esta ventana').subscribe(opcionElegida => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  creacionCuenta() {
    this.cuentaService.crearCuenta(this.datosCuentaForm.controls.descripcion.value, this.datosCuentaForm.controls.divisa.value).subscribe(data => {
      if (data['result'] == 'ok') {
        this.router.navigate(['/listado-transferencias']);
      }
      else {
        this.comunicacionDeAlertasService.abrirDialogInfo('Ha habido un error durante el registro, será redirigido al login al cerrar esta ventana').subscribe(opcionElegida => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  usuarioSeleccionaFicheroImagen() {
    const inputNode: any = document.querySelector('#file');
    const file = inputNode.files[0];
    const ext = file.name.split('.').pop().toLowerCase();

    let validExtension = (ext === 'jpg' || ext === 'jpeg' || ext === 'png') ? true : false;

    if (validExtension) { 
      const reader = new FileReader(); 

      reader.readAsArrayBuffer(file);

      reader.onload = (e: any) => {
        this.imagenActual = btoa(
          new Uint8Array(e.target.result)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      };
    }
    else {
      this.comunicacionDeAlertasService.abrirDialogError('El archivo seleccionado no es una imagen válida');
    }
  }

  volverALogin() {
    this.router.navigate(['/']);
  }

}
