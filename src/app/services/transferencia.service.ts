import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  constructor(private http: HttpClient) { }

  getTransferenciasCuentaPaginacion(idCuenta: number, pagina: number, elementosPorPagina: number) : Observable<string> {
    return this.http.get<string>('/transferencia/getAllTransferenciasPaginacion?idCuenta=' + idCuenta + '&pagina=' + pagina + '&elementosPorPagina=' + elementosPorPagina);
  }

  getPeticionesCuentaPaginacion(idCuenta: number, pagina: number, elementosPorPagina: number) : Observable<string> {
    return this.http.get<string>('/transferencia/getAllPeticionesPaginacion?idCuenta=' + idCuenta + '&pagina=' + pagina + '&elementosPorPagina=' + elementosPorPagina);
  }

  getPeticionesANotificar(idCuenta: number) : Observable<string> {
    return this.http.get<string>('/transferencia/getPeticionesANotificar?idCuenta=' + idCuenta);
  }

  getCountPeticiones(idCuenta: number) : Observable<string> {
    return this.http.get<string>('/transferencia/getCountPeticiones?idCuenta=' + idCuenta);
  }

}
