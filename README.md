# Fútbol Manager MVP - V6.01

## V6.01 - Revisión exhaustiva y limpieza inicial de Manager V6

Esta entrega toma como base la última versión V5.80 y abre la nueva línea de versiones V6.01 y siguientes.

### Cambios principales

- Se actualiza la versión visible del proyecto a V6.01.
- Se actualizan los parámetros de caché en `index.html` de `v=5.80` a `v=6.01` para forzar recarga de JS/CSS en navegador.
- Se eliminan funciones internas sin referencias detectables por análisis estático.
- Se elimina el archivo vacío `err` en la versión completa.
- Se corrige una contradicción de balance: `config.js` indicaba `multiplicadorTarjetas: 0.50`, pero `balance-modificadores.js` lo pisaba con `1.50`. La configuración activa queda en `1.10` desde `balance-modificadores.js`.
- Se actualiza la metadata de balance a V6.01.
- Se agrega `REVISION_CODIGO_V6.01.md` con detalle técnico de la revisión.

### Validaciones realizadas

- Sintaxis JavaScript validada con `node --check` en todos los archivos JS principales y módulos.
- Parseo JSON validado en todos los archivos dentro de `data/`.
- Revisión de referencias de imágenes declaradas en JSON.
- Revisión estática de funciones declaradas sin uso interno.
- Carga secuencial de scripts en entorno de prueba con VM para verificar que no haya errores globales de inicialización.
- Revisión de archivos vacíos o residuales.

### Hallazgos importantes

- `data/jugadores.json` es el archivo más pesado del proyecto. Funciona, pero es el principal punto de optimización futura para mejorar carga inicial.
- Las fotos manuales declaradas en `data/jugadores_manuales.json` no están incluidas en `img/jugadores/manual/`. El juego tiene fallback visual, pero esas fotos quedan pendientes si se quieren mostrar retratos específicos.
- El sistema de scripts globales sigue funcionando como aplicación simple de navegador, pero a futuro conviene modularizar o separar carga crítica/no crítica.

## Instalación

Para instalación limpia, subir todo el contenido del ZIP completo V6.01.

Para actualizar desde V5.80, aplicar el ZIP incremental V6.01 sobre la carpeta existente y forzar recarga con Control + F5. Si queda el archivo vacío `err` de versiones anteriores, se puede borrar manualmente; no afecta el juego.
