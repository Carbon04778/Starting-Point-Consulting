![Starting Point Consulting](Logos/starting-point-emblem-transparent.png)

Starting Point

Consulting

01 · Brand

# Brand specifications

Every color, typeface, logo file, and surface treatment the website uses — and
nothing it doesn't.

## Section 01Logo files

All files are in `01 Brand / Logos`. The emblem is the sunrise-over-mountains
mark; the wordmark is the type-set name; the full lockup is both together.

File| Use| Notes  
---|---|---  
**starting-point-logo-full-transparent.png**|  Primary / horizontal lockup|
Site header, email signature, any light background. Transparent.  
**starting-point-logo-full.png**|  Full lockup, white background| Only where a
solid white plate is wanted. Do not place on a colored section.  
**starting-point-emblem-transparent.png**|  Emblem alone| Favicon source,
social avatar, small-space mark, mobile header.  
**starting-point-emblem.svg**|  Emblem, vector| Scales cleanly. Approximate
vector trace — use PNG where the mark must be exact.  
**starting-point-wordmark.png / .svg**|  Wordmark alone| Footer, wide narrow
spaces, document headers.  
  
**Dark surfaces.** There is no reversed (light-on-dark) logo file yet. The
footer therefore sets the name in type (Jost, letter-spaced caps) rather than
using an image. If a reversed PNG/SVG is produced later it can replace that
type lockup with no other change. Still needed from Darlene

#### Clear space & minimum size

  * Clear space on all sides: the height of the emblem's sun.
  * Minimum header height: emblem 34 px, full lockup 28 px tall.
  * Never stretch, rotate, recolor, add a drop shadow, or place the mark over a busy area of a photograph.

## Section 02Favicon & app icon

In `01 Brand / Favicon`. Squarespace asks for one square image under **Design
→ Browser icon (favicon)** ; upload `favicon-512.png` and it generates the
rest. The other sizes are provided for anywhere a fixed size is required.

File| Where it is used  
---|---  
`favicon-512.png`| Squarespace browser icon upload, PWA/app icon, Canva  
`favicon-180-apple-touch.png`| iOS home-screen icon  
`favicon-16 / 32 / 48 / 64.png`| Browser tab, bookmarks, legacy sizes  
  
## Section 03Color palette

Five colors carry the site. Everything else in the table below is a tint of
them, used for card washes, borders, and icon plates. Squarespace's palette
has exactly five slots — the "Squarespace slot" column tells the designer
where each one goes.

#### Core five

Color| Hex| Squarespace slot| Role  
---|---|---|---  
**Cream**| `#FCFAF5`| 1st (lightest)| Default page background, card surfaces  
**Warm sand**| `#F7F2E8`| 2nd| Alternating section backgrounds, page wash  
**Sunrise gold**| `#C8902F`| 3rd (accent)| Primary buttons, links, eyebrow
rules, active states  
**Deep olive**| `#4A5240`| 4th| Secondary dark, sage panels, serif lead text  
**Charcoal**| `#1B2127`| 5th (darkest)| Body text, dark sections, footer  
  
#### Supporting tints used on the site

Name| Hex| Where it appears  
---|---|---  
Gold 50| `#FBF3E3`| Icon plates, accent surfaces, hero wash, note blocks  
Gold 200| `#EAC988`| Hairlines and borders on accent cards  
Gold 700| `#855D16`| Link text, eyebrow text (accessible on cream)  
Sage 50| `#EEF0E9`| "Who we serve" chips, secondary icon plates  
Sage 500| `#5C654C`| Serif italic lead lines, secondary headings  
Sand 300| `#E3D7BF`| Subtle borders, section dividers  
Ink 500| `#586470`| Muted body text, captions, form hints  
Success| `#4E7A52`| Confirmation checkmarks and success states only  
Danger| `#A8493A`| Form errors only — never decorative  
  
**One dark moment per page.** At most one charcoal section per page, and never
two dark sections in a row. Always resolve back to a light surface before the
footer.

## Section 04Typography

Three Google Fonts, each with one job. Jost teaches, Hanken Grotesk reads,
Newsreader italic comforts.

Role| Font| Specification  
---|---|---  
**Headings (H1–H3)**|  Jost| 600 · letter-spacing −0.015em · line-height
1.10–1.18  
**Body / paragraph**|  Hanken Grotesk| 400 · line-height 1.65–1.68 · measure ≤
74 characters  
**Lead & pull quotes**| Newsreader| 400 italic · color deep olive `#4A5240` or
sage 500  
**Buttons & nav**| Jost| 500 · letter-spacing 0.02em  
**Eyebrows**|  Jost| 500 · uppercase · letter-spacing 0.20–0.22em · gold 700  
**Captions & form hints**| Hanken Grotesk| 400 · 13–14px · ink 500  
  
#### Desktop size ladder

Element| Desktop| Mobile| Rule  
---|---|---|---  
H1 / page title| 47–60 px| 32–36 px| Once per page  
H2 / section title| 36 px| 27–28 px| One per section  
H3 / card title| 22 px| 20 px| Cards, sub-sections  
Lead paragraph| 18 px| 17 px| One per section maximum  
Body| 16 px| 16 px| Never below 16 px on mobile  
Small / caption| 13–14 px| 13–14 px| Captions, legal, form hints  
Eyebrow| 11–12 px| 11 px| Uppercase, tracked  
  
## Section 05Surfaces, radii, shadows, dividers

Element| Specification  
---|---  
**Card**|  White `#FFFFFF` · border 1px `#E3D7BF` · radius 12–14px · shadow `0
8px 22px rgba(27,33,39,0.10)`  
**Buttons (primary)**|  Gold `#C8902F` fill · white text · fully rounded pill
· 12px/24px padding  
**Buttons (secondary)**|  Transparent · 1px `#A6AFB8` border · charcoal text ·
same pill radius  
**Section divider**|  1px hairline `#E3D7BF` at ~20% visual weight. No heavy
rules, no shapes, no wave dividers.  
**Icon plate**|  52×52 rounded square, radius 10px, gold 50 or sage 50 fill,
icon in gold 700 / sage 600  
**Focus ring**|  2px `#D09A33` outline, 2px offset — required for keyboard
accessibility  
**Corner glow**|  Radial gold at 10–14% opacity in one corner of hero and
feature surfaces. Subtle enough to feel like light, not a gradient.  
  
**No loud gradients.** The only approved gradients are (a) the hero sunrise
wash — cream to gold 50, top to bottom — and (b) the footer sage-to-ink ridge.
Nothing else on the site uses a gradient.

## Section 06Icons

Icons are **Lucide** (lucide.dev), stroke weight 1.75, 20–24 px, drawn in gold
700 on gold 50 plates or sage 600 on sage 50. Squarespace has no Lucide
library built in: export each icon below as an SVG from lucide.dev and upload
it, or use a code block. Only these icons appear on the site.

HeartUsersLightbulbHeartHandshakeSproutSunriseBrainActivityWavesCompassGraduationCapHeartPulseMicVideoCalendarClockCalendarCalendarCheckClockGlobeLockGiftMailCheckCheckCheckShieldCheckArrowRightArrowLeftChevronDownDownloadFileTextFileSignatureClipboardListQuoteLinkRoute

Social icons in the footer are the official LinkedIn and Instagram glyphs,
inline SVG, sand-colored on the dark footer.

**Never** illustrate with brains, neurons, chakras, lotus flowers, or
meditation figures — including as icons. The Brain icon is used once, on the
Approach page, as a label for the neuroscience foundation, and nowhere else.

## Section 07Also in this folder

  * [Starting Point — Logo Reference](Starting%20Point%20-%20Logo%20Reference.html) — every logo file shown at size, on light and dark, with do/don't examples.
  * [Starting Point — Canva Brand Kit Setup](Starting%20Point%20-%20Canva%20Brand%20Kit%20Setup.html) — the same palette and fonts, formatted for loading into Canva's Brand Kit.

Starting Point Consulting01 Brand · Specifications

