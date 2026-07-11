# Revisión de código V6.01

Base revisada: `futbol-manager-mvp-V5.80-completa-correccion-slots-vacios(1).zip`.

## Resultado general

La estructura general del proyecto es consistente: HTML único, módulos JS cargados en orden, configuración central en `config.js`, modificadores separados en `balance-modificadores.js` y datos externos en `data/*.json`.

No se detectaron errores de sintaxis JavaScript ni errores de parseo JSON.

## Limpieza aplicada

Se eliminaron funciones declaradas que no tenían referencias internas detectables en el proyecto. La limpieza reduce ruido y evita mantener ramas antiguas de UI, mercado, scouting, simulación y utilidades que ya no participan del flujo actual.

Áreas limpiadas:

- Utilidades UI antiguas.
- Helpers de banners/resúmenes no utilizados.
- Helpers de requisitos de clubes reemplazados por flujos actuales.
- Helpers viejos de táctica por tabla.
- Helpers de mercado que ya no se muestran por interés oculto.
- Helpers de scouting no conectados a la UI vigente.
- Helpers de sponsors y ranking sin llamada activa.
- Helpers residuales del simulador vivo.

También se eliminó el archivo vacío `err`.

## Contradicciones detectadas

### Tarjetas del simulador

`config.js` definía:

- `simulador.multiplicadorTarjetas: 0.50`

Pero `balance-modificadores.js`, que se carga antes y pisa valores de `config.js`, definía:

- `simulador.multiplicadorTarjetas: 1.50`

Resultado real antes de esta revisión: el juego usaba `1.50`, no `0.50`.

En V6.01 queda definido en:

- `balance-modificadores.js`: `multiplicadorTarjetas: 1.10`

### Metadata de balance

La metadata de `balance-modificadores.js` seguía figurando como V5.47 aunque el archivo ya tenía ajustes posteriores. Se actualizó a V6.01.

## Rendimiento y optimización

### Punto más pesado

`data/jugadores.json` pesa aproximadamente 4.4 MB y contiene 4050 jugadores. Es correcto para el diseño actual, pero es el principal costo de carga inicial.

Recomendación futura:

- Dividir jugadores por país/liga.
- Cargar primero clubes/liga inicial y luego jugadores bajo demanda.
- Mantener jugadores libres o manuales en un archivo separado pequeño.

### Carga actual de ligas

El juego carga y combina todas las ligas configuradas. Es funcional, pero cuando siga creciendo conviene separar carga inicial de carga secundaria.

### Imágenes manuales faltantes

`data/jugadores_manuales.json` declara rutas en `img/jugadores/manual/`, pero esas imágenes no están incluidas. El código tiene fallback visual, por lo tanto no rompe la carga, pero no mostrará esas fotos específicas hasta agregarlas.

## Validaciones realizadas

- `node --check` en:
  - `app.js`
  - `balance-manager.js`
  - `balance-modificadores.js`
  - `config.js`
  - `simulador-2.0.js`
  - todos los archivos `js/**/*.js`
- Parseo de todos los JSON en `data/`.
- Revisión de referencias de imágenes en JSON.
- Revisión estática de funciones declaradas sin referencias internas.
- Carga secuencial de scripts en entorno de prueba con VM para verificar inicialización global.

## Pendientes sugeridos para próximas versiones

- Dividir `data/jugadores.json` para reducir carga inicial.
- Separar módulos críticos de módulos secundarios.
- Decidir si las fotos manuales de jugadores se incluirán en el ZIP o si deben quedar como personalización externa.
- Mantener el balance de tarjetas centralizado en un solo archivo para evitar nuevas contradicciones entre `config.js` y `balance-modificadores.js`.
