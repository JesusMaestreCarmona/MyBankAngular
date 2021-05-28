import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AutenticadorJwtService {
  jwtPorSesion: string;

  constructor() { }

  almacenaJWT (token: string) {
    localStorage.setItem("jwt", token);
  }

  recuperaJWT (): string {
    return localStorage.getItem("jwt");
  }

  eliminaJWT () {
    localStorage.removeItem("jwt");
  }

}
