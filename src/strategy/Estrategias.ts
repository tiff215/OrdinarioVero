import { ErrorDominio, requerir } from '../dominio/ErrorDominio.js';
import { distribucionMacros, redondear } from '../dominio/Nutrientes.js';
import type { NivelActividad } from '../dominio/tipos.js';
import type { ContextoIndicador, EstrategiaIndicador, ResultadoIndicador } from './Indicadores.js';

export class IndiceMasaCorporal implements EstrategiaIndicador {
    readonly nombre = 'Índice de masa corporal';

    calcular(ctx: ContextoIndicador): ResultadoIndicador {
        const p = requerir(ctx.perfil, 'perfil');
        if (!(p.pesoKg > 0 && p.tallaCm > 0)) throw new ErrorDominio('Peso y talla deben ser mayores a 0.');
        const imc = p.pesoKg / (p.tallaCm / 100) ** 2;
        const rango = imc < 18.5 ? 'por debajo del rango de referencia'
            : imc < 25 ? 'dentro del rango de referencia'
            : imc < 30 ? 'por encima del rango de referencia (sobrepeso)'
            : 'muy por encima del rango de referencia';
        return { indicador: this.nombre, valor: redondear(imc), unidad: 'kg/m²', interpretacion: `IMC ${rango} (OMS).` };
    }
}

const FACTOR_ACTIVIDAD: Record<NivelActividad, number> = {
    sedentario: 1.2, ligero: 1.375, moderado: 1.55, intenso: 1.725
};

/** Mifflin-St Jeor × factor de actividad. */
export class GastoEnergeticoDiario implements EstrategiaIndicador {
    readonly nombre = 'Gasto energético diario estimado';

    calcular(ctx: ContextoIndicador): ResultadoIndicador {
        const p = requerir(ctx.perfil, 'perfil');
        const tmb = 10 * p.pesoKg + 6.25 * p.tallaCm - 5 * p.edad + (p.sexo === 'M' ? 5 : -161);
        const get = tmb * FACTOR_ACTIVIDAD[p.nivelActividad];
        return {
            indicador: this.nombre, valor: Math.round(get), unidad: 'kcal/día',
            interpretacion: `Estimación con actividad ${p.nivelActividad}.`,
            detalle: { tmb: Math.round(tmb) }
        };
    }
}

export class DistribucionMacronutrientes implements EstrategiaIndicador {
    readonly nombre = 'Distribución de macronutrientes';

    calcular(ctx: ContextoIndicador): ResultadoIndicador {
        const c = requerir(ctx.consumo, 'consumo');
        const d = distribucionMacros(c);
        const fuera: string[] = [];
        if (d.proteinas < 10 || d.proteinas > 35) fuera.push('proteínas');
        if (d.carbohidratos < 45 || d.carbohidratos > 65) fuera.push('carbohidratos');
        if (d.grasas < 20 || d.grasas > 35) fuera.push('grasas');
        return {
            indicador: this.nombre, valor: Math.round(c.calorias), unidad: 'kcal',
            interpretacion: fuera.length ? `Fuera del rango de referencia: ${fuera.join(', ')}.` : 'Distribución dentro de los rangos de referencia.',
            detalle: { proteinasPct: redondear(d.proteinas), carbohidratosPct: redondear(d.carbohidratos), grasasPct: redondear(d.grasas) }
        };
    }
}

export class CumplimientoObjetivos implements EstrategiaIndicador {
    readonly nombre = 'Cumplimiento de objetivos';

    calcular(ctx: ContextoIndicador): ResultadoIndicador {
        const consumo = requerir(ctx.consumo, 'consumo');
        const objetivos = requerir(ctx.objetivos, 'objetivos');
        if (objetivos.length === 0) throw new ErrorDominio('No hay objetivos configurados.');
        const detalle: Record<string, number> = {};
        const alertas: string[] = [];
        for (const o of objetivos) {
            const pct = consumo[o.clave] / o.meta * 100;
            detalle[o.clave] = redondear(pct);
            if (o.tipo === 'limite' && pct > 100) alertas.push(`${o.clave} supera su límite`);
            if (o.tipo === 'minimo' && pct < 100) alertas.push(`${o.clave} aún no llega a su meta`);
        }
        const promedio = Object.values(detalle).reduce((t, v) => t + v, 0) / objetivos.length;
        return {
            indicador: this.nombre, valor: redondear(promedio), unidad: '% de avance promedio',
            interpretacion: alertas.length ? alertas.join('; ') + '.' : 'Todos los objetivos van en rango.',
            detalle
        };
    }
}

/** Pendiente (mínimos cuadrados) de las calorías diarias. */
export class TendenciaConsumo implements EstrategiaIndicador {
    readonly nombre = 'Tendencia de consumo calórico';

    calcular(ctx: ContextoIndicador): ResultadoIndicador {
        const serie = requerir(ctx.serieDiaria, 'serieDiaria');
        if (serie.length < 3) throw new ErrorDominio('Se necesitan al menos 3 días para calcular una tendencia.');
        const n = serie.length;
        const xs = serie.map((_, i) => i), ys = serie.map(p => p.calorias);
        const mx = xs.reduce((t, v) => t + v, 0) / n, my = ys.reduce((t, v) => t + v, 0) / n;
        const num = xs.reduce((t, x, i) => t + (x - mx) * ((ys[i] ?? 0) - my), 0);
        const den = xs.reduce((t, x) => t + (x - mx) ** 2, 0);
        const pendiente = num / den;
        const sentido = pendiente > 20 ? 'al alza' : pendiente < -20 ? 'a la baja' : 'estable';
        return {
            indicador: this.nombre, valor: redondear(pendiente), unidad: 'kcal/día por día',
            interpretacion: `El consumo calórico va ${sentido} en los últimos ${n} días.`,
            detalle: { promedio: Math.round(my) }
        };
    }
}
