/** Error de regla de negocio (datos inválidos, criterio no cumplido, etc.). */
export class ErrorDominio extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = 'ErrorDominio';
    }
}

/** Garantiza que un dato opcional esté presente; si no, lanza un ErrorDominio. */
export function requerir<T>(valor: T | undefined, nombre: string): T {
    if (valor === undefined) {
        throw new ErrorDominio(`Falta el dato requerido: ${nombre}.`);
    }
    return valor;
}

/** El rol de la cuenta no tiene permiso para la acción solicitada. */
export class ErrorPermiso extends ErrorDominio {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = 'ErrorPermiso';
    }
}
