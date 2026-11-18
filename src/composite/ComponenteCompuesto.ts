import { ComponenteNutricional } from '../dominio/ComponenteNutricional.js';
import { ErrorDominio } from '../dominio/ErrorDominio.js';
import { NUTRIENTES_VACIOS, sumarNutrientes, type Nutrientes } from '../dominio/Nutrientes.js';
import type { Alimento } from './Alimento.js';

/** NODO del Composite: contiene hojas u otros nodos y delega los cálculos en ellos. */
export abstract class ComponenteCompuesto extends ComponenteNutricional {
    private readonly elementos: ComponenteNutricional[] = [];

    protected abstract encabezado(): string;

    public agregarElemento(elemento: ComponenteNutricional): this {
        if (elemento === this) throw new ErrorDominio('Un componente no puede contenerse a sí mismo.');
        if (this.elementos.includes(elemento)) {
            throw new ErrorDominio(`"${elemento.getNombre()}" ya fue agregado.`);
        }
        this.elementos.push(elemento);
        return this;
    }

    public eliminarElemento(elemento: ComponenteNutricional): void {
        const i = this.elementos.indexOf(elemento);
        if (i < 0) throw new ErrorDominio(`"${elemento.getNombre()}" no está en "${this.getNombre()}".`);
        this.elementos.splice(i, 1);
    }

    public getElementos(): readonly ComponenteNutricional[] {
        return [...this.elementos];
    }

    public getNutrientes(): Nutrientes {
        return this.elementos.reduce((t, e) => sumarNutrientes(t, e.getNutrientes()), NUTRIENTES_VACIOS);
    }

    public obtenerAlimentos(): readonly Alimento[] {
        return this.elementos.flatMap(e => e.obtenerAlimentos());
    }

    public getEtiquetas(): readonly string[] { return []; }

    public mostrarInformacion(nivel = 0): void {
        console.log(`${'  '.repeat(nivel)}${this.encabezado()} [${Math.round(this.getCalorias())} kcal]`);
        this.elementos.forEach(e => e.mostrarInformacion(nivel + 1));
    }
}
