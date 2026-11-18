import { Alimento, type CategoriaAlimento } from './Alimento.js';

export class ProteinaAnimal extends Alimento {
    getCategoria(): CategoriaAlimento { return 'Proteína animal'; }
}
export class ProteinaVegetal extends Alimento {
    getCategoria(): CategoriaAlimento { return 'Proteína vegetal'; }
}
export class Carbohidratos extends Alimento {
    getCategoria(): CategoriaAlimento { return 'Carbohidratos'; }
}
export class VerdurasFrutas extends Alimento {
    getCategoria(): CategoriaAlimento { return 'Verduras y frutas'; }
}
