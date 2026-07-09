# Características V4.21 - Temporada segura por país

- Corrección estructural del cierre de temporada para impedir ascensos/descensos entre países distintos.
- Los movimientos de temporada ahora se calculan por país.
- Argentina mantiene sus reglas propias de ascenso, descenso y playoffs.
- Países con una sola división ya no generan ascensos/descensos ficticios contra otra liga.
- Los overrides de división inválidos o cruzados por país se ignoran o reparan hacia una división válida del país del club.
- El verificador puede regenerar calendarios cruzados cuando esos partidos todavía no fueron jugados.
- Si hay partidos cruzados ya jugados, se informan como no reparables automáticamente para no borrar resultados.
- El inicio de nueva temporada vuelve a validar la estructura antes de crear el fixture.
