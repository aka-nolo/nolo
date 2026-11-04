# Grabar las miniaturas de los sitios

Las vistas previas de la sección Websites son grabaciones reales del sitio (Playwright sobre el Chrome instalado).

```bash
cd tools && npm i playwright@1.48.2 && npx playwright install ffmpeg
node record-sites.mjs   # formwrks (carrusel de proyectos) y nope (/work); imprime el segundo donde empieza
HIDE_CARDS="<nombre>" node record-tech.mjs   # tech: BIM Bridge abierto + su detalle; oculta las tarjetas indicadas
# recortar y comprimir (ajustar -ss al segundo impreso y -t a ~12 s):
ffmpeg -ss 6.6 -t 12 -i out/formwrks/*.webm -an -vf "scale=960:-2,fps=30" -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart ../public/sites/formwrks.mp4
```

- NOPE usa scroll suave: la grilla de trabajos recién aparece ~11 s después de empezar a bajar.
- Nunca dejar a la vista nada de la lista NO PUBLICAR (expediente.md, carpeta del perfil): en tech hay una tarjeta de
  producto que figura ahí — pasar su nombre en `HIDE_CARDS`. Este repo es público: el nombre no se escribe acá.
