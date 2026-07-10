# Características de la versión V5.49

## V5.49 - Ranking online Worker /ranking/season

- Corrige el fallo de carga manual que seguía mostrando `Ruta no encontrada` porque el Worker Cloudflare + D1 actual usa `/ranking/season`.
- Agrega `/ranking/season` como primera ruta de carga y `/ranking/career` como respaldo de lectura.
- Mantiene compatibilidad con rutas anteriores: `/records`, `/ranking`, `/scores`, `/submit`, variantes `/api/...` y raíz.
- El cuerpo principal del envío ahora es JSON plano compatible con el Worker actual y conserva aliases para versiones previas.
- No cambia cooldown manual, login/token, puntaje ni ranking automático.

## Validación

- `node --check` ejecutado sobre todos los JS.
- JSON de `data/` parseados correctamente.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida.
