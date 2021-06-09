import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DivisaService {

  constructor(private http: HttpClient) { }

  getAllDivisas() : Observable<string> {
    return this.http.get<string>('/divisa/all');
  }

  getCambioMoneda(divisa_origen: string, divisa_destino: string) : Observable<string> {
    return this.http.get<string>('/divisa/getCambioMoneda?divisa_origen=' + divisa_origen + '&divisa_destino=' + divisa_destino);
  }

}
