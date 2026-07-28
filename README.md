# Una Vida de Mánager · V8.81 incremental

Aplicar sobre una instalación completa de **V8.80**.

## Opciones ocultas temporalmente

- Se oculta la opción **Fundar club** en el inicio de carrera y al quedar sin equipo.
- Se oculta el acceso para iniciar o continuar el reto **Campo destruido** desde la pantalla de partidas.
- No se elimina la lógica de ninguno de los dos modos.
- No se borran partidas guardadas ni datos asociados.
- Una carrera de club fundador ya iniciada conserva su funcionamiento al cargarla.
- Las opciones pueden reactivarse posteriormente desde `config.js`.

Configuración:

- `modoFundador.activo: false`
- `retosManager.campoDestruidoVisible: false`

## Ayuda actualizada

La Ayuda general pasa a reflejar las funciones actuales:

- Tácticas predefinidas y personalizadas.
- Pestaña Grupos.
- Vestuario, confianza individual, influencia y jerarquías.
- Renovación manual de contratos de jugadores.
- Advertencias y despido por plantel incompleto al inicio de temporada.
- Eventos de carrera, adaptación y consecuencias diferidas.
- Ofertas laborales mientras el mánager tiene trabajo y plazos de 10 a 30 días.
- Copas nacionales, supercopas, sedes neutrales y tandas de penales.
- Informes del Segundo entrenador.

## Cursos de mánager

- Se actualizaron las licencias Básica, Nacional e Internacional.
- Se conservan los **30 identificadores originales** de contenidos.
- Las partidas ya iniciadas mantienen sus controles completados y licencias aprobadas.
- Los cursos incorporan táctica personalizada, grupos, vestuario, contratos, copas, ofertas laborales y análisis del Segundo entrenador.
- La recompensa final de 1.000 puntos de habilidad no cambia.

## Segundo entrenador

El análisis situacional ahora también estudia:

- Confianza general del vestuario.
- Confianza de referentes, titulares, suplentes y juveniles.
- Contratos que vencen esta temporada y la siguiente.
- Renovaciones con baja predisposición.
- Próximo partido de eliminación directa y necesidad de ganador.
- Condición de sede neutral.

Nuevas recomendaciones posibles:

- Resolver contratos próximos a vencer.
- Escalonar renovaciones futuras.
- Recuperar confianza antes de negociar.
- Ordenar jerarquías del vestuario.
- Preparar una eliminatoria y una eventual tanda de penales.

Los accesos del informe pueden abrir directamente Táctica, Vestuario, Contratos, Grupos, Empleados, Mercado, Academia, Estadio o Finanzas.

## Compatibilidad

Compatible con partidas V8.80 ya iniciadas. No reinicia carreras, progreso de cursos, contratos, vestuario, copas, ofertas laborales ni historiales del Segundo entrenador.
