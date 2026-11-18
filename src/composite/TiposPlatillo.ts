import { Platillo, type TipoPlatillo } from './Platillo.js';

export class PlatoFuerte extends Platillo {
    getTipo(): TipoPlatillo { return 'PlatoFuerte'; }
}
export class Bebida extends Platillo {
    getTipo(): TipoPlatillo { return 'Bebida'; }
}
export class Colacion extends Platillo {
    getTipo(): TipoPlatillo { return 'Colacion'; }
}
export class Postre extends Platillo {
    getTipo(): TipoPlatillo { return 'Postre'; }
}
