import { ErrorDominio, ErrorPermiso } from '../dominio/ErrorDominio.js';

export type Rol = 'USUARIO' | 'ADMINISTRADOR';

export type Accion =
    | 'registrarConsumo' | 'configurarObjetivos' | 'verIndicadores' | 'armarMenu'
    | 'crearAlimento' | 'editarAlimento' | 'eliminarAlimento'
    | 'crearPlatillo' | 'editarPlatillo' | 'eliminarPlatillo';

/** Clase base de las cuentas. Cada rol define sus permisos (polimorfismo). */
export abstract class Cuenta {
    constructor(
        private readonly id: number,
        private readonly nombre: string,
        private readonly correo: string
    ) {
        if (!nombre.trim()) throw new ErrorDominio('La cuenta necesita un nombre.');
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) throw new ErrorDominio(`Correo inválido: ${correo}.`);
    }

    abstract getRol(): Rol;
    protected abstract accionesPermitidas(): readonly Accion[];

    public getId(): number { return this.id; }
    public getNombre(): string { return this.nombre; }
    public getCorreo(): string { return this.correo; }

    public puedeHacer(accion: Accion): boolean {
        return this.accionesPermitidas().includes(accion);
    }

    /** Lanza ErrorPermiso si el rol no puede realizar la acción. */
    public exigir(accion: Accion): void {
        if (!this.puedeHacer(accion)) {
            throw new ErrorPermiso(`El rol ${this.getRol()} no puede realizar la acción "${accion}".`);
        }
    }
}
