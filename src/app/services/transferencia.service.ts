import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  constructor(private http: HttpClient) { }

  getTransferenciasCuenta(idCuenta: number, pagina: number, elementosPorPagina: number) : Observable<string> {
    return this.http.get<string>('/transferencia/getAllRealizadas?idCuenta=' + idCuenta + '&pagina=' + pagina + '&elementosPorPagina=' + elementosPorPagina);
  }

  getPeticionesCuenta(idCuenta: number, pagina: number, elementosPorPagina: number) : Observable<string> {
    return this.http.get<string>('/transferencia/getAllPeticiones?idCuenta=' + idCuenta + '&pagina=' + pagina + '&elementosPorPagina=' + elementosPorPagina);
  }

  realizarTransferencia(idCuenta: number, iban: string, descripcion: string, importe: number) : Observable<string> {
    var jsonObject = {
      idCuenta: idCuenta,
      iban: iban,
      descripcion: descripcion,
      importe: importe  
    };
    return this.http.put<string>('/transferencia/realizarTransferencia', jsonObject);
  }

  realizarPeticion(idCuenta: number, iban: string, descripcion: string, importe: number) : Observable<string> {
    var jsonObject = {
      idCuenta: idCuenta,
      iban: iban,
      descripcion: descripcion,
      importe: importe  
    };
    return this.http.put<string>('/transferencia/realizarPeticion', jsonObject);
  }

  aceptarPeticion(idTransferencia: number) : Observable<string> {
    return this.http.get<string>('/transferencia/aceptarPeticion?idTransferencia=' + idTransferencia);
  }

  rechazarPeticion(idTransferencia: number) : Observable<string> {
    return this.http.delete<string>('/transferencia/rechazarPeticion?idTransferencia=' + idTransferencia);
  }

  getCountPeticiones(idCuenta: number) : Observable<string> {
    return this.http.get<string>('/transferencia/getCountPeticiones?idCuenta=' + idCuenta);
  }

  getCambioMoneda(divisa_origen: string, divisa_destino: string) : Observable<string> {
    return this.http.get<string>('/transferencia/getCambioMoneda?divisa_origen=' + divisa_origen + '&divisa_destino=' + divisa_destino);
  }

}
