import type { ComponenteNutricional } from '../dominio/ComponenteNutricional.js';
import { ErrorDominio } from '../dominio/ErrorDominio.js';
import type { DatosPlatillo, Platillo, TipoPlatillo } from '../composite/Platillo.js';
import { Bebida, Colacion, PlatoFuerte, Postre } from '../composite/TiposPlatillo.js';

/** CREATOR de platillos: el Factory Method decide la clase; construir() arma el Composite. */
export abstract class CreadorPlatillo {
    protected abstract crearPlatillo(datos: DatosPlatillo): Platillo;

    public construir(datos: DatosPlatillo, elementos: readonly ComponenteNutricional[]): Platillo {
        if (elementos.length === 0) {
            throw new ErrorDominio(`"${datos.nombre}" necesita al menos un ingrediente.`);
        }
        const platillo = this.crearPlatillo(datos);
        elementos.forEach(e => platillo.agregarElemento(e));
        return platillo;
    }
}

export class CreadorPlatoFuerte extends CreadorPlatillo {
    protected crearPlatillo(d: DatosPlatillo): Platillo { return new PlatoFuerte(d); }
}
export class CreadorBebida extends CreadorPlatillo {
    protected crearPlatillo(d: DatosPlatillo): Platillo { return new Bebida(d); }
}
export class CreadorColacion extends CreadorPlatillo {
    protected crearPlatillo(d: DatosPlatillo): Platillo { return new Colacion(d); }
}
export class CreadorPostre extends CreadorPlatillo {
    protected crearPlatillo(d: DatosPlatillo): Platillo { return new Postre(d); }
}

const CREADORES: Record<TipoPlatillo, CreadorPlatillo> = {
    PlatoFuerte: new CreadorPlatoFuerte(),
    Bebida: new CreadorBebida(),
    Colacion: new CreadorColacion(),
    Postre: new CreadorPostre()
};

export class FabricaPlatillos {
    public static obtenerCreador(tipo: TipoPlatillo): CreadorPlatillo {
        const creador = CREADORES[tipo];
        if (!creador) throw new ErrorDominio(`Tipo de platillo desconocido: ${tipo}.`);
        return creador;
    }

    public static crear(tipo: TipoPlatillo, datos: DatosPlatillo, elementos: readonly ComponenteNutricional[]): Platillo {
        return FabricaPlatillos.obtenerCreador(tipo).construir(datos, elementos);
    }
}
