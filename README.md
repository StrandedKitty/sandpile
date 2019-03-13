# Sandpile
Abelian sandpile model implementation made with WebGL. It does all calculations on GPU using ping-pong technique so they are done fairly fast. Size of the grid is 512×512 but the x=0 and y=0 rows are never used, so the actual size is 511×511. The central cell have an infinite amount of grains so simulation can run forever.

[Live demo](https://vthawk.github.io/sandpile). Use mouse wheel to zoom and space button to pause.

## Color pattern
| Number of grains | Color |
| --- | --- |
| 0 | White |
| 1 | Red |
| 2 | Orange |
| 3 | Cyan |
| More than 3 | Green |
