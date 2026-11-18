import type { ComponenteNutricional } from '../dominio/ComponenteNutricional.js';
import type { ObjetivoNutricional, PerfilUsuario, TipoComida } from '../dominio/tipos.js';
import { Menu } from '../composite/Menu.js';
import type { Platillo } from '../composite/Platillo.js';
import { DiarioAlimenticio } from '../observer/DiarioAlimenticio.js';
import { Cuenta, type Accion, type Rol } from './Cuenta.js';

const ACCIONES: readonly Accion[] = ['registrarConsumo', 'configurarObjetivos', 'verIndicadores', 'armarMenu'];

/** Usuario que lleva su seguimiento: es dueño de su perfil y de su diario (Observer). */
export class UsuarioFinal extends Cuenta {
    private readonly diario: DiarioAlimenticio;

    constructor(id: number, nombre: string, correo: string, private perfil: PerfilUsuario) {
        super(id, nombre, correo);
        this.diario = new DiarioAlimenticio(nombre);
    }

    getRol(): Rol { return 'USUARIO'; }
    protected accionesPermitidas(): readonly Accion[] { return ACCIONES; }

    public getPerfil(): PerfilUsuario { return this.perfil; }
    public actualizarPerfil(perfil: PerfilUsuario): void { this.perfil = perfil; }
    public getDiario(): DiarioAlimenticio { return this.diario; }

    public registrarConsumo(componente: ComponenteNutricional, tipo: TipoComida, fecha = new Date(), porciones = 1): void {
        this.exigir('registrarConsumo');
        this.diario.registrar(componente, tipo, fecha, porciones);
    }

    public configurarObjetivo(objetivo: ObjetivoNutricional): void {
        this.exigir('configurarObjetivos');
        this.diario.configurarObjetivo(objetivo);
    }

    public armarMenu(nombre: string, fecha: Date, platillos: readonly Platillo[]): Menu {
        this.exigir('armarMenu');
        const menu = new Menu(nombre, fecha);
        platillos.forEach(p => menu.agregarElemento(p));
        return menu;
    }
}
