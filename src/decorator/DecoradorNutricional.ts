import { ComponenteNutricional } from '../dominio/ComponenteNutricional.js';
import { ErrorDominio } from '../dominio/ErrorDominio.js';
import type { Nutrientes } from '../dominio/Nutrientes.js';
import type { Alimento } from '../composite/Alimento.js';

/**
 * DECORATOR base: es un ComponenteNutricional que envuelve a otro y le suma
 * una etiqueta. Solo se puede aplicar si el componente cumple el criterio.
 */
export abstract class DecoradorNutricional extends ComponenteNutricional {
    constructor(protected readonly componente: ComponenteNutricional) {
        super();
        if (!this.cumpleCriterio()) {
            throw new ErrorDominio(`"${componente.getNombre()}" no cumple el criterio "${this.getEtiqueta()}".`);
        }
    }

    protected abstract cumpleCriterio(): boolean;
    protected abstract getEtiqueta(): string;
    protected abstract getTipoDecorador(): string;

    // Todo lo demás se delega en el componente envuelto.
    public getNombre(): string { return this.componente.getNombre(); }
    public getNutrientes(): Nutrientes { return this.componente.getNutrientes(); }
    public obtenerAlimentos(): readonly Alimento[] { return this.componente.obtenerAlimentos(); }

    public getEtiquetas(): readonly string[] {
        return [...this.componente.getEtiquetas(), this.getEtiqueta()];
    }

    public mostrarInformacion(nivel = 0): void {
        this.componente.mostrarInformacion(nivel);
        console.log(`${'  '.repeat(nivel + 1)}+ ${this.getTipoDecorador()}: ${this.getEtiqueta()}`);
    }
}

/** Decoradores que agregan una característica nutricional. */
export abstract class CaracteristicaDecorator extends DecoradorNutricional {
    protected getTipoDecorador(): string { return 'Característica nutricional'; }
}

/** Decoradores que agregan una preferencia alimentaria. */
export abstract class PreferenciaDecorator extends DecoradorNutricional {
    protected getTipoDecorador(): string { return 'Preferencia alimentaria'; }
}
