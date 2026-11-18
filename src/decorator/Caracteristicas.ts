import { distribucionMacros } from '../dominio/Nutrientes.js';
import { CaracteristicaDecorator } from './DecoradorNutricional.js';
import { UMBRALES } from './umbrales.js';

export class AltaProteina extends CaracteristicaDecorator {
    protected cumpleCriterio(): boolean { return this.getNutrientes().proteinas >= UMBRALES.altaProteinaG; }
    protected getEtiqueta(): string { return 'Alta en proteína'; }
}
export class AltaFibra extends CaracteristicaDecorator {
    protected cumpleCriterio(): boolean { return this.getNutrientes().fibra >= UMBRALES.altaFibraG; }
    protected getEtiqueta(): string { return 'Alta en fibra'; }
}
export class AltaCalorias extends CaracteristicaDecorator {
    protected cumpleCriterio(): boolean { return this.getCalorias() >= UMBRALES.altaCaloriasKcal; }
    protected getEtiqueta(): string { return 'Alta en calorías'; }
}
export class BajaCalorias extends CaracteristicaDecorator {
    protected cumpleCriterio(): boolean { return this.getCalorias() <= UMBRALES.bajaCaloriasKcal; }
    protected getEtiqueta(): string { return 'Baja en calorías'; }
}
export class BajaGrasa extends CaracteristicaDecorator {
    protected cumpleCriterio(): boolean { return this.getNutrientes().grasas <= UMBRALES.bajaGrasaG; }
    protected getEtiqueta(): string { return 'Baja en grasa'; }
}
export class BajaCarbohidratos extends CaracteristicaDecorator {
    protected cumpleCriterio(): boolean { return this.getNutrientes().carbohidratos <= UMBRALES.bajaCarbohidratosG; }
    protected getEtiqueta(): string { return 'Baja en carbohidratos'; }
}
export class BajaSodio extends CaracteristicaDecorator {
    protected cumpleCriterio(): boolean { return this.getNutrientes().sodio <= UMBRALES.bajoSodioMg; }
    protected getEtiqueta(): string { return 'Baja en sodio'; }
}
export class Equilibrada extends CaracteristicaDecorator {
    protected cumpleCriterio(): boolean {
        const d = distribucionMacros(this.getNutrientes());
        const r = UMBRALES.equilibrada;
        const en = (v: number, x: { min: number; max: number }) => v >= x.min && v <= x.max;
        return en(d.proteinas, r.proteinas) && en(d.carbohidratos, r.carbohidratos) && en(d.grasas, r.grasas);
    }
    protected getEtiqueta(): string { return 'Equilibrada'; }
}
