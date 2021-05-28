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

}
