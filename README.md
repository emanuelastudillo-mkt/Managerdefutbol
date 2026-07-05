# Fútbol Manager MVP - V1.06

Proyecto estático para navegador listo para subir a **GitHub Pages**.

## Incluye
- HTML + CSS + JavaScript puro.
- Datos iniciales en `data/seed.json`.
- Guardado local con **IndexedDB**.
- Liga simple con 20 clubes y 600 jugadores.
- Simulación de jornadas y tablas.
- Plantel clickeable con filtros.
- Táctica con pizarra, arrastre manual y estado físico.
- Cambios automáticos.
- Presupuesto dinámico según resultados.
- Caras de jugadores desde `img/faces/` por región.
- Clubes clickeables con scouting parcial.

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
- El detalle de partido ahora muestra dos columnas de estadísticas, una por equipo.
- Se agregan datos provisorios del partido: clima, estado del campo, hinchas locales y visitantes.
- Los clubes son clickeables.
- La ficha de club muestra plantilla y táctica observada sin revelar titulares.
- El scouting de jugadores rivales revela sólo 2 o 3 habilidades visibles por jornada; las demás se muestran con guion.

## Siguiente versión sugerida
V2.0 podría incluir mercado de pases, entrenamientos, informes de scouting persistentes, staff técnico y objetivos de temporada.
