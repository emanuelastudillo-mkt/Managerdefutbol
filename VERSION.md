# Registro de versión

## Versión: V2.0
**Estado:** motor de simulación separado y ampliado  
**Tipo de mejora:** cambio estructural del simulador

### Resumen
La versión V2.0 separa el motor de partidos en un archivo dedicado llamado `simulador-2.0.js`. Desde esta versión, la interfaz conserva su lógica general en `app.js`, mientras que el cálculo deportivo principal queda concentrado en el nuevo simulador.

### Cambios principales agregados
- Nuevo archivo `simulador-2.0.js`.
- `index.html` carga primero el simulador y luego `app.js`.
- `app.js` delega la simulación activa en `window.Simulator20.simulateMatch()`.
- El partido se calcula en 6 bloques:
  - 1-15
  - 16-30
  - 31-45
  - 46-60
  - 61-75
  - 76-90
- Se agregan instrucciones tácticas según resultado parcial:
  - Ganando
  - Empatando
  - Perdiendo
- Cada instrucción puede usar:
  - Bajar el ritmo
  - Normal
  - Subir ritmo
- Las instrucciones influyen en ataque, mediocampo, defensa, volumen ofensivo, conversión, faltas y desgaste físico posterior.
- Se agregan efectos más claros por líneas:
  - Mediocampistas: posesión y generación de ataques.
  - Delanteros: conversión de ataques en ocasiones.
  - Defensores y portero: reducción de ocasiones rivales.
- La formación afecta internamente el estilo:
  - más defensores favorecen defensa;
  - más mediocampistas favorecen posesión;
  - más delanteros favorecen conversión ofensiva.
- La moral y la cohesión siguen influyendo internamente en el rendimiento.
- El estado del campo afecta pase, ocasiones, cansancio y lesiones.

### Valores ocultos
Siguen ocultos para el usuario:
- cohesión exacta;
- coeficientes del campo;
- multiplicadores de moral;
- fórmulas de conversión;
- pesos internos de cada línea.

### Pendientes sugeridos
- Hacer que expulsiones y lesiones afecten el bloque siguiente durante el mismo partido.
- Hacer que los cambios automáticos modifiquen el rendimiento real desde el minuto en que ocurren.
- Agregar estilos generales de equipo: presión alta, contraataque, posesión, bloque bajo.
