# Fútbol Manager MVP - V7.07

## V7.07 - Tácticas variables para equipos bots

Esta versión parte de V7.06 y conserva el ranking de carrera, el guardado doble seguro, la economía anual por reputación de liga y las migraciones anteriores.

La primera compilación de V7.07 incluía un cambio experimental en **Ofrecer a clubes**. Ese cambio fue retirado. La versión definitiva V7.07 modifica únicamente el comportamiento táctico de los equipos bots y conserva el funcionamiento de ofertas de V7.06.

### Tácticas variables de equipos bots

Los equipos controlados por el juego ya no utilizan todos la misma estructura táctica fija.

Cada bot rota entre perfiles compatibles con la reputación de su club:

- Equilibrado.
- Posesión.
- Presión alta.
- Juego directo.
- Juego abierto.
- Contraataque.
- Defensivo.
- Cauto.

Cada perfil puede modificar:

- Formación.
- Estilo defensivo.
- Estilo del mediocampo.
- Estilo ofensivo.
- Instrucciones cuando el equipo gana, empata o pierde.

Los clubes de reputación alta priorizan perfiles ofensivos, de presión y posesión. Los clubes de reputación baja priorizan perfiles defensivos, cautos y de contraataque. Los clubes de reputación media pueden utilizar toda la variedad.

La selección es determinista:

- Cada club tiene un punto de inicio diferente.
- El perfil cambia con el avance de las fechas.
- Una misma partida conserva resultados tácticos consistentes al guardar y cargar.
- El simulador rápido y el partido en vivo utilizan la misma táctica bot.
- La observación de un rival muestra su formación estimada vigente.

Configuración editable en `config.js`:

```js
equilibrioBots: {
  tacticasVariadas: {
    activo: true,
    rotacionCadaFechas: 1
  }
}
```

Si `activo` se establece en `false`, se recupera la selección anterior basada únicamente en reputación:

- Reputación alta: 4-3-3.
- Reputación media: 4-4-2.
- Reputación baja: 5-4-1.

### Ofrecer a clubes

La función conserva exactamente la lógica de V7.06:

- Requiere que el jugador haya recibido al menos un pago de sueldo.
- Respeta los requisitos de partidos y rendimiento configurados.
- Puede no encontrar clubes interesados.
- Cuando encuentra una propuesta, la genera inmediatamente.
- Conserva el cooldown general de tres turnos.

No se programan ofertas garantizadas para fechas futuras.

Al cargar una partida creada con la compilación retirada de V7.07, cualquier registro técnico de búsqueda garantizada se descarta y no produce ofertas posteriores.

### Ranking online y Cloudflare

No se modificó la API del ranking. La carpeta `cloudflare-ranking` conserva el Worker operativo:

```text
worker-v7.06.3-binding-db-sin-ddl.js
```

Binding utilizado:

```text
db -> ranking_manager_db
```

No es necesario volver a actualizar Cloudflare para instalar esta versión del juego.

### Archivos principales modificados en V7.07

- `README.md`
- `index.html`
- `config.js`
- `balance-modificadores.js`
- `data/retos_manager.json`
- `simulador-2.0.js`
- `js/core/01-config-constants.js`
- `js/game/05-state-season.js`
- `js/game/10-academy-employees.js`
- `cloudflare-ranking/worker-v7.06.3-binding-db-sin-ddl.js`
- `cloudflare-ranking/PASOS-HOTFIX-V7.06.3.md`

### Compatibilidad de partidas

**V7.07 no rompe partidas anteriores.** Conserva planteles, calendarios, presupuestos, estadísticas, títulos y progreso. Las partidas guardadas con la compilación retirada de V7.07 también cargan: sólo se eliminan las búsquedas garantizadas de ofertas que ya no forman parte del juego.
