import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosConJwt } from '../interfaces/interfaces'
import { Md5 } from 'ts-md5/dist/md5'; // Para codificar en MD5
import { Usuario } from '../interfaces/interfaces';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioAutenticado: Usuario; 
  @Output()  
  cambiosEnUsuarioAutenticado = new EventEmitter<Usuario>();

  constructor(private http: HttpClient) { }

  autenticarUsuario (email: string, password: string) : Observable<DatosConJwt> {
    const md5 = new Md5();
    var jsonObject = {
      email: email,
      password: md5.appendStr(password).end().toString()  
    };

    return this.http.post<DatosConJwt>('/usuario/autenticar', jsonObject);
  }

  getUsuarioAutenticado(incluirImagen: boolean = false): Observable<Usuario> {
    return this.http.get<Usuario>('/usuario/getAutenticado?imagen=' + incluirImagen).pipe(
      tap(usuarioAutenticado => {
        if ( (this.usuarioAutenticado == null && usuarioAutenticado != null) || 
          (this.usuarioAutenticado != null && usuarioAutenticado == null) ||  
          (this.usuarioAutenticado != null && usuarioAutenticado != null && this.usuarioAutenticado.id != usuarioAutenticado.id) ) { 
            this.emitirNuevoCambioEnUsuarioAutenticado();
            this.usuarioAutenticado = usuarioAutenticado;
          }
      })
    );
  }

  actualizarDatosUsuario(imagen: string, nombre: string, apellido1: string, apellido2: string, telefono: string, direccion: string, localidad: string, codigo_postal: string, estado: string, newPassword: string): Observable<string> {
    const md5 = new Md5();
    let password = newPassword != '' ? md5.appendStr(newPassword).end().toString() : '';
    var jsonObject = {
      'imagen': imagen,
      'nombre': nombre,
      'apellido1': apellido1,
      'apellido2': apellido2,
      'telefono': telefono,
      'direccion': direccion,
      'localidad': localidad,
      'codigo_postal': codigo_postal,
      'estado': estado,
      'password': password
    };
    return this.http.put<string>('/usuario/actualizarDatosUsuario', jsonObject).pipe(
      tap(data => {
        this.emitirNuevoCambioEnUsuarioAutenticado();
      })
    );
  }

  registrarUsuario(imagen: string, nombre: string, apellido1: string, apellido2: string, email: string, password: string, fecha_nac: Date, telefono: string, direccion: string, localidad: string, codigo_postal: string, estado: string): Observable<string> {
    const md5 = new Md5();
    console.log(fecha_nac);
    var jsonObject = {
      'imagen': imagen,
      'nombre': nombre,
      'apellido1': apellido1,
      'apellido2': apellido2,
      'email': email,
      'password': md5.appendStr(password).end().toString(),
      'fecha_nac': fecha_nac,
      'telefono': telefono,
      'direccion': direccion,
      'localidad': localidad,
      'codigo_postal': codigo_postal,
      'estado': estado
    };
    return this.http.put<string>('/usuario/registrarUsuario', jsonObject);
  }

  buscarEmail(email: string): Observable<string> {
    return this.http.get<string>('/usuario/buscarEmail?email=' + email);
  }

  emitirNuevoCambioEnUsuarioAutenticado () {
    this.getUsuarioAutenticado(true).subscribe(usuarioAutenticado => {
      this.cambiosEnUsuarioAutenticado.emit(usuarioAutenticado);
    });
  }

}
