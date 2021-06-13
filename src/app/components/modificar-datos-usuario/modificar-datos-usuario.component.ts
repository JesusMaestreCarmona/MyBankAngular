import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-modificar-datos-usuario',
  templateUrl: './modificar-datos-usuario.component.html',
  styleUrls: ['./modificar-datos-usuario.component.scss']
})
export class ModificarDatosUsuarioComponent implements OnInit {

  usuarioAutenticado: Usuario;
  datosForm: FormGroup;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
    private cuentaService: CuentaService
  ) { }

  ngOnInit(): void {
    this.comunicacionDeAlertasService.abrirDialogCargando();
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuario => {
      if (usuario == null) {
        this.router.navigate(['/login']);
      }
      else {
        this.usuarioAutenticado = usuario;
        let idCuentaActual = this.cuentaService.recuperaCuentaActual();
        this.getCuenta(idCuentaActual != undefined ? parseInt(idCuentaActual) : -1);
        this.inicializarformulario();
        this.comunicacionDeAlertasService.cerrarDialogo();
      }
    });
    this.datosForm = new FormGroup({
      nombre: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      apellido1: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      apellido2: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      currentPassword: new FormControl ('', []),
      newPassword: new FormControl ('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      fecha_nac: new FormControl(''),
      telefono: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      direccion: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      localidad: new FormControl ('', [Validators.required, Validators.maxLength(50)]),
      codigo_postal: new FormControl ('', [Validators.maxLength(50)]),
      estado: new FormControl ('', [Validators.maxLength(50)])
    });
  }

  getCuenta(id: number) {
    this.cuentaService.getCuentaUsuario(id).subscribe(data => {
      if (data['result'] == 'ok') {
        let cuenta = data['cuenta'];
        if (cuenta != null) {
          this.cuentaService.emitirNuevoCambioEnCuentaActual(cuenta);
        }
      }
      else 
        this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al cargar la cuenta');
    });    
  }

  inicializarformulario() {
    this.datosForm.controls.nombre.setValue(this.usuarioAutenticado.nombre);
    this.datosForm.controls.apellido1.setValue(this.usuarioAutenticado.apellido1);
    this.datosForm.controls.apellido2.setValue(this.usuarioAutenticado.apellido2);
    this.datosForm.controls.fecha_nac.setValue(new Date(this.usuarioAutenticado.fecha_nac));
    this.datosForm.controls.telefono.setValue(this.usuarioAutenticado.telefono);
    this.datosForm.controls.direccion.setValue(this.usuarioAutenticado.direccion);
    this.datosForm.controls.localidad.setValue(this.usuarioAutenticado.localidad);
    this.datosForm.controls.codigo_postal.setValue(this.usuarioAutenticado.codigo_postal);
    this.datosForm.controls.estado.setValue(this.usuarioAutenticado.estado);

    this.datosForm.controls.currentPassword.setValidators([this.comprobarCurrentPassword(this.usuarioAutenticado.password)]);
    this.datosForm.controls.newPassword.disable();
    this.datosForm.controls.fecha_nac.disable();
  }

  comprobarCurrentPassword(currentPassword): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const md5 = new Md5();
      let error = null;
      if (control.value !== '') {
        error = md5.appendStr(control.value).end().toString() != currentPassword ? { errorCurrentPassword: true } : null;
        if (error == null) 
          this.datosForm.controls.newPassword.enable() 
        else {
          this.datosForm.controls.newPassword.disable();
          this.datosForm.controls.newPassword.setValue('');
        }
      }
      return error;
    };
  }    

  usuarioSeleccionaFicheroImagen() {
    const inputNode: any = document.querySelector('#file');
    const file = inputNode.files[0];
    const ext = file.name.split('.').pop().toLowerCase;

    let validExtension = (ext === 'jpg' || ext === 'jpeg' || ext === 'png') ? true : false;
    
    if (validExtension) { 
      const reader = new FileReader(); 

      reader.readAsArrayBuffer(file);

      reader.onload = (e: any) => {
        this.usuarioAutenticado.imagen = btoa(
          new Uint8Array(e.target.result)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      };
    }
    else {
      this.comunicacionDeAlertasService.abrirDialogError('El archivo seleccionado no es una imagen válida');
    }
  }

  actualizarDatosUsuario() {
    this.comunicacionDeAlertasService.abrirDialogCargando();
    this.usuarioService.actualizarDatosUsuario(
      this.usuarioAutenticado.imagen,
      this.datosForm.controls.nombre.value, 
      this.datosForm.controls.apellido1.value, 
      this.datosForm.controls.apellido2.value, 
      this.datosForm.controls.telefono.value, 
      this.datosForm.controls.direccion.value, 
      this.datosForm.controls.localidad.value, 
      this.datosForm.controls.codigo_postal.value, 
      this.datosForm.controls.estado.value, 
      this.datosForm.controls.newPassword.value, 
      ).subscribe(data => {
        this.comunicacionDeAlertasService.cerrarDialogo();
        if (data['result'] == 'ok')
          this.comunicacionDeAlertasService.abrirDialogInfo('Datos actualizados con éxito').subscribe(result => {
            this.router.navigate(['/listado-transferencias']);
          });
        else
          this.comunicacionDeAlertasService.abrirDialogError('Ha habido un problema al actualizar los datos del usuario');
      });
  }

}
