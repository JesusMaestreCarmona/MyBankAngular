import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  constructor(private http: HttpClient) { }

  realizarMovimiento(idCuenta: number, tipo: string, iban: string = '', descripcion: string = '', importe: number = 0): Observable<string> {
    var jsonObject = {
      'idCuenta': idCuenta,
      'tipo': tipo,
      'iban': iban,
      'descripcion': descripcion,
      'importe': importe  
    };
    return this.http.put<string>('/movimiento/realizar', jsonObject);
  }

  getMovimientosCuentaPaginacion(idCuenta: number, pagina: number, elementosPorPagina: number) : Observable<string> {
    return this.http.get<string>('/movimiento/getAllMovimientosPaginacion?idCuenta=' + idCuenta + '&pagina=' + pagina + '&elementosPorPagina=' + elementosPorPagina);
  }

}
