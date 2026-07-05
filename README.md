# Fútbol Manager MVP - V1.08

Proyecto estático para navegador listo para subir a **GitHub Pages**.

## Incluye
- HTML + CSS + JavaScript puro.
- Datos iniciales en `data/seed.json`.
- Guardado local con **IndexedDB**.
- Liga simple con 20 clubes y 600 jugadores.
- Simulación de jornadas y tablas.
- Plantel clickeable con filtros.
- Pantalla táctica con cancha visual y arrastre manual.
- Cambios automáticos.
- Presupuesto dinámico según resultados.
- Estado físico de los jugadores con impacto en rendimiento.
- Lesiones por probabilidad, cansancio acumulado y duración en turnos.

## Archivos principales
- `index.html`
- `style.css`
- `app.js`
- `data/seed.json`
- `assets/pitch-board.png`
- `img/`
- `VERSION.md`

## Cómo usarlo en GitHub Pages
1. Crear un repositorio nuevo.
2. Subir todo el contenido de esta carpeta a la raíz del repositorio.
3. Ir a **Settings > Pages**.
4. En **Source**, elegir la rama `main` y carpeta `/root`.
5. Guardar y abrir la URL publicada.

## Notas de esta versión
- Se agregó una tabla de lesiones con nombre, probabilidad y turnos fuera.
- La lesión se calcula al simular el partido.
- Cada jugador tiene 5% base de probabilidad de lesión.
- Por cada 5 puntos de cansancio acumulado, la probabilidad sube 1%.
- La lesión puede ocurrir durante el partido o al final.
- En pantalla principal se muestran jugadores lesionados, lesión y turnos restantes.
- En pantalla principal se muestra media general y estado físico general del plantel.

## Siguiente versión sugerida
V1.09 podría incluir:
- historial médico por jugador,
- recuperaciones parciales,
- cuerpo médico,
- entrenamiento preventivo,
- impacto de lesiones según posición.
