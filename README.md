# Fútbol Manager MVP

## Versión actual: V3.27

Doble avance: día y próximo partido.

## Cambios V3.27

- Dos botones de avance en la oficina del manager:
  - **Avanzar día**
  - **Ir a próximo partido**
- El avance diario mueve el calendario sólo 1 día durante la temporada regular.
- El avance diario tiene cooldown de 10 segundos.
- El avance hasta próximo partido mantiene cooldown de 120 segundos.
- La barra de progreso queda debajo de ambos botones y ocupa el ancho conjunto.
- La barra de progreso usa la duración real del bloqueo activo.
- Si hay un partido pendiente en el día actual, no se puede seguir avanzando días sin jugarlo.

## Configuración relevante

```js
calendario: {
  bloqueoEntreAvancesMs: 120000,
  bloqueoAvanceDiaMs: 10000
}
```

## Cómo usar

Abrir `index.html` en navegador o subir el contenido a GitHub Pages. Usar **Avanzar día** para pasar jornadas sueltas y **Ir a próximo partido** para disputar el siguiente compromiso.
