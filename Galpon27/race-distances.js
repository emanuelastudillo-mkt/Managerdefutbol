(function(root){
'use strict';
// v0.43: measured with corner braking, two-lane pits and current vehicle bases.
const distances={
  "dust": [
    26,
    27,
    28,
    29,
    30
  ],
  "pampa": [
    22,
    24,
    26,
    28,
    29
  ],
  "mesa": [
    16,
    18,
    22,
    26,
    28
  ],
  "nogal": [
    2,
    2,
    2,
    3,
    3
  ],
  "ruta-herrerias": [
    36,
    38,
    39,
    41,
    42
  ],
  "ruta-ribera": [
    11,
    12,
    15,
    17,
    18
  ],
  "ruta-quebracho": [
    15,
    16,
    19,
    21,
    21
  ],
  "ruta-americas": [
    6,
    7,
    7,
    7,
    7
  ],
  "ruta-ceniza": [
    21,
    23,
    24,
    26,
    26
  ],
  "ruta-salitre": [
    14,
    16,
    18,
    20,
    20
  ],
  "ruta-algodon": [
    16,
    18,
    19,
    21,
    21
  ],
  "ruta-molinetes": [
    25,
    26,
    27,
    29,
    29
  ],
  "ruta-cantera": [
    27,
    29,
    30,
    32,
    32
  ],
  "ruta-trigal": [
    15,
    17,
    19,
    21,
    21
  ],
  "ruta-relampago": [
    10,
    12,
    13,
    15,
    15
  ],
  "ruta-estepa": [
    15,
    17,
    19,
    21,
    21
  ],
  "ruta-valle": [
    9,
    10,
    10,
    11,
    11
  ],
  "ruta-granito": [
    21,
    23,
    24,
    25,
    25
  ],
  "ruta-herradura": [
    15,
    17,
    19,
    21,
    21
  ],
  "ruta-barrancas": [
    16,
    17,
    19,
    20,
    21
  ],
  "ruta-lagos": [
    13,
    15,
    18,
    20,
    21
  ],
  "ruta-triangulo": [
    11,
    12,
    14,
    16,
    17
  ],
  "ruta-costanera": [
    6,
    7,
    7,
    7,
    8
  ],
  "ruta-vinedos": [
    9,
    10,
    10,
    11,
    11
  ],
  "ruta-llanura": [
    14,
    15,
    18,
    19,
    20
  ],
  "ruta-tala": [
    23,
    25,
    25,
    27,
    27
  ],
  "ruta-rectangulo": [
    11,
    12,
    15,
    16,
    17
  ],
  "ruta-espinillo": [
    12,
    14,
    16,
    18,
    18
  ],
  "ruta-araucaria": [
    27,
    28,
    29,
    31,
    31
  ],
  "ruta-bosques": [
    18,
    20,
    21,
    22,
    22
  ],
  "ruta-acerias": [
    17,
    18,
    20,
    22,
    22
  ],
  "ruta-palmares": [
    15,
    16,
    19,
    21,
    21
  ],
  "gp-ombu": [
    3,
    4,
    4,
    4,
    4
  ],
  "gp-dragon": [
    3,
    3,
    3,
    3,
    3
  ],
  "gp-dos-puentes": [
    3,
    4,
    4,
    4,
    4
  ],
  "gp-desierto": [
    3,
    3,
    3,
    3,
    3
  ],
  "gp-viento": [
    6,
    6,
    7,
    8,
    8
  ],
  "gp-coral": [
    4,
    4,
    4,
    4,
    4
  ],
  "gp-puerto-sauce": [
    4,
    5,
    5,
    5,
    5
  ],
  "gp-dorado": [
    7,
    7,
    8,
    8,
    8
  ],
  "gp-sierra-clara": [
    3,
    3,
    3,
    3,
    3
  ],
  "gp-loma-verde": [
    4,
    4,
    4,
    4,
    4
  ],
  "gp-vientos": [
    3,
    3,
    3,
    3,
    3
  ],
  "gp-niebla": [
    4,
    4,
    4,
    4,
    4
  ],
  "gp-lomas": [
    4,
    4,
    4,
    4,
    4
  ],
  "gp-dunas": [
    5,
    5,
    5,
    6,
    6
  ],
  "gp-parque-real": [
    3,
    4,
    4,
    4,
    4
  ],
  "gp-feria": [
    4,
    4,
    4,
    4,
    4
  ],
  "gp-fortaleza": [
    5,
    5,
    5,
    6,
    6
  ],
  "gp-nocturna": [
    4,
    4,
    4,
    5,
    5
  ],
  "gp-cuchillas": [
    3,
    3,
    3,
    3,
    4
  ],
  "gp-altos-estadio": [
    4,
    4,
    4,
    4,
    4
  ],
  "gp-dos-lagunas": [
    4,
    4,
    4,
    5,
    5
  ],
  "gp-luces": [
    5,
    5,
    6,
    6,
    6
  ],
  "gp-luna-arena": [
    3,
    3,
    3,
    3,
    3
  ],
  "gp-puerto-sol": [
    3,
    3,
    3,
    4,
    4
  ]
};
root.GalponSpeedDistances=distances;if(typeof module!=='undefined')module.exports=distances;
})(globalThis);
