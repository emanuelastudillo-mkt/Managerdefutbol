# V9.32 · Ser jugador: historial y archivo de carreras

Base: V9.31.

- La interfaz compacta de «Ser jugador» recibió un nuevo pulido visual.
- «OVR» fue reemplazado por «Media».
- Se añadió un historial visible de trofeos individuales con año, club y competición.
- Al finalizar una carrera se conserva una ficha resumen dentro de `game.miniGames.playerCareerArchive`.
- Se guardan únicamente las últimas 20 carreras finalizadas.
- Reiniciar el jugador actual no elimina el archivo de retirados.
- El minijuego continúa sin modificar la carrera principal del mánager.
