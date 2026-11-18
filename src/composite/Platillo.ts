import { ErrorDominio } from '../dominio/ErrorDominio.js';
import { ComponenteCompuesto } from './ComponenteCompuesto.js';

export type TipoPlatillo = 'PlatoFuerte' | 'Bebida' | 'Colacion' | 'Postre';

export interface DatosPlatillo {
    readonly id: number;
    readonly nombre: string;
    readonly preparacion: string;
}

export abstract class Platillo extends ComponenteCompuesto {
    constructor(protected readonly datos: DatosPlatillo) {
        super();
        if (!datos.nombre.trim()) throw new ErrorDominio('El platillo necesita un nombre.');
    }

    abstract getTipo(): TipoPlatillo;

    public getId(): number { return this.datos.id; }
    public getNombre(): string { return this.datos.nombre; }
    public getPreparacion(): string { return this.datos.preparacion; }

    protected encabezado(): string { return `${this.getTipo()}: ${this.getNombre()}`; }
}
