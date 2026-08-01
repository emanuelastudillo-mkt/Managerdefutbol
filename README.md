# V9.45 · Vista privada de Administración

Base: V9.44.

- La sección se incorpora dinámicamente únicamente después de que la sesión online confirma en memoria que la cuenta pertenece exactamente a `Emanukk`.
- No se agrega ningún botón, texto, grupo ni espacio reservado para el resto de los managers.
- El modo de revisión comienza apagado y permite inspeccionar datos internos o activar herramientas locales de prueba.
- Las modificaciones generan una copia previa independiente, dejan un registro y bloquean el ranking online de ese guardado.
- Restaurar la copia elimina la marca de modificación y permite que una futura prueba genere una copia nueva.
- No requiere cambios en el Worker.

Ver `AJUSTES-V9.45.md` para el detalle completo.

# V9.44 · Cartas de reducción de objetivo acumulativas

Base: V9.43.

- Cada activación de una carta de reducción de objetivo suma nuevamente su porcentaje base.
- Una carta épica de −3% con tres activaciones aplica −9% mientras permanece activa.
- Las cartas activas con usos disponibles permiten **Activar otra vez** para consumir otro uso y reforzar el efecto.
- La renovación automática de los 100 días también suma un nivel del bonus.
- Quitar estas cartas no consume un uso; el acumulado se conserva para una futura reactivación.
- Las cartas existentes se migran al nuevo conteo sin duplicar usos consumidos por desactivaciones anteriores.

# V9.43 · Relaciones persistentes del mánager

Base: V9.42.

- Al cierre de cada temporada pueden sumarse hasta dos jugadores afines al mánager.
- La selección automática combina confianza individual, participación e influencia en el vestuario.
- Las relaciones permanecen aunque el mánager o el jugador cambien de club.
- Los reencuentros conservan una confianza inicial elevada y fortalecen la afinidad.
- Los jugadores afines aparecen en la pestaña Relaciones del perfil y como objetivos especiales del Mercado.
- La afinidad aumenta la predisposición personal a aceptar una futura oferta, sin anular la decisión del club propietario, el presupuesto ni las reglas del mercado.

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
