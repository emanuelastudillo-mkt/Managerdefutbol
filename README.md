# Fútbol Manager MVP - V1.04

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
- Caras automáticas por región/nacionalidad desde `img/faces/`.

## Carpetas de imágenes
El proyecto espera esta estructura:

```txt
img/
  escudos/
  faces/
  logos/
  principales/
```

Para las caras, usar archivos dentro de `img/faces/` con estos nombres:

```txt
africa (1) ... africa (10)
America (1) ... America (10)
Asia (1) ... Asia (10)
Europa (1) ... Europa (10)
Otros (1) ... Otros (20)
```

Extensiones soportadas automáticamente: `.png`, `.jpg`, `.jpeg`, `.webp`.

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
3. Cargar las imágenes en `img/faces/`.
4. Ir a **Settings > Pages**.
5. En **Source**, elegir la rama `main` y carpeta `/root`.
6. Guardar y abrir la URL publicada.

## Notas de esta versión
- Cada jugador recibe una cara fija, elegida de forma pseudoaleatoria según su nacionalidad y región.
- Las nacionalidades sudamericanas cargadas actualmente usan la región `America`.
- Si falta una imagen, se muestra el placeholder de jugador.
