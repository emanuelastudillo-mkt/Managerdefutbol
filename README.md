# Fútbol Manager MVP

## Versión actual: V3.34

Menú **ESPECIAL** con cartas, sobres y bonos acumulables.

## V3.34

- Corrección crítica del sistema de sobres: las cartas se guardan en reserva antes de mostrarse en la animación.
- Las cartas abiertas ya no quedan atrapadas en “Cartas obtenidas”.
- Al finalizar la apertura, pasan al inventario y se pueden activar o destruir.
- Se agregó reparación automática para cartas que hubieran quedado sólo en historial por versiones anteriores.
- Si el guardado falla, se revierte el gasto de puntos del sobre.


## Cambios V3.31

- Nuevo menú lateral **ESPECIAL**.
- Sistema de puntos de habilidad ocultos para el manager.
- Sobres común, raro y épico.
- Cartas inútiles, comunes, raras, épicas y legendarias.
- Máximo de 5 cartas activas.
- Máximo de 50 cartas en reserva.
- Bloqueo de 100 días para cambiar cartas activas.
- Destrucción de cartas en reserva para recuperar puntos.
- Bonus apilables aplicados a:
  - nuevos sponsors;
  - deterioro del campo propio;
  - probabilidad de obtener cartas legendarias.

## Archivos nuevos

```text
data/habilidades_especiales.json
js/game/15-especial.js
```

## Cómo usar

Abrir `index.html` en navegador o subir el contenido a GitHub Pages. Desde el menú lateral entrar a **ESPECIAL** para abrir sobres, activar cartas, revisar bonus y destruir cartas sobrantes.


## V3.30

- Reordenamiento del menú lateral según la estructura solicitada.


## V3.30
- Ajuste de textos del bloque de campos rivales en Estadio.
- El botón de reparación ahora aparece como petitorio a la Federación Argentina.


## V3.31

- Corrección del descuento de puntos al abrir sobres.
- Cartas de última apertura activables/destruibles.
- Apertura de sobres animada carta por carta.
- Activación de cartas por botón o arrastrando al bloque de cartas activas.



## V3.33
- Academia: al iniciar una captación, una vez por temporada llega un juvenil excepcional de 16 años.
- Ese juvenil puede entrenarse en academia o firmar contrato profesional de inmediato.
- Se agregó configuración para edad y rango de media inicial del juvenil excepcional.

## V3.32

- Corrección del pase automático de cartas abiertas hacia reserva.
- Recuperación defensiva de cartas de última apertura al activar o destruir.
- Apertura de sobres tres veces más lenta.
