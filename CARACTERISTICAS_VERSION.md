# Características de versión - V3.42

## Ajuste de balance: lesiones

Se ajustó el sistema de lesiones para que ocurran con mucha menos frecuencia, pero cuando sucedan tengan mayor peso deportivo.

### Cambios

- Probabilidad total de lesión reducida en un 80%.
- La reducción se aplica sobre la chance completa calculada por el motor: base, fatiga y campo de juego.
- Las recuperaciones son más largas por tipo de lesión.
- Las fracturas pueden llegar hasta 400 días configurables desde `config.js`.

### Configuración nueva

```js
lesiones: {
  multiplicadorProbabilidad: 0.20,
  contusionMinDias: 7,
  contusionMaxDias: 21,
  distensionMinDias: 21,
  distensionMaxDias: 56,
  desgarroMinDias: 28,
  desgarroMaxDias: 84,
  esguinceMinDias: 35,
  esguinceMaxDias: 105,
  roturaMinDias: 90,
  roturaMaxDias: 210,
  fracturaMinDias: 180,
  fracturaMaxDias: 400
}
```
