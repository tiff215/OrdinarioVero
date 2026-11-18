import { ErrorDominio } from './ErrorDominio.js';

/** Información nutricional de una porción (macros en g, sodio en mg). */
export interface Nutrientes {
    readonly calorias: number;
    readonly proteinas: number;
    readonly carbohidratos: number;
    readonly grasas: number;
    readonly fibra: number;
    readonly sodio: number;
}

export type ClaveNutriente = keyof Nutrientes;

export const NUTRIENTES_VACIOS: Nutrientes = Object.freeze({
    calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, sodio: 0
});

export function sumarNutrientes(a: Nutrientes, b: Nutrientes): Nutrientes {
    return {
        calorias: a.calorias + b.calorias,
        proteinas: a.proteinas + b.proteinas,
        carbohidratos: a.carbohidratos + b.carbohidratos,
        grasas: a.grasas + b.grasas,
        fibra: a.fibra + b.fibra,
        sodio: a.sodio + b.sodio
    };
}

export function escalarNutrientes(n: Nutrientes, factor: number): Nutrientes {
    return {
        calorias: n.calorias * factor,
        proteinas: n.proteinas * factor,
        carbohidratos: n.carbohidratos * factor,
        grasas: n.grasas * factor,
        fibra: n.fibra * factor,
        sodio: n.sodio * factor
    };
}

export function validarNutrientes(n: Nutrientes): void {
    for (const [clave, valor] of Object.entries(n)) {
        if (!Number.isFinite(valor) || valor < 0) {
            throw new ErrorDominio(`El valor de "${clave}" debe ser un número no negativo.`);
        }
    }
}

/** Porcentaje de energía aportado por cada macronutriente (4-4-9 kcal/g). */
export interface DistribucionMacros {
    readonly proteinas: number;
    readonly carbohidratos: number;
    readonly grasas: number;
}

export function distribucionMacros(n: Nutrientes): DistribucionMacros {
    const kp = n.proteinas * 4, kc = n.carbohidratos * 4, kg = n.grasas * 9;
    const total = kp + kc + kg;
    if (total === 0) return { proteinas: 0, carbohidratos: 0, grasas: 0 };
    return { proteinas: kp / total * 100, carbohidratos: kc / total * 100, grasas: kg / total * 100 };
}

export function redondear(valor: number, decimales = 1): number {
    const f = 10 ** decimales;
    return Math.round(valor * f) / f;
}
