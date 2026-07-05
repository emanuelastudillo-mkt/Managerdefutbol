# Fútbol Manager MVP - V1.02

Proyecto estático para navegador listo para subir a **GitHub Pages**.

## Incluye
- HTML + CSS + JavaScript puro.
- Datos iniciales en `data/seed.json`.
- Guardado local con **IndexedDB**.
- Liga simple con 20 clubes y 600 jugadores.
- Simulación de jornadas y tablas.
- Plantel clickeable.
- Pantalla táctica con cancha visual.
- Cambios automáticos.
- Presupuesto dinámico según resultados.

## Archivos principales
- `index.html`
- `style.css`
- `app.js`
- `data/seed.json`
- `assets/pitch-board.png`
- `VERSION.md`

## Cómo usarlo en GitHub Pages
1. Crear un repositorio nuevo.
2. Subir todo el contenido de esta carpeta a la raíz del repositorio.
3. Ir a **Settings > Pages**.
4. En **Source**, elegir la rama `main` y carpeta `/root`.
5. Guardar y abrir la URL publicada.

## Notas de esta versión
- La media visible del jugador usa sólo stats visibles.
- Las habilidades ocultas siguen existiendo internamente para la simulación, pero no se muestran.
- Los titulares se muestran sobre la cancha y su mentalidad se cambia haciendo clic sobre cada círculo.
- El presupuesto del club del usuario cambia después de cada partido.

## Siguiente versión sugerida
V1.03 podría incluir:
- sanciones por acumulación de amarillas,
- pantalla financiera ampliada,
- historial de presupuesto,
- más estadísticas por partido.
