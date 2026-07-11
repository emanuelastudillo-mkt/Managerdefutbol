# Revisión de código V6.05

## Alcance

Limpieza del archivo legacy de ranking basado en Google Apps Script.

## Cambios aplicados

- Eliminado `apps-script-ranking.gs` de la versión completa.
- Actualizado `README.md` para indicar que el backend activo del ranking es Cloudflare Worker + D1.
- Actualizado `CARACTERISTICAS_VERSION.md`.
- Actualizado `VERSION.md`.
- Actualizada versión visible y query cache de scripts/estilos a V6.05.
- Agregada nota de eliminación para el incremental.

## Observación técnica

El nombre interno `CONFIG.ranking.appsScriptUrl` se mantiene por compatibilidad con el código existente, aunque ahora apunta al Worker de Cloudflare. Puede renombrarse más adelante a `rankingApiUrl`, pero no se cambió en esta versión para evitar tocar más lógica de ranking.

## Validación

- `apps-script-ranking.gs` no existe en la carpeta completa V6.05.
- Todos los JS pasan `node --check`.
- Todos los JSON dentro de `data/` parsean correctamente.
