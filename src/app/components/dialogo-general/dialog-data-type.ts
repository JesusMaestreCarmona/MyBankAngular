export interface DialogDataType {
    tipoDialogo: number,
    texto: string
}

export class DialogTypes {
    public static readonly ESPERANDO = 1;
    public static readonly ERROR = 2;
    public static readonly CONFIRMACION = 3;
    public static readonly INFORMACION = 4;

    public static readonly RESPUESTA_CANCELAR = 0;
    public static readonly RESPUESTA_ACEPTAR = 1;
}