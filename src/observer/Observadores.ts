import type { EventoDiario, TipoEvento } from './DiarioAlimenticio.js';
import type { Observador } from './Sujeto.js';

/** Observador concreto: muestra los avisos al usuario (en la web sería una notificación). */
export class Cliente implements Observador<EventoDiario> {
    constructor(private readonly nombre: string) {}

    actualizar(evento: EventoDiario): void {
        console.log(`   [Aviso para ${this.nombre}] (${evento.tipo}) ${evento.mensaje}`);
    }
}

/** Observador concreto: guarda los avisos (por ejemplo, para persistirlos en la BD). */
export class HistorialNotificaciones implements Observador<EventoDiario> {
    private readonly eventos: EventoDiario[] = [];

    constructor(private readonly filtro?: readonly TipoEvento[]) {}

    actualizar(evento: EventoDiario): void {
        if (!this.filtro || this.filtro.includes(evento.tipo)) this.eventos.push(evento);
    }

    getHistorial(): readonly EventoDiario[] { return [...this.eventos]; }
}
