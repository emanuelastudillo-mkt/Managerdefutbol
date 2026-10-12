(function(root){
'use strict';
// v0.40: whole-lap distances calibrated for the approved vehicle bases.
const distances={
  "dust": [
    35,
    42,
    49,
    57,
    69
  ],
  "pampa": [
    22,
    27,
    34,
    40,
    42
  ],
  "mesa": [
    16,
    19,
    24,
    28,
    32
  ],
  "nogal": [
    2,
    2,
    2,
    3,
    3
  ],
  "ruta-herrerias": [
    61,
    71,
    88,
    108,
    131
  ],
  "ruta-ribera": [
    10,
    12,
    14,
    18,
    21
  ],
  "ruta-quebracho": [
    13,
    16,
    20,
    25,
    28
  ],
  "ruta-americas": [
    10,
    12,
    15,
    18,
    19
  ],
  "ruta-ceniza": [
    21,
    26,
    30,
    40,
    42
  ],
  "ruta-salitre": [
    13,
    16,
    20,
    25,
    27
  ],
  "ruta-algodon": [
    15,
    18,
    21,
    30,
    29
  ],
  "ruta-molinetes": [
    32,
    37,
    48,
    62,
    66
  ],
  "ruta-cantera": [
    32,
    42,
    53,
    62,
    65
  ],
  "ruta-trigal": [
    14,
    16,
    20,
    27,
    29
  ],
  "ruta-relampago": [
    10,
    12,
    13,
    17,
    19
  ],
  "ruta-estepa": [
    15,
    16,
    21,
    26,
    26
  ],
  "ruta-valle": [
    10,
    11,
    15,
    19,
    20
  ],
  "ruta-granito": [
    21,
    26,
    30,
    40,
    42
  ],
  "ruta-herradura": [
    14,
    16,
    21,
    27,
    29
  ],
  "ruta-barrancas": [
    15,
    18,
    24,
    27,
    29
  ],
  "ruta-lagos": [
    13,
    14,
    20,
    25,
    25
  ],
  "ruta-triangulo": [
    11,
    13,
    15,
    19,
    22
  ],
  "ruta-costanera": [
    7,
    8,
    10,
    12,
    13
  ],
  "ruta-vinedos": [
    12,
    13,
    18,
    21,
    25
  ],
  "ruta-llanura": [
    13,
    15,
    19,
    23,
    27
  ],
  "ruta-tala": [
    26,
    32,
    38,
    50,
    48
  ],
  "ruta-rectangulo": [
    10,
    13,
    15,
    18,
    21
  ],
  "ruta-espinillo": [
    11,
    14,
    17,
    22,
    23
  ],
  "ruta-araucaria": [
    28,
    32,
    40,
    52,
    56
  ],
  "ruta-bosques": [
    18,
    21,
    29,
    34,
    36
  ],
  "ruta-acerias": [
    16,
    19,
    23,
    28,
    33
  ],
  "ruta-palmares": [
    14,
    16,
    20,
    27,
    28
  ],
  "gp-ombu": [
    4,
    5,
    7,
    9,
    10
  ],
  "gp-dragon": [
    4,
    5,
    7,
    8,
    9
  ],
  "gp-dos-puentes": [
    5,
    5,
    6,
    8,
    9
  ],
  "gp-desierto": [
    4,
    5,
    7,
    8,
    9
  ],
  "gp-viento": [
    7,
    7,
    10,
    12,
    13
  ],
  "gp-coral": [
    5,
    5,
    7,
    9,
    10
  ],
  "gp-puerto-sauce": [
    6,
    7,
    9,
    11,
    12
  ],
  "gp-dorado": [
    9,
    11,
    13,
    17,
    19
  ],
  "gp-sierra-clara": [
    6,
    6,
    8,
    9,
    11
  ],
  "gp-loma-verde": [
    7,
    7,
    9,
    11,
    12
  ],
  "gp-vientos": [
    5,
    5,
    6,
    8,
    9
  ],
  "gp-niebla": [
    5,
    6,
    8,
    10,
    12
  ],
  "gp-lomas": [
    7,
    8,
    10,
    11,
    14
  ],
  "gp-dunas": [
    7,
    7,
    9,
    11,
    13
  ],
  "gp-parque-real": [
    5,
    5,
    7,
    8,
    9
  ],
  "gp-feria": [
    5,
    6,
    7,
    9,
    9
  ],
  "gp-fortaleza": [
    7,
    8,
    10,
    12,
    13
  ],
  "gp-nocturna": [
    6,
    7,
    9,
    11,
    13
  ],
  "gp-cuchillas": [
    4,
    5,
    7,
    8,
    9
  ],
  "gp-altos-estadio": [
    6,
    7,
    9,
    11,
    12
  ],
  "gp-dos-lagunas": [
    6,
    7,
    9,
    11,
    12
  ],
  "gp-luces": [
    7,
    7,
    9,
    12,
    13
  ],
  "gp-luna-arena": [
    4,
    5,
    7,
    8,
    9
  ],
  "gp-puerto-sol": [
    5,
    5,
    7,
    8,
    10
  ]
};
root.GalponLegacyDistances=distances;if(typeof module!=='undefined')module.exports=distances;
})(globalThis);
