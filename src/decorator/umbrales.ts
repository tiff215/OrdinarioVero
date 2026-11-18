/** Umbrales orientativos por porción/platillo (ajustables; no son indicaciones médicas). */
export const UMBRALES = Object.freeze({
    altaProteinaG: 20,
    altaFibraG: 6,
    bajaCaloriasKcal: 300,
    altaCaloriasKcal: 600,
    bajaGrasaG: 10,
    bajaCarbohidratosG: 20,
    bajoSodioMg: 400,
    bajoConsumoCarne: 0.25,
    /** Rangos de % de energía (referencia AMDR). */
    equilibrada: Object.freeze({
        proteinas: { min: 10, max: 35 },
        carbohidratos: { min: 45, max: 65 },
        grasas: { min: 20, max: 35 }
    })
});
