# Características de la versión V5.50

## V5.50 - Login visible para Ranking Online

- Agrega una tarjeta de **Login del ranking** dentro de la pantalla Ranking Online.
- Permite iniciar sesión con usuario y contraseña sin reiniciar ni crear una partida nueva.
- Guarda el token recibido en `localStorage` y lo reutiliza para carga manual y automática.
- Agrega botones para verificar sesión y cerrar sesión local.
- Si el Worker exige sesión y no hay token guardado, el botón de carga manual queda bloqueado con el mensaje: `Tenés que iniciar sesión para subir récords.`
- Agrega rutas compatibles de autenticación: `/auth/login`, `/login`, `/api/auth/login`, `/api/login` y verificación con `/auth/me`, `/me`, `/api/auth/me`, `/api/me`.
- No cambia puntaje, cooldown, ruta `/ranking/season`, cálculo de datos ni ranking automático.

## Validación

- `node --check` ejecutado sobre todos los JS.
- JSON de `data/` parseados correctamente.

## Compatibilidad

Se implementa solo. No requiere reiniciar partida. Las partidas existentes pueden iniciar sesión desde Ranking Online y subir datos después.

---

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
