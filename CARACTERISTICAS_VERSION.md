# Características de la versión V6.06

## V6.06 - Botón de ayuda y guía de interfaz

### Objetivo

Agregar una ayuda integrada para que el jugador pueda entender rápidamente la jerarquía de menús, las funciones principales y el flujo recomendado de uso sin depender de imágenes ni de explicaciones técnicas internas.

### Cambios

- Nuevo botón **Ayuda** en la barra superior, antes de Guardar, Cargar y Renunciar.
- Nueva ventana modal de ayuda con guía jerárquica.
- Repaso de menús laterales por importancia:
  - revisión diaria;
  - gestión de plantel;
  - crecimiento del club;
  - seguimiento estadístico;
  - ranking y funciones especiales.
- Repaso de funciones superiores:
  - Guardar;
  - Cargar;
  - Renunciar;
  - Avance automático.
- Botones internos de salto a secciones cuando la partida está activa.
- Estilos específicos para que la ayuda sea legible en desktop y mobile.

### Criterio de redacción

La ayuda explica cómo orientarse, dónde buscar cada cosa y cómo usar el flujo general del juego. No muestra valores internos exactos ni fórmulas de balance.

### Validaciones

- Sintaxis JS validada con `node --check`.
- JSON de `data/` parseados correctamente.
- Verificado que la versión completa V6.06 no contiene `apps-script-ranking.gs`.
