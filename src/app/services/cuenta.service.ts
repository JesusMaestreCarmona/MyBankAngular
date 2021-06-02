import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuenta } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  cuentaActual: Cuenta; 
  @Output()  
  cambiosEnCuentaActual = new EventEmitter<Cuenta>();

  constructor(private http: HttpClient) { }

  getAllCuentasUsuario (): Observable<Cuenta> {
    return this.http.get<Cuenta>('/cuenta/all');
  }

  getCuentaUsuario (id: number): Observable<Cuenta> {
    return this.http.get<Cuenta>('/cuenta/findById?id=' + id);
  }

  buscarIban (iban: string): Observable<string> {
    return this.http.get<string>('/cuenta/buscarIban?iban=' + iban);
  }

  actualizarCuenta(idCuenta: number, descripcion: string, idDivisa: number) : Observable<string> {
    var jsonObject = {
      idCuenta: idCuenta,
      descripcion: descripcion,
      idDivisa: idDivisa  
    };
    return this.http.put<string>('/cuenta/actualizar', jsonObject);
  }

  crearCuenta(descripcion: string, idDivisa: number) : Observable<string> {
    var jsonObject = {
      descripcion: descripcion,
      idDivisa: idDivisa  
    };
    return this.http.put<string>('/cuenta/crear', jsonObject);
  }

  emitirNuevoCambioEnCuentaActual (cuenta: Cuenta) {
    this.cambiosEnCuentaActual.emit(cuenta);
  }

  almacenaCuentaActual (id: number) {
    localStorage.setItem("cuentaActual", '' + id);
  }

  recuperaCuentaActual () {
    return localStorage.getItem("cuentaActual");
  }

  eliminaCuentaActual () {
    localStorage.removeItem("cuentaActual");
  }

}
