/** Clave AAAA-MM-DD en hora local, útil para agrupar registros por día. */
export function claveDia(f: Date): string {
    const mes = String(f.getMonth() + 1).padStart(2, '0');
    const dia = String(f.getDate()).padStart(2, '0');
    return `${f.getFullYear()}-${mes}-${dia}`;
}
