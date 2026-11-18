import { ErrorDominio } from '../dominio/ErrorDominio.js';
import { ComponenteCompuesto } from './ComponenteCompuesto.js';

/** Un menú es un compuesto de platillos (que a su vez son compuestos de alimentos). */
export class Menu extends ComponenteCompuesto {
    constructor(private readonly nombre: string, private readonly fecha: Date) {
        super();
        if (!nombre.trim()) throw new ErrorDominio('El menú necesita un nombre.');
    }

    public getNombre(): string { return this.nombre; }
    public getFecha(): Date { return this.fecha; }
    protected encabezado(): string { return `Menú: ${this.nombre}`; }
}
