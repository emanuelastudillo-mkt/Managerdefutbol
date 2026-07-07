# Fútbol Manager MVP

## Versión actual: V3.26

Reparación automática de campos bots injugables.

## Cambios V3.26

- Auditoría automática de campos bots.
- Reparación automática de campos bots por debajo del mínimo configurado.
- Detección de falla masiva cuando muchos bots están injugables.
- Botón manual en Estadio: “Reparar campos bots injugables”.
- Mensaje interno cuando se corrige una partida afectada.
- Autosave al reparar campos bots durante la carga.

## Configuración relevante

```js
estadio: {
  botsCampoFijoPorTemporada: true,
  botsCampoMinimo: 30,
  botsCampoMaximo: 95,
  botsCampoBaseInicial: 58,
  botsCampoRangoPorPosicion: 42,
  botsCampoAutoRepararEstadosInvalidos: true,
  botsCampoUmbralInvalido: 29,
  botsCampoPorcentajeMasivoInjugable: 0.60
}
```

## Cómo usar

Abrir `index.html` en navegador o subir el contenido a GitHub Pages. Si una partida guardada tenía campos bots en 1/100, la corrección se aplica al cargarla. También puede ejecutarse desde la pantalla Estadio.
