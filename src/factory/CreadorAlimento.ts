import type { Alimento, DatosAlimento } from '../composite/Alimento.js';
import { Carbohidratos, ProteinaAnimal, ProteinaVegetal, VerdurasFrutas } from '../composite/CategoriasAlimento.js';
import { ErrorDominio } from '../dominio/ErrorDominio.js';
import type { Contenido } from '../dominio/tipos.js';

export type TipoAlimento = 'ProteinaAnimal' | 'ProteinaVegetal' | 'Carbohidratos' | 'VerdurasFrutas';

/** CREATOR: declara el Factory Method (crearAlimento) y el flujo común (construir). */
export abstract class CreadorAlimento {
    protected abstract crearAlimento(datos: DatosAlimento): Alimento;

    /** Hook: cada creador puede imponer reglas propias de su categoría. */
    protected validarDatos(_datos: DatosAlimento): void { /* sin reglas por defecto */ }

    public construir(datos: DatosAlimento): Alimento {
        this.validarDatos(datos);
        return this.crearAlimento(datos);
    }
}

const ORIGEN_ANIMAL: readonly Contenido[] = ['carne', 'pescado', 'huevo', 'lactosa'];

export class CreadorProteinaAnimal extends CreadorAlimento {
    protected override validarDatos(d: DatosAlimento): void {
        if (!d.contiene?.some(c => ORIGEN_ANIMAL.includes(c))) {
            throw new ErrorDominio(`"${d.nombre}": una proteína animal debe indicar su origen (carne, pescado, huevo o lactosa).`);
        }
    }
    protected crearAlimento(d: DatosAlimento): Alimento { return new ProteinaAnimal(d); }
}

export class CreadorProteinaVegetal extends CreadorAlimento {
    protected override validarDatos(d: DatosAlimento): void {
        if (d.contiene?.some(c => c === 'carne' || c === 'pescado')) {
            throw new ErrorDominio(`"${d.nombre}": una proteína vegetal no puede contener carne ni pescado.`);
        }
    }
    protected crearAlimento(d: DatosAlimento): Alimento { return new ProteinaVegetal(d); }
}

export class CreadorCarbohidratos extends CreadorAlimento {
    protected crearAlimento(d: DatosAlimento): Alimento { return new Carbohidratos(d); }
}

export class CreadorVerdurasFrutas extends CreadorAlimento {
    protected crearAlimento(d: DatosAlimento): Alimento { return new VerdurasFrutas(d); }
}

const CREADORES: Record<TipoAlimento, CreadorAlimento> = {
    ProteinaAnimal: new CreadorProteinaAnimal(),
    ProteinaVegetal: new CreadorProteinaVegetal(),
    Carbohidratos: new CreadorCarbohidratos(),
    VerdurasFrutas: new CreadorVerdurasFrutas()
};

/** Punto de acceso para quien solo conoce el tipo (p. ej. un registro leído de la BD). */
export class FabricaAlimentos {
    public static obtenerCreador(tipo: TipoAlimento): CreadorAlimento {
        const creador = CREADORES[tipo];
        if (!creador) throw new ErrorDominio(`Tipo de alimento desconocido: ${tipo}.`);
        return creador;
    }

    public static crear(tipo: TipoAlimento, datos: DatosAlimento): Alimento {
        return FabricaAlimentos.obtenerCreador(tipo).construir(datos);
    }
}
