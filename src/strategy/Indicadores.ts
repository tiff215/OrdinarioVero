import { AVISO_INFORMATIVO, type ObjetivoNutricional, type PerfilUsuario, type PuntoSerie } from '../dominio/tipos.js';
import type { Nutrientes } from '../dominio/Nutrientes.js';

/** Datos que cada estrategia toma según lo que necesite. */
export interface ContextoIndicador {
    readonly perfil?: PerfilUsuario;
    readonly consumo?: Nutrientes;
    readonly objetivos?: readonly ObjetivoNutricional[];
    readonly serieDiaria?: readonly PuntoSerie[];
}

export interface ResultadoIndicador {
    readonly indicador: string;
    readonly valor: number;
    readonly unidad: string;
    readonly interpretacion: string;
    readonly detalle?: Readonly<Record<string, number>>;
    readonly aviso?: string;
}

/** STRATEGY: familia de algoritmos intercambiables para calcular indicadores. */
export interface EstrategiaIndicador {
    readonly nombre: string;
    calcular(contexto: ContextoIndicador): ResultadoIndicador;
}

/** CONTEXT: usa la estrategia vigente sin conocer su implementación. */
export class CalculadoraIndicadores {
    constructor(private estrategia: EstrategiaIndicador) {}

    public setEstrategia(estrategia: EstrategiaIndicador): void {
        this.estrategia = estrategia;
    }

    public calcular(contexto: ContextoIndicador): ResultadoIndicador {
        return { ...this.estrategia.calcular(contexto), aviso: AVISO_INFORMATIVO };
    }
}
