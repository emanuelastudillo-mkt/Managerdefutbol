# Fútbol Manager MVP - V1.03

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
- Estado físico de los jugadores con impacto en el rendimiento.

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
- Las formaciones ahora se visualizan con una lógica de 5 secciones de campo más portero.
- Cada jugador tiene placeholder de foto en plantel y ficha.
- Se muestran iconos de nacionalidad y rol.
- Los titulares tienen un anillo de estado físico dividido en 8 tramos.
- El estado físico afecta el rendimiento de partido.
- Las tablas resaltan a tu club y a tus jugadores.

## Siguiente versión sugerida
V2.0 podría incluir:
- mercado de pases,
- entrenamientos y evolución,
- objetivos institucionales,
- interfaz financiera ampliada,
- más profundidad de calendario y temporada.
