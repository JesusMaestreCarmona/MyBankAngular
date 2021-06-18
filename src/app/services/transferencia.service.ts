import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  constructor(private http: HttpClient) { }

  getTransferenciasCuentaPaginacion(idCuenta: number, pagina: number, elementosPorPagina: number, filtros: any[] = []) : Observable<string> {
    var jsonObject = {
      'idCuenta': idCuenta,
      'pagina': pagina,
      'elementosPorPagina': elementosPorPagina,
      'filtros': filtros
    };
    return this.http.post<string>('/transferencia/getAllTransferenciasPaginacion', jsonObject);
  }

  getPeticionesCuentaPaginacion(idCuenta: number, pagina: number, elementosPorPagina: number, filtros: any[] = []) : Observable<string> {
    var jsonObject = {
      'idCuenta': idCuenta,
      'pagina': pagina,
      'elementosPorPagina': elementosPorPagina,
      'filtros': filtros
    };
    return this.http.post<string>('/transferencia/getAllPeticionesPaginacion', jsonObject);
  }

  getPeticionesANotificar(idCuenta: number) : Observable<string> {
    return this.http.get<string>('/transferencia/getPeticionesANotificar?idCuenta=' + idCuenta);
  }

  getCountPeticiones(idCuenta: number) : Observable<string> {
    return this.http.get<string>('/transferencia/getCountPeticiones?idCuenta=' + idCuenta);
  }

}
