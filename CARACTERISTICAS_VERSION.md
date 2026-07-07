# Características de la versión V3.27

La V3.27 separa el avance del calendario en dos acciones: avance diario corto y avance largo hasta el próximo partido.

## Nuevo flujo de avance

En la oficina del manager ahora aparecen dos botones:

- **Avanzar día**: avanza únicamente 1 día de calendario durante la temporada regular.
- **Ir a próximo partido**: salta al día del próximo compromiso y simula el partido.

## Cooldowns

- El avance diario tiene bloqueo de **10 segundos**.
- El avance hasta próximo partido mantiene el bloqueo de **120 segundos**.
- La barra de progreso se ubica debajo de los dos botones y toma el ancho del bloque completo.
- La barra mide correctamente el bloqueo activo, sea de 10 o de 120 segundos.

## Protección contra saltarse partidos

Si el calendario ya llegó al día del partido, el botón **Avanzar día** queda bloqueado y obliga a usar **Ir a próximo partido**. Esto evita que el jugador saltee un compromiso oficial por accidente.

## Configuración editable

```js
calendario: {
  bloqueoEntreAvancesMs: 120000,
  bloqueoAvanceDiaMs: 10000
}
```
