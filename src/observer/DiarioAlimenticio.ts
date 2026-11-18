import type { ComponenteNutricional } from '../dominio/ComponenteNutricional.js';
import { ErrorDominio } from '../dominio/ErrorDominio.js';
import { NUTRIENTES_VACIOS, escalarNutrientes, sumarNutrientes, type ClaveNutriente, type Nutrientes } from '../dominio/Nutrientes.js';
import { claveDia } from '../dominio/fechas.js';
import type { ObjetivoNutricional, PuntoSerie, RegistroConsumo, TipoComida } from '../dominio/tipos.js';
import { CalculadoraIndicadores } from '../strategy/Indicadores.js';
import { CumplimientoObjetivos } from '../strategy/Estrategias.js';
import { Sujeto } from './Sujeto.js';

export type TipoEvento =
    'REGISTRO_EXITOSO' | 'OBJETIVO_CERCA' | 'OBJETIVO_ALCANZADO' | 'OBJETIVO_EXCEDIDO' | 'REGISTRO_PENDIENTE';

export interface EventoDiario {
    readonly tipo: TipoEvento;
    readonly mensaje: string;
    readonly fecha: Date;
}

/** Hora límite (0-23) a partir de la cual una comida sin registrar se considera pendiente. */
const HORA_LIMITE: Readonly<Record<'Desayuno' | 'Comida' | 'Cena', number>> = { Desayuno: 10, Comida: 16, Cena: 22 };
const UMBRAL_CERCA = 85;

/** Sujeto observado: al cambiar su estado (nuevo registro, hora vencida) notifica a los observadores. */
export class DiarioAlimenticio extends Sujeto<EventoDiario> {
    private readonly registros: RegistroConsumo[] = [];
    private readonly objetivos = new Map<ClaveNutriente, ObjetivoNutricional>();
    private readonly avisados = new Set<string>();
    private readonly cumplimiento = new CalculadoraIndicadores(new CumplimientoObjetivos());

    constructor(private readonly propietario: string) { super(); }

    public getPropietario(): string { return this.propietario; }
    public getObjetivos(): readonly ObjetivoNutricional[] { return [...this.objetivos.values()]; }
    public getRegistros(): readonly RegistroConsumo[] { return [...this.registros]; }

    public configurarObjetivo(objetivo: ObjetivoNutricional): void {
        if (!(objetivo.meta > 0)) throw new ErrorDominio('La meta del objetivo debe ser mayor a 0.');
        this.objetivos.set(objetivo.clave, objetivo);
    }

    public registrar(componente: ComponenteNutricional, tipoComida: TipoComida, fecha = new Date(), porciones = 1): void {
        if (!(porciones > 0)) throw new ErrorDominio('Las porciones deben ser mayores a 0.');
        this.registros.push({ fecha, tipoComida, componente, porciones });
        this.emitir('REGISTRO_EXITOSO', `Registro guardado (${tipoComida}): ${componente.getNombre()}.`, fecha);
        this.evaluarObjetivos(fecha);
    }

    public consumoDelDia(fecha: Date): Nutrientes {
        const dia = claveDia(fecha);
        return this.registros
            .filter(r => claveDia(r.fecha) === dia)
            .reduce((t, r) => sumarNutrientes(t, escalarNutrientes(r.componente.getNutrientes(), r.porciones)), NUTRIENTES_VACIOS);
    }

    public serieDiaria(dias: number, hasta = new Date()): PuntoSerie[] {
        const serie: PuntoSerie[] = [];
        for (let i = dias - 1; i >= 0; i--) {
            const f = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate() - i);
            serie.push({ fecha: claveDia(f), calorias: Math.round(this.consumoDelDia(f).calorias) });
        }
        return serie;
    }

    /** Avisa de las comidas cuyo horario ya pasó sin registro. Devuelve las pendientes. */
    public verificarPendientes(ahora: Date): TipoComida[] {
        const dia = claveDia(ahora);
        const pendientes: TipoComida[] = [];
        for (const tipo of Object.keys(HORA_LIMITE) as Array<keyof typeof HORA_LIMITE>) {
            const registrada = this.registros.some(r => claveDia(r.fecha) === dia && r.tipoComida === tipo);
            if (ahora.getHours() >= HORA_LIMITE[tipo] && !registrada) {
                pendientes.push(tipo);
                this.emitir('REGISTRO_PENDIENTE', `Aún no registras tu ${tipo.toLowerCase()} de hoy.`, ahora, `${dia}-${tipo}`);
            }
        }
        return pendientes;
    }

    private evaluarObjetivos(fecha: Date): void {
        const objetivos = this.getObjetivos();
        if (objetivos.length === 0) return;
        const resultado = this.cumplimiento.calcular({ consumo: this.consumoDelDia(fecha), objetivos });
        const dia = claveDia(fecha);
        for (const o of objetivos) {
            const pct = resultado.detalle?.[o.clave] ?? 0;
            if (o.tipo === 'limite' && pct > 100) {
                this.emitir('OBJETIVO_EXCEDIDO', `Superaste tu límite de ${o.clave} (${pct}%).`, fecha, `${dia}-${o.clave}-exc`);
            } else if (o.tipo === 'limite' && pct >= UMBRAL_CERCA) {
                this.emitir('OBJETIVO_CERCA', `Vas en ${pct}% de tu límite de ${o.clave}.`, fecha, `${dia}-${o.clave}-cerca`);
            } else if (o.tipo === 'minimo' && pct >= 100) {
                this.emitir('OBJETIVO_ALCANZADO', `Alcanzaste tu meta de ${o.clave} (${pct}%).`, fecha, `${dia}-${o.clave}-ok`);
            }
        }
    }

    /** Notifica una sola vez por clave (evita repetir el mismo aviso el mismo día). */
    private emitir(tipo: TipoEvento, mensaje: string, fecha: Date, clave?: string): void {
        if (clave) {
            if (this.avisados.has(clave)) return;
            this.avisados.add(clave);
        }
        this.notificar({ tipo, mensaje, fecha });
    }
}
