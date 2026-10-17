# Emerald Jewel Invite

Build a premium Indian wedding invitation microsite — a single page a guest opens on their phone. This is a luxury product people pay for, so the finish matters far more than the feature count. The benchmark is invitima.com.

THE AESTHETIC — "Mughal Zamarrud"
Palette: deep emerald green with antique gold.
Scene: a Mughal palace gateway at dusk — carved marble jali screens, an emerald-inlaid arch, lit brass lanterns, a still reflecting pool.
Feeling: opulent, candlelit, hushed.

THE ARTWORK IS THE MOST IMPORTANT PART
Generate original illustrations that are photoreal and painterly, in the register of high-end wedding stationery: carved stone and wood with real depth and shadow in the recesses, fabric with weight, warm practical light from lanterns and diyas, reflections on polished marble and still water, and dense crafted detail — inlay, fresco, carving.
NOT acceptable: flat vector, clip art, stock-photo look, plain colour gradients, or a geometric pattern standing in for a scene.

Produce these four image files:
1. sealed-backdrop.jpg (1536x1024) — the full scene holding the closed envelope. Rich and detailed at the edges but with a CALM AREA IN THE CENTRE where the envelope sits.
2. hero-backdrop.jpg (1536x1024) — the scene revealed behind the couple's names. Architecture, florals, depth. THE MIDDLE MUST BE OPEN AND QUIET because the names and date card are drawn on top of it.
3. wax-seal.png (816x816) — a wax seal, transparent background, viewed straight down, thin metallic rim, soft sheen. THE CENTRE MUST BE COMPLETELY BLANK: no letters, no initials, no monogram, no emblem. Our engine prints each couple's own initials onto it.
4. paper-texture.jpg (800x800) — subtle tileable grain in the palette.

Every image: no text, no words, no lettering, no numbers, no watermarks, no human faces.

THE EXPERIENCE, IN ORDER
1. A sealed opening: the whole screen is the painted scene with one closed wax-sealed envelope in it, a small "Tap to open" plate, and the couple's names in gold script beneath. No navigation, no header, no scrollbar. One tap opens it with a slow weighted animation of about 1.5 seconds.
2. A cinematic reveal of about 6 seconds: backdrop settles, names fade up, then the page becomes scrollable. One continuous motion into the same page, not a second screen.
3. Music fades in over 8 seconds to about 60% volume, and only after the tap. Prime it muted on the tap gesture so mobile browsers allow playback. Keep the seal-tap sound and the background music as two separate audio elements.
4. A scratch-to-reveal date card: a gold foil panel the guest rubs with a finger; at about 38% cleared it auto-reveals the date and time then unmounts so the page scrolls normally. Also keyboard accessible.
5. Scrollable sections below: venue with a Google Maps link, a live countdown, the ceremony programme (Mehendi, Sangeet, Wedding, Reception), a photo gallery, a quote, and a closing panel.

BUILD RULES
Mobile first, 320px to 4K — nearly every guest opens this on a phone. Define all colours as CSS custom properties on :root and never hardcode a colour inside a component. Use two Google Fonts: a display serif for names and headings, a clean sans for labels and counters. Anchor the countdown and all dates to an explicit +05:30 offset, never the guest's own clock. Respect prefers-reduced-motion. Use placeholder content: "Aarav & Anaya", 14 February 2027, "The Grand Pavilion".

WHEN YOU FINISH, TELL ME
1. Every colour as a hex value, labelled by role: accent, accent-soft, tint, paper, paper-light, paper-dark, highlight, surface, scratch-foil, scratch-ink, background, foreground, muted, border.
2. The two Google Font names.
3. Where the four image files are in the project.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/47422d54-8bdf-4fad-aa2c-05dc5a5bb56c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
