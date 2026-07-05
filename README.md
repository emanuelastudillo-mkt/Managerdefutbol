# Fútbol Manager MVP

Proyecto estático listo para subir a GitHub Pages.

## Qué incluye

- 20 clubes ficticios.
- 600 jugadores iniciales, con 20 habilidades por jugador.
- 10 formaciones tácticas.
- 3 mentalidades por línea: ataque, posicional y defensiva.
- Botón para avanzar una fecha.
- Simulación local de todos los partidos de la jornada.
- Tabla de posiciones.
- Goleadores, asistidores y tarjetas.
- Guardado local con IndexedDB.

## Archivos

```txt
index.html
style.css
app.js
data/seed.json
```

## Cómo subirlo a GitHub Pages

1. Crear un repositorio nuevo.
2. Subir todos los archivos y carpetas respetando la estructura.
3. Entrar en Settings > Pages.
4. En Source elegir Deploy from branch.
5. Seleccionar la rama `main` y la carpeta raíz `/`.
6. Guardar.

## Nota técnica

Si abrís `index.html` directamente desde la computadora, algunos navegadores pueden bloquear la carga de `data/seed.json`. En GitHub Pages funciona correctamente porque se sirve por HTTP.

## Próximas mejoras sugeridas

- Lesiones y sanciones que afecten convocatorias.
- Evolución de jugadores por edad, minutos y potencial.
- Mercado de pases.
- Finanzas.
- Noticias y mensajes.
- Segunda liga o juveniles.
- Historial completo por temporada.
