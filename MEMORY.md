# Nolo — portafolio / showreel de Manuel

Producto nuevo (2026-11-04), mundo **Personal**. Repo/commits personales: GitHub **aka-nolo** (nunca Formwrk ni
NopeStudios). Deploy: Vercel personal. Nació del relevo de la sesión de perfil profesional
(`C:/Users/manue/OneDrive/Personal/03_References/Career Portfolio/2026-11 perfil/` — ver su MEMORY.md, textos.md,
expediente.md). Motivo: Upwork, Workana y Fiverr piden portafolio.

## Pedido de Manuel (literal en lo esencial)

**Referencia: https://bymonolog.com** — replicar su MOLDE (orden de secciones, negro/blanco alternado, grano,
sonido, animaciones, UI/UX interactiva) con contenido de Manuel. «Lúcete, es mi carta de presentación, debe ser lo
mejor que hemos hecho». Regla de CLAUDE.md: replicar el molde = abrir el original y listar secciones/mecanismos antes
de escribir; lo que no tenga equivalente se inventa pero se DECLARA cuál es cuál.

**Marca:** kit PRINCIPAL (no el retro): `C:/Users/manue/Downloads/Nolo_Kit_Completo/Nolo_Kit_Marca`
(00_Manual_de_marca, 01_Principal_02, 05_Paleta; leer LEEME.txt y ABRIR_KIT.html primero).

**Cuatro tipos de trabajo** que organizan el sitio: Architectural & BIM Development · Website Development ·
Brand and Apps Development · Video Development.

1. **HERO** — foto de Manuel SIN fondo (vigente: `C:/Users/manue/Downloads/Retrato con camisa negra y pared clara.png`;
   recortes en la carpeta de perfil; Manuel dijo «esta imagen mía» sin adjuntar → confirmar). Explicación muy breve
   (arquitecto, director creativo, desarrollador AEC). Botones: WhatsApp (+57 301 786 4636), correo
   (m4nuelrpo@gmail.com) y «Schedule a call». Fondo con «nolo» en transparencia; el sitio se llama Nolo; decir en algún
   lado que es su showreel. Animación divertida.
2. **RENDERS** (sección NEGRA, en el punto del «we close that gap» de la referencia, sin bajar mucho): secuencia
   automática con play/stop, ir a cada render, clic para ampliar (como la galería de formwrks.co →
   `form-os/products/form-design-website`). Texto breve: llevados de la conceptualización a una etapa madura de
   diseño. Frase propia tipo «we close that gap», que no invada. Animación. **Dejar ruta de assets documentada**:
   Manuel pasará más renders. Buscar renders existentes y preguntarle cuáles usar.
3. **WEBSITES** (sección BLANCA): secuencial, descripción breve + miniatura INTERACTIVA que lleva al sitio:
   https://formwrks.co/ · https://tech.formwrks.co/ · https://www.nopestudios.co/ . Datos fáciles de ampliar.
4. **BRAND & APPS**: logos de meka, melo, form internal app, nope internal app, raven. Explicar que son apps internas +
   identidad de marca, una línea por app, **sin links ni detalle que permita entrar** (demos internas). Logos en
   form-os/products (form-internal-app, form-raven, meka) y nope-os (nope-studio, .melo-borrador).
5. **DIRECTOR'S SHOWREEL** (sección NEGRA, como el «project journey»): Vimeo, fragmento corto, secuencial, breve
   explicación: Inevitable, Borrachita, Cartier, Fear of US, Sexpecial, Acuérdate. Links en
   `nope-os/products/nope-studio/src/data/works.ts`. Manuel dirá cuáles mostrar.

## Reglas
- Construir directo, sin spec; decidir lo táctico. Interfaz en inglés (clientes en USD).
- No inventar métricas. Respetar la lista NO PUBLICAR de expediente.md (está en la carpeta del perfil, no en este repo).
- ⚠️ **Este repo es PÚBLICO** (GitHub Pages en plan gratuito): nada de la lista NO PUBLICAR, ni notas internas, ni
  secretos — ni en el código ni en esta memoria.
- Al terminar: desplegar en Vercel personal y abrírselo en el navegador (Start-Process chrome, verificar).

## Dónde vive (2026-11-04)
- Repo: `aka-nolo/nolo` (privado) · commits `Manuel Restrepo <manuel.rpo@outlook.com>`.
- Sitio estático en `public/` (sin build): `index.html`, `styles.css`, `main.js`, **`data.js` = todo el contenido**.
  GSAP 3.12.5 + ScrollTrigger (cdnjs), Lenis 1.1.13 (jsdelivr), API de Vimeo. Fuentes: Inter Tight / JetBrains Mono / Anton.
- Probar local: `python -m http.server 8093 --directory public` → http://localhost:8093/
- Rutas **relativas** a propósito (`renders/…`, no `/renders/…`): sirve igual en Vercel que en una subcarpeta de GitHub Pages.

## Cómo agregar material (lo que Manuel va a pasar)
- **Render**: el `.webp` (≈1500 px de ancho) en `public/renders/<proyecto>-NN.webp` + una línea en `RENDERS` de `data.js`.
  Los 17 actuales salieron de la galería de formwrks.co (`form-design-website/src/data/works.js`),
  **descargados al repo** para no depender de Form. Se descartaron los de nombre WhatsApp/ChatGPT y Cartagena (IA).
- **Sitio web**: captura 16:10 (o más alta: hace scroll al pasar el mouse) en `public/sites/` + un objeto en `SITES`.
  Las capturas se toman con Chrome real: formwrks.co y tech piden «TAP» y Chrome sin ventana sale en blanco.
- **Video**: un objeto en `FILMS` con el id de Vimeo y `start` (segundo donde empieza el fragmento; dura 9 s, `FRAG` en main.js).
  Vimeo de NOPE es cuenta **estándar**: no hay modo `background=1`; va autoplay silenciado + `#t=`.
- **App**: logo en `public/logos/` (versión clara: las tarjetas son café) + un objeto en `APPS`.

## Molde → Nolo (qué salió de dónde)
| bymonolog.com | Nolo | |
|---|---|---|
| transition_screen | loader café con el logo que rebota | molde |
| navbar fija + botón de sonido + CTA | igual (sonido = WebAudio, sin archivos) | molde |
| hero claro: texto+CTA izq., titular gigante, logo de fondo | igual + retrato recortado con física al mouse; clic = rebote | molde + pedido |
| franja de clientes | «Four ways to work with me» (las 4 disciplinas) | equivalente |
| problems (testimonios) | **omitida**: no hay testimonios reales y Manuel pidió renders «sin bajar mucho» | cambio declarado |
| gap «WE CLOSE THAT GAP» fijado | «IDEA TO IMAGE» fijado + carrusel de renders (play/stop, miniaturas, ampliar) | molde + pedido |
| works (claro, imagen + ficha) | Websites | molde |
| services (oscuro) | Brands & Apps (5 marcas, sin links) | molde |
| process / project journey | Director's showreel: pasos a la izq., video fijo a la der. | molde |
| FAQ | 4 preguntas con datos de textos.md | molde, contenido inventado sobre hechos |
| CTA gigante sobre imagen B/N | igual, render en B/N | molde |
| footer con canvas | logo nolo en partículas que huyen del puntero | molde |

## Decisiones tomadas sin preguntar
- «Melo» = la app de NOPE de reservar equipo de rodaje disponible (antes STANDBY), no el nombre viejo de Meka.
- «NOPE internal app» = el panel `/admin` de nope-studio; se muestra con el ojo de NOPE.
- Schedule a call → WhatsApp con mensaje armado, porque no existe enlace de agenda (Cal.com/Calendly).
- Retrato: `Downloads/Retrato con camisa negra y pared clara.png`, recortado local con rembg (`isnet-general-use`).
- Los 6 videos que nombró, en su orden.

## Pendientes
- [x] **Publicado en GitHub Pages** (decisión de Manuel, 2026-11-04): repo público, workflow `.github/workflows/pages.yml`
      sube `public/` en cada push a `main`. Si algún día hay Vercel personal, `vercel.json` ya está listo.
- [ ] Manuel: confirmar retrato, qué renders y qué videos quedan, y pasar más renders.
- [ ] Manuel: enlace de agenda real para «Schedule a call» (hoy cae en WhatsApp).
- [ ] Al publicar: `og:image` con URL absoluta (hoy relativa) y dominio.

## Log
- 2026-11-04 — v1 construida y probada local (escritorio y 390 px): sin errores de carga, Vimeo reproduce los fragmentos
  en secuencia, galería con ESC/flechas/deslizar. Repo `aka-nolo/nolo` creado y pusheado.
