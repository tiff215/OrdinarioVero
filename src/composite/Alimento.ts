import { ComponenteNutricional } from '../dominio/ComponenteNutricional.js';
import { ErrorDominio } from '../dominio/ErrorDominio.js';
import { validarNutrientes, type Nutrientes } from '../dominio/Nutrientes.js';
import type { Contenido } from '../dominio/tipos.js';

export type CategoriaAlimento =
    'Proteína animal' | 'Proteína vegetal' | 'Carbohidratos' | 'Verduras y frutas';

export interface DatosAlimento {
    readonly id: number;
    readonly nombre: string;
    readonly porcionGramos: number;
    /** Valores nutricionales de la porción indicada (no por 100 g). */
    readonly nutrientes: Nutrientes;
    readonly contiene?: readonly Contenido[];
}

/** HOJA del Composite. Las categorías concretas las crea el Factory Method. */
export abstract class Alimento extends ComponenteNutricional {
    private readonly contenido: readonly Contenido[];

    constructor(protected readonly datos: DatosAlimento) {
        super();
        if (!datos.nombre.trim()) throw new ErrorDominio('El alimento necesita un nombre.');
        if (!(datos.porcionGramos > 0)) throw new ErrorDominio('La porción debe ser mayor a 0 g.');
        validarNutrientes(datos.nutrientes);
        this.contenido = [...(datos.contiene ?? [])];
    }

    abstract getCategoria(): CategoriaAlimento;

    public getId(): number { return this.datos.id; }
    public getNombre(): string { return this.datos.nombre; }
    public getPorcionGramos(): number { return this.datos.porcionGramos; }
    public getContenido(): readonly Contenido[] { return this.contenido; }
    public getNutrientes(): Nutrientes { return this.datos.nutrientes; }
    public obtenerAlimentos(): readonly Alimento[] { return [this]; }
    public getEtiquetas(): readonly string[] { return []; }

    public mostrarInformacion(nivel = 0): void {
        console.log(`${'  '.repeat(nivel)}- ${this.getNombre()} (${this.getCategoria()}): ` +
            `${this.getPorcionGramos()} g, ${this.getCalorias()} kcal`);
    }
}
