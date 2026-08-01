# V9.41 · Consumo físico según resistencia

Base: V9.40.

- El consumo base de estado físico durante los partidos ahora depende de la resistencia del jugador.
- Hasta 59 de resistencia se conserva el desgaste actual completo.
- De 60 a 69 se reduce 10%; de 70 a 79, 20%; de 80 a 89, 30%; y de 90 a 99, 40%.
- El ajuste se aplica al desgaste base de 40 a 78 puntos; el cansancio extra por campo, táctica o instrucciones continúa sumándose por separado.
- Los arqueros conservan además su factor de consumo reducido.
- No se modificó la recuperación automática posterior al partido.

# V9.40 · Ser jugador: trofeos, clubes compactos y Bota de oro

Base: V9.39.

- El historial de trofeos individuales se muestra debajo de las opciones de temporada o mercado.
- El listado anual de clubes se compactó para mostrar más temporadas con menos espacio.
- Al ganar la Bota de oro al mejor jugador del mundo aparece una celebración destacada.
- La animación se muestra una sola vez por premio y respeta la preferencia de movimiento reducido.
- No se modificó la lógica de progresión, mercado, retiro ni estadísticas.

# V9.39 · Ser jugador: final natural de la carrera

Base: V9.37.

- El retiro ahora exige una caída deportiva clara y una pérdida casi total de participación anual.
- Desde los 32 años la cantidad de partidos disminuye de forma progresiva.
- El deterioro de Media continúa siendo obligatorio y se refuerza al avanzar la etapa final.
- Una carrera no puede terminar cerca de la mejor Media ni después de jugar casi toda la temporada.
- El retiro se activa cuando la última temporada tiene ocho partidos o menos y la Media descendió lo suficiente respecto del máximo alcanzado.
- Se eliminó el retiro voluntario para evitar finales prematuros.
- El estado continúa aislado dentro de `game.miniGames.playerCareer`.
