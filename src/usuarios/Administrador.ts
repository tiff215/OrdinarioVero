import type { ComponenteNutricional } from '../dominio/ComponenteNutricional.js';
import type { Alimento, DatosAlimento } from '../composite/Alimento.js';
import type { DatosPlatillo, Platillo, TipoPlatillo } from '../composite/Platillo.js';
import { FabricaAlimentos, type TipoAlimento } from '../factory/CreadorAlimento.js';
import { FabricaPlatillos } from '../factory/CreadorPlatillo.js';
import { Cuenta, type Accion, type Rol } from './Cuenta.js';

const ACCIONES: readonly Accion[] = [
    'crearAlimento', 'editarAlimento', 'eliminarAlimento',
    'crearPlatillo', 'editarPlatillo', 'eliminarPlatillo'
];

/** Gestiona el catálogo de alimentos y platillos (usa los Factory Method). */
export class Administrador extends Cuenta {
    getRol(): Rol { return 'ADMINISTRADOR'; }
    protected accionesPermitidas(): readonly Accion[] { return ACCIONES; }

    public crearAlimento(tipo: TipoAlimento, datos: DatosAlimento): Alimento {
        this.exigir('crearAlimento');
        return FabricaAlimentos.crear(tipo, datos);
    }

    public crearPlatillo(tipo: TipoPlatillo, datos: DatosPlatillo, elementos: readonly ComponenteNutricional[]): Platillo {
        this.exigir('crearPlatillo');
        return FabricaPlatillos.crear(tipo, datos, elementos);
    }
}
