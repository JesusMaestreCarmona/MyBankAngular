import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticadorJwtService } from 'src/app/services/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.scss']
})
export class LoginUsuarioComponent implements OnInit {

  loginForm: FormGroup;
  mostrarPassword: Boolean = true;

  constructor(
    private usuarioService: UsuarioService, 
    private comunicacionAlertasService: ComunicacionDeAlertasService, 
    private autenticadorJwtService: AutenticadorJwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioAutenticado(false).subscribe(usuario => {
      if (usuario != null) {
        this.router.navigate(['/listado-transferencias']);
      }
    });
    this.loginForm = new FormGroup({
      email: new FormControl ('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
      password: new FormControl ('', [Validators.required])
    });
  }

  autenticarUsuario() {
    this.comunicacionAlertasService.abrirDialogCargando();
    this.usuarioService.autenticarUsuario(this.loginForm.controls.email.value, this.loginForm.controls.password.value).subscribe(data => {
      if (data.jwt != undefined) {
        this.autenticadorJwtService.almacenaJWT(data.jwt);
        this.usuarioService.emitirNuevoCambioEnUsuarioAutenticado(); 
        this.comunicacionAlertasService.cerrarDialogo();
        this.router.navigate(['/listado-transferencias']);
      } 
      else {
        this.comunicacionAlertasService.abrirDialogError('El usuario y contraseña introducidos no permiten el acceso');
      }
    }); 
  }

  navegarARegistrarUsuario() {
    this.router.navigate(['/registro']);
  }

}
