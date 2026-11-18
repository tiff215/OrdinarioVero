import type { DatosAlimento } from './composite/Alimento.js';
import { FabricaAlimentos } from './factory/CreadorAlimento.js';
import { FabricaPlatillos } from './factory/CreadorPlatillo.js';
import { Menu } from './composite/Menu.js';
import { AltaProteina, AltaFibra } from './decorator/Caracteristicas.js';
import { SinGluten, SinLactosa, Vegana, Vegetariana } from './decorator/Preferencias.js';
import { CalculadoraIndicadores } from './strategy/Indicadores.js';
import { CumplimientoObjetivos, DistribucionMacronutrientes, GastoEnergeticoDiario, IndiceMasaCorporal, TendenciaConsumo } from './strategy/Estrategias.js';
import { DiarioAlimenticio } from './observer/DiarioAlimenticio.js';
import { Cliente, HistorialNotificaciones } from './observer/Observadores.js';
import { ErrorDominio } from './dominio/ErrorDominio.js';
import type { PerfilUsuario } from './dominio/tipos.js';
import { Administrador } from './usuarios/Administrador.js';
import { UsuarioFinal } from './usuarios/UsuarioFinal.js';
import type { Cuenta } from './usuarios/Cuenta.js';

const titulo = (t: string) => console.log(`\n=== ${t} ===`);
const intentar = (descripcion: string, accion: () => void) => {
    try { accion(); } catch (e) {
        if (e instanceof ErrorDominio) console.log(`   [Error controlado] ${descripcion}: ${e.message}`);
        else throw e;
    }
};

// ── 1. FACTORY METHOD: alimentos y platillos ─────────────────────────────
titulo('1. Factory Method');
const alimento = (id: number, nombre: string, g: number, n: [number, number, number, number, number, number], contiene: DatosAlimento['contiene'] = []): DatosAlimento =>
    ({ id, nombre, porcionGramos: g, nutrientes: { calorias: n[0], proteinas: n[1], carbohidratos: n[2], grasas: n[3], fibra: n[4], sodio: n[5] }, contiene });

const pollo = FabricaAlimentos.crear('ProteinaAnimal', alimento(1, 'Pechuga de pollo', 150, [248, 46.5, 0, 5.4, 0, 111], ['carne']));
const arroz = FabricaAlimentos.crear('Carbohidratos', alimento(2, 'Arroz integral', 150, [185, 4, 38.4, 1.5, 3.5, 7]));
const brocoli = FabricaAlimentos.crear('VerdurasFrutas', alimento(3, 'Brócoli', 100, [35, 2.4, 7, 0.4, 3.3, 33]));
const aguacate = FabricaAlimentos.crear('VerdurasFrutas', alimento(4, 'Aguacate', 50, [80, 1, 4.3, 7.4, 3.4, 3]));
const frijoles = FabricaAlimentos.crear('ProteinaVegetal', alimento(5, 'Frijoles negros', 150, [197, 13.3, 35.5, 0.8, 11.2, 5]));
const avena = FabricaAlimentos.crear('Carbohidratos', alimento(6, 'Avena', 50, [195, 8.5, 33, 3.5, 5, 1], ['gluten']));
const leche = FabricaAlimentos.crear('ProteinaAnimal', alimento(7, 'Leche', 250, [152, 8, 12, 8, 0, 105], ['lactosa']));
const platano = FabricaAlimentos.crear('VerdurasFrutas', alimento(8, 'Plátano', 100, [89, 1.1, 23, 0.3, 2.6, 1]));
console.log(`   Creados con Factory: ${[pollo, arroz, brocoli, aguacate, frijoles, avena, leche, platano].map(a => `${a.getNombre()} [${a.getCategoria()}]`).join(', ')}`);
intentar('Proteína animal sin origen', () => FabricaAlimentos.crear('ProteinaAnimal', alimento(9, 'Misterio', 100, [100, 10, 0, 5, 0, 0])));
intentar('Proteína vegetal con carne', () => FabricaAlimentos.crear('ProteinaVegetal', alimento(10, 'Tofu de pollo', 100, [100, 10, 0, 5, 0, 0], ['carne'])));

// ── 2. COMPOSITE: platillos que contienen platillos que contienen alimentos ──
titulo('2. Composite');
const guarnicion = FabricaPlatillos.crear('PlatoFuerte', { id: 1, nombre: 'Guarnición de verduras', preparacion: 'Brócoli al vapor y aguacate en cubos.' }, [brocoli, aguacate]);
const bowlPollo = FabricaPlatillos.crear('PlatoFuerte', { id: 2, nombre: 'Bowl de pollo con arroz', preparacion: 'Pollo a la plancha sobre arroz integral.' }, [pollo, arroz, guarnicion]);
const bowlFrijol = FabricaPlatillos.crear('PlatoFuerte', { id: 3, nombre: 'Frijoles con arroz y aguacate', preparacion: 'Frijoles de la olla con arroz.' }, [frijoles, arroz, aguacate]);
const licuado = FabricaPlatillos.crear('Bebida', { id: 4, nombre: 'Licuado de avena y plátano', preparacion: 'Licuar todo con hielo.' }, [avena, leche, platano]);
const menu = new Menu('Menú del día', new Date(2026, 10, 16)).agregarElemento(licuado).agregarElemento(bowlPollo);
menu.mostrarInformacion();
intentar('Platillo sin ingredientes', () => FabricaPlatillos.crear('Postre', { id: 5, nombre: 'Vacío', preparacion: '-' }, []));

// ── 3. DECORATOR: características y preferencias ──────────────────────────
titulo('3. Decorator');
const bowlDecorado = new AltaProteina(new SinGluten(new SinLactosa(bowlPollo)));
bowlDecorado.mostrarInformacion();
console.log(`   Etiquetas: ${bowlDecorado.getEtiquetas().join(' | ')}`);
const frijolDecorado = new AltaFibra(new Vegana(bowlFrijol));
console.log(`   ${frijolDecorado.getNombre()}: ${frijolDecorado.getEtiquetas().join(' | ')}`);
intentar('Bowl de pollo como vegetariano', () => new Vegetariana(bowlPollo));
intentar('Licuado como sin lactosa', () => new SinLactosa(licuado));

// ── 4. STRATEGY: indicadores intercambiables ──────────────────────────────
titulo('4. Strategy');
const perfil: PerfilUsuario = { pesoKg: 68, tallaCm: 168, edad: 24, sexo: 'F', nivelActividad: 'moderado' };
const calculadora = new CalculadoraIndicadores(new IndiceMasaCorporal());
const imprimir = (r: ReturnType<CalculadoraIndicadores['calcular']>) =>
    console.log(`   ${r.indicador}: ${r.valor} ${r.unidad} · ${r.interpretacion}${r.detalle ? ' ' + JSON.stringify(r.detalle) : ''}`);
imprimir(calculadora.calcular({ perfil }));
calculadora.setEstrategia(new GastoEnergeticoDiario());
imprimir(calculadora.calcular({ perfil }));
calculadora.setEstrategia(new DistribucionMacronutrientes());
imprimir(calculadora.calcular({ consumo: bowlPollo.getNutrientes() }));
intentar('IMC sin perfil', () => { calculadora.setEstrategia(new IndiceMasaCorporal()); calculadora.calcular({}); });
console.log(`   ${calculadora.calcular({ perfil }).aviso}`);

// ── 5. OBSERVER: objetivos y registros pendientes ─────────────────────────
titulo('5. Observer');
const en = (dia: number, hora: number) => new Date(2026, 10, dia, hora, 0);
const diario = new DiarioAlimenticio('Valeria');
diario.configurarObjetivo({ clave: 'calorias', meta: 1500, tipo: 'limite' });
diario.configurarObjetivo({ clave: 'proteinas', meta: 85, tipo: 'minimo' });
// Historial de días anteriores (todavía sin observadores para no llenar la consola)
[[12, 0.6], [13, 0.8], [14, 1.0], [15, 1.3]].forEach(([dia, porc]) => {
    diario.registrar(bowlPollo, 'Comida', en(dia as number, 14), porc as number);
});
const cliente = new Cliente('Valeria');
const historial = new HistorialNotificaciones(['OBJETIVO_EXCEDIDO', 'OBJETIVO_ALCANZADO']);
diario.suscribir(cliente);
diario.suscribir(historial);

console.log('   08:00 → registro de desayuno');
diario.registrar(licuado, 'Desayuno', en(16, 8));
console.log('   11:00 → revisión de pendientes:', diario.verificarPendientes(en(16, 11)));
console.log('   17:00 → revisión de pendientes:', diario.verificarPendientes(en(16, 17)));
console.log('   17:30 → registro de comida');
diario.registrar(bowlPollo, 'Comida', en(16, 17));
console.log('   19:00 → registro de cena');
diario.registrar(bowlFrijol, 'Cena', en(16, 19));
console.log('   21:00 → segundo licuado');
diario.registrar(licuado, 'Colacion', en(16, 21));
diario.desuscribir(cliente);
console.log(`   Avisos importantes guardados: ${historial.getHistorial().length}`);

// ── Strategy sobre los datos del observer ─────────────────────────────────
titulo('Indicadores sobre el diario');
const hoy = en(16, 22);
calculadora.setEstrategia(new CumplimientoObjetivos());
imprimir(calculadora.calcular({ consumo: diario.consumoDelDia(hoy), objetivos: diario.getObjetivos() }));
calculadora.setEstrategia(new TendenciaConsumo());
imprimir(calculadora.calcular({ serieDiaria: diario.serieDiaria(5, hoy) }));

// ── 6. ROLES: usuario y administrador ─────────────────────────────────────
titulo('6. Roles');
const valeria = new UsuarioFinal(1, 'Valeria', 'valeria@correo.com', perfil);
const admin = new Administrador(2, 'Admin', 'admin@correo.com');
([valeria, admin] as Cuenta[]).forEach(c =>
    console.log(`   ${c.getNombre()} (${c.getRol()}) → crearAlimento: ${c.puedeHacer('crearAlimento')} | registrarConsumo: ${c.puedeHacer('registrarConsumo')}`));
intentar('Usuario creando un alimento', () => valeria.exigir('crearAlimento'));
intentar('Correo inválido', () => new Administrador(3, 'Sin correo', 'no-es-correo'));
const lentejas = admin.crearAlimento('ProteinaVegetal', alimento(11, 'Lentejas', 150, [174, 13.5, 30, 0.6, 12, 4]));
console.log(`   Administrador creó: ${lentejas.getNombre()} [${lentejas.getCategoria()}]`);
const plato = admin.crearPlatillo('PlatoFuerte', { id: 6, nombre: 'Lentejas con arroz', preparacion: 'Cocer las lentejas y servir con arroz.' }, [lentejas, arroz]);
const menuVale = valeria.armarMenu('Menú de Valeria', en(17, 0), [plato]);
valeria.configurarObjetivo({ clave: 'calorias', meta: 1800, tipo: 'limite' });
valeria.registrarConsumo(menuVale, 'Comida', en(17, 14));
console.log(`   Valeria registró "${menuVale.getNombre()}": ${Math.round(valeria.getDiario().consumoDelDia(en(17, 20)).calorias)} kcal hoy`);
