# Características de la versión V5.48

## V5.48 - Ranking online con rutas compatibles

- Corrige el fallo de carga manual que podía mostrar `Ruta no encontrada` cuando el Worker no exponía exactamente `/records` o `/ranking`.
- El envío manual y automático ahora prueban varias rutas compatibles: `/records`, `/ranking`, `/scores`, `/submit`, variantes `/api/...` y raíz como respaldo.
- El envío prueba formatos JSON plano, JSON con payload, formulario con payload y formulario plano.
- Si todas las rutas fallan, el mensaje muestra las rutas probadas para diagnosticar el Worker.
- No cambia el cooldown de 50 días, el cálculo de puntaje ni los datos enviados.

## Validación

- `node --check` ejecutado sobre todos los JS.
- JSON de `data/` parseados correctamente.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida.
