# V9.30 · Ser jugador compacto y mercado dinámico

Base: V9.29.

- Se rediseñó «Ser jugador» como una ficha compacta de una sola pantalla, inspirada en una carrera lineal.
- La parte izquierda concentra media, jugador, club, edad, valor, sueldo, estadísticas, estado y palmarés.
- La parte derecha muestra la carrera temporada por temporada con edad, club, media, partidos, goles y asistencias.
- «Avanzar temporada» simula de una sola vez todos los bloques restantes de la campaña.
- Las decisiones principales se trasladaron al mercado de pases: normalmente se elige entre continuar y cambiar de club; en algunas temporadas solo aparecen alternativas de salida.
- Cada opción informa dos resultados posibles y su probabilidad. Al elegir, una animación tipo sorteo ilumina los resultados durante unos segundos y se detiene en el efecto aplicado.
- El rendimiento posterior contempla prestigio del club, dificultad de la liga, rol ofrecido, competencia por minutos y adaptación al nuevo país.
- El estado continúa aislado en `game.miniGames.playerCareer` y no modifica la carrera principal.
