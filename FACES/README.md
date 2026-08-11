# FACES de jugadores · V9.73

El juego usa FACES persistentes y únicas por carrera.

## Inventario inicial reconocido

```text
FACES/
├── 01_cono_sur/                    1.100 imágenes
├── 02_brasil/                        80 imágenes
├── 03_resto_america/                  200 imágenes
├── 04_europa_occidental/              200 imágenes
├── 05_europa_oriental_balcanes/       200 imágenes
├── 06_africa/                         20 imágenes
├── 07_asia_oceania/                   70 imágenes
└── 08_reserva_mixta/                  104 imágenes
```

Los nombres deben continuar de forma consecutiva: `1 (1)`, `1 (2)`, `1 (3)`...
Se aceptan `.webp`, `.png`, `.jpg` y `.jpeg`.

## Reglas

- Una FACE se asigna una sola vez entre los jugadores profesionales activos.
- La asignación queda guardada en la partida y no cambia al recargar ni al cambiar de club.
- Al retirarse un jugador, su FACE se libera y puede ser utilizada por otro futbolista.
- Las FACES nuevas no reemplazan las ya asignadas: rellenan jugadores que todavía no tienen una.
- Al cargar el juego se comprueba si apareció el siguiente archivo consecutivo de cada carpeta. Si existe, se detecta automáticamente hasta dónde creció ese pool.

## Regiones

- `01_cono_sur`: Argentina, Uruguay y Paraguay. Chile puede usarla como respaldo mientras su pool regional esté vacío.
- `02_brasil`: Brasil.
- `03_resto_america`: Chile y resto de América.
- `04_europa_occidental`: Europa occidental.
- `05_europa_oriental_balcanes`: Europa oriental y Balcanes.
- `06_africa`: África.
- `07_asia_oceania`: Asia y Oceanía.
- `08_reserva_mixta`: respaldo general cuando la región correspondiente se quede sin imágenes.
