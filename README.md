# Plataforma de seguimiento de alimentación (backend TypeScript)

```
npm install
npm run build
npm start        # ejecuta src/demo.ts compilado: muestra los 5 patrones
```

## Estructura
| Carpeta | Contenido |
|---|---|
| `src/dominio` | Nutrientes, tipos, errores y la interfaz común `ComponenteNutricional` |
| `src/composite` | `Alimento` (hoja), `ComponenteCompuesto` → `Platillo` / `Menu` (nodos) |
| `src/factory` | Factory Method: `CreadorAlimento` y `CreadorPlatillo` con sus creadores concretos |
| `src/decorator` | `DecoradorNutricional` → características nutricionales y preferencias |
| `src/strategy` | `CalculadoraIndicadores` (Context) + 5 estrategias |
| `src/observer` | `Sujeto<E>`, `DiarioAlimenticio` (sujeto concreto), observadores |
| `src/usuarios` | `Cuenta` (abstracta) → `UsuarioFinal` y `Administrador`, con permisos por rol |
| `docs/mmd`, `docs/png` | Diagramas de clases (Mermaid y PNG) |

## Siguiente paso (fuera de este avance)
Persistencia en SQL Server (los `id` y las interfaces `Datos*` ya están pensados para mapear a tablas), interfaz y diagrama de casos de uso.
