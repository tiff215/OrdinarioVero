import type { Nutrientes } from './Nutrientes.js';
import type { Contenido } from './tipos.js';
import type { Alimento } from '../composite/Alimento.js';

/**
 * Interfaz común de Composite y Decorator: tanto un alimento, como un platillo,
 * un menú o un platillo decorado se tratan de la misma forma (polimorfismo).
 */
export abstract class ComponenteNutricional {
    abstract getNombre(): string;
    abstract getNutrientes(): Nutrientes;
    /** Devuelve las hojas del árbol (los alimentos individuales). */
    abstract obtenerAlimentos(): readonly Alimento[];
    abstract getEtiquetas(): readonly string[];
    abstract mostrarInformacion(nivel?: number): void;

    public getCalorias(): number {
        return this.getNutrientes().calorias;
    }

    public getGramos(): number {
        return this.obtenerAlimentos().reduce((t, a) => t + a.getPorcionGramos(), 0);
    }

    public contiene(c: Contenido): boolean {
        return this.obtenerAlimentos().some(a => a.getContenido().includes(c));
    }

    /** Fracción (0-1) del peso total que corresponde a alimentos con ese contenido. */
    public proporcionDe(c: Contenido): number {
        const total = this.getGramos();
        if (total === 0) return 0;
        const gramos = this.obtenerAlimentos()
            .filter(a => a.getContenido().includes(c))
            .reduce((t, a) => t + a.getPorcionGramos(), 0);
        return gramos / total;
    }
}
