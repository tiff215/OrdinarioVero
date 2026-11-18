import type { ClaveNutriente } from './Nutrientes.js';
import type { ComponenteNutricional } from './ComponenteNutricional.js';

/** Sustancias que permiten validar preferencias (vegana, sin gluten, etc.). */
export type Contenido = 'gluten' | 'lactosa' | 'carne' | 'pescado' | 'huevo';

export type TipoComida = 'Desayuno' | 'Comida' | 'Cena' | 'Colacion';

export type NivelActividad = 'sedentario' | 'ligero' | 'moderado' | 'intenso';

export interface PerfilUsuario {
    readonly pesoKg: number;
    readonly tallaCm: number;
    readonly edad: number;
    readonly sexo: 'M' | 'F';
    readonly nivelActividad: NivelActividad;
}

/** limite: no debe superarse · minimo: debe alcanzarse. */
export interface ObjetivoNutricional {
    readonly clave: ClaveNutriente;
    readonly meta: number;
    readonly tipo: 'limite' | 'minimo';
}

export interface RegistroConsumo {
    readonly fecha: Date;
    readonly tipoComida: TipoComida;
    readonly componente: ComponenteNutricional;
    readonly porciones: number;
}

export interface PuntoSerie {
    readonly fecha: string;
    readonly calorias: number;
}

export const AVISO_INFORMATIVO =
    'Información orientativa; no sustituye la valoración de un nutriólogo.';
