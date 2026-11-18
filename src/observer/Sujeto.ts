/** OBSERVER: quien quiera enterarse de un evento implementa esta interfaz. */
export interface Observador<E> {
    actualizar(evento: E): void;
}

/** SUBJECT genérico: gestiona suscriptores y los notifica. */
export class Sujeto<E> {
    private readonly observadores = new Set<Observador<E>>();

    public suscribir(o: Observador<E>): void { this.observadores.add(o); }
    public desuscribir(o: Observador<E>): void { this.observadores.delete(o); }

    protected notificar(evento: E): void {
        this.observadores.forEach(o => o.actualizar(evento));
    }
}
