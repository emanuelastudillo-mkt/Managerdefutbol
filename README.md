# Fútbol Manager MVP - V1.13

Proyecto estático para navegador listo para subir a **GitHub Pages**.

## Actualización V1.13
- Se incorpora `data/Liga Argentina.json` como estructura principal de datos.
- El juego genera **3 divisiones** desde ese archivo:
  - Liga Profesional
  - Primera Nacional
  - Federal A
- Se toman los valores de **prestigio/reputation** del JSON para calcular:
  - media de jugadores
  - presupuesto inicial del club
  - estado del campo de juego
  - multiplicador económico por división
- Multiplicadores por división:
  - Liga Profesional: 100%
  - Primera Nacional: 30%
  - Federal A: 15%
- El nombre de escudo esperado sigue esta lógica:
  - `Boca Juniors` → `img/escudos/Boca_Juniors.png`
- La creación de jugadores fue ajustada por rol:
  - Porteros: edad promedio más alta y stats especiales.
  - Defensas: defensa como habilidad clave; ataque/cabezazo comunes; pase/velocidad raras.
  - Medios: pase como habilidad clave; defensa/ataque/tiro comunes; velocidad/cabezazo raras.
  - Delanteros: ataque como habilidad clave; tiro/cabezazo comunes; pase/velocidad/defensa raras.

## Archivos incluidos en este update
- `index.html`
- `app.js`
- `README.md`
- `VERSION.md`
- `data/Liga Argentina.json`

No se incluye `pitch-board.png`.

## Instalación
Subí estos archivos sobre tu repositorio actual, manteniendo las carpetas existentes.

El juego buscará primero:

```txt
data/Liga Argentina.json
```

Si ese archivo existe, se usará como fuente principal.
