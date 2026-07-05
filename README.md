# Fútbol Manager MVP

Juego de fútbol tipo manager, 100% estático y ejecutado en navegador.

## Incluye

- 20 clubes ficticios.
- 600 jugadores iniciales desde `data/seed.json`.
- 20 habilidades base por jugador.
- Stats visibles resumidas: Ataque, Defensa, Pase, Velocidad, Cabezazo, Tiro y Resistencia.
- Stats ocultas de motor: Agresividad, Genética y Sorpresa.
- Pantalla de plantel con jugadores clickeables y rombo/radar de estadísticas.
- Pantalla de táctica para seleccionar 11 titulares y 10 suplentes.
- Configuración de hasta 5 cambios automáticos.
- Condiciones de cambio: quitar cansados, entrar ganando, entrar perdiendo o entrar empatando.
- Cambios automáticos al minuto 45 en un 10% de los casos; el resto entre 60 y 90.
- Simulación de todos los partidos de la jornada.
- Partidos clickeables con detalle: ataques, ocasiones, posesión, faltas, tarjetas, goles, cambios y lesiones.
- Tabla de posiciones.
- Goleadores, asistidores, tarjetas y lesiones.
- Lesiones y suspensiones.
- Bloqueo de 2 minutos antes de avanzar la siguiente fecha.
- Si el último partido propio tuvo lesionado o expulsado, obliga a revisar la táctica antes de avanzar.
- Guardado local con IndexedDB.

## Subir a GitHub Pages

1. Descomprimir el ZIP.
2. Subir todo el contenido a la raíz del repositorio.
3. Ir a `Settings > Pages`.
4. Elegir rama `main` y carpeta `/root`.
5. Abrir la URL publicada.

## Estructura

```txt
index.html
style.css
app.js
data/seed.json
README.md
```

## Desarrollo local

Por seguridad del navegador, conviene abrirlo con servidor local:

```bash
python -m http.server 8080
```

Luego entrar a:

```txt
http://localhost:8080
```

## Nota técnica

El bloqueo de avance se controla con la constante `ADVANCE_LOCK_MS` en `app.js`. Por defecto son 120000 milisegundos.
