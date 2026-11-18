import { PreferenciaDecorator } from './DecoradorNutricional.js';
import { UMBRALES } from './umbrales.js';

export class Vegana extends PreferenciaDecorator {
    protected cumpleCriterio(): boolean {
        return !(['carne', 'pescado', 'huevo', 'lactosa'] as const).some(c => this.componente.contiene(c));
    }
    protected getEtiqueta(): string { return 'Vegana'; }
}
export class Vegetariana extends PreferenciaDecorator {
    protected cumpleCriterio(): boolean {
        return !this.componente.contiene('carne') && !this.componente.contiene('pescado');
    }
    protected getEtiqueta(): string { return 'Vegetariana'; }
}
export class Pescetariana extends PreferenciaDecorator {
    protected cumpleCriterio(): boolean { return !this.componente.contiene('carne'); }
    protected getEtiqueta(): string { return 'Pescetariana'; }
}
export class SinGluten extends PreferenciaDecorator {
    protected cumpleCriterio(): boolean { return !this.componente.contiene('gluten'); }
    protected getEtiqueta(): string { return 'Sin gluten'; }
}
export class SinLactosa extends PreferenciaDecorator {
    protected cumpleCriterio(): boolean { return !this.componente.contiene('lactosa'); }
    protected getEtiqueta(): string { return 'Sin lactosa'; }
}
export class BajoConsumoCarne extends PreferenciaDecorator {
    protected cumpleCriterio(): boolean {
        return this.componente.proporcionDe('carne') <= UMBRALES.bajoConsumoCarne;
    }
    protected getEtiqueta(): string { return 'Bajo consumo de carne'; }
}
