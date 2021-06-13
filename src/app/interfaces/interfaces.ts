export interface Usuario {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
    password: string;
    rol_id: number;
    imagen: string;
    fecha_nac: Date;
    telefono: string;
    direccion: string;
    localidad: string;
    codigo_postal: string;
    estado: string;
}

export interface Movimiento {
    id: number;
    cuenta: Cuenta;
    tipo: string;
    fecha: string;
    importe: number;
    saldo: number;
    descripcion: string;
    estado: Boolean;
}

export interface Transferencia {
    id: number;
    cuenta_origen: Cuenta;
    cuenta_destino: Cuenta;
    importe: number;
    fecha: string;
    descripcion: string;
    estado: Boolean;
}

export interface Cuenta {
    id: number;
    iban: string;
    saldo: number;
    titular: Usuario;
    descripcion: string;
    divisa: Divisa;
}

export interface Divisa {
    id: number;
    descripcion: string;
}

export interface DatosConJwt {
    jwt: string;
}
