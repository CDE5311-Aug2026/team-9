# DiveDex

A responsive React + TypeScript + Vite implementation of the DiveDex Figma designs. Built with reusable components, plain CSS, and locally stored original Figma artwork, photography, SVG icons, and Inter fonts.

## Run locally

Requires Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open the address printed by Vite (normally http://localhost:5173).

```sh
npm test        # Verify assets, run TypeScript checks, and build for production
npm run build  # Production output in dist/
npm run preview
```

## Implemented screens

| Screen | Route | Figma node |
| --- | --- | --- |
| My Collection | `/#/collection` | `94:2468` |
| Species Detail — Clown Anemonefish | `/#/collection/clown-anemonefish` | `94:2529` |
| Explore — Bali | `/#/explore/bali` | `98:13593` |
| Choose an area | `/#/explore/bali/areas` | `98:13685` |
| Explore — Palau | `/#/explore/palau` | `98:13756` |
| Explore — Green Turtle | `/#/explore/bali/green-turtle` | `98:13825` |
| Ocean Note — Identification | `/#/explore/bali/notes/identification` | `98:13860` |

Figma: https://www.figma.com/design/fcbAdLWiwl1fn8im60FEgd/Divedex

## Interactions

- Collection searches common and scientific names, supports category filters, and shows a clear empty state. Search and filter state are encoded in the URL.
- Clownfish opens the designed species detail; the other three collection cards show their available specimen information.
- Explore opens Green Turtle and the identification article. Both return to the originating region.
- The area sheet supports search, selection, backdrop dismissal, Escape, native dialog focus containment, and focus restoration. Selected area persists locally when storage is available.
- Optional location access is requested only after clicking “Use My Location”. Coordinates are used locally to check coverage in Bali or Palau and are never stored or sent to a service. Permission denial, timeouts, unsupported locations, and empty search are handled.
- “View all” opens the available regional species. Other visible actions show concise information or an honest coming-soon message.
- Hash routing keeps refreshes and deep links working on a simple static host without rewrite rules.

## Scope and fidelity

The source designs are 390px mobile frames. Their content, palette, typography, margins, card sizes, artwork and icon placement are preserved. At 700px and above, collection cards form four columns and Explore sections use two columns inside a centered layout. Desktop behavior is an implementation choice because the supplied frames do not define desktop layouts.

The decorative iOS status and home indicators are retained to match the Figma presentation; they do not report device state. Bottom navigation remains available while scrolling. Original SVG intrinsic dimensions are preserved. `docs/asset-manifest.json` maps assets back to their source screens; identical shared icons are reused.

This is a frontend prototype with Figma example content. The “25 species” and “3 results need review” labels are the original design copy; the four visible collection specimens are the supplied dataset. No account backend, live species API, AI identification, uploads, review workflow, or real cleanup registration is connected. Raja Ampat and Amed can be selected but explicitly show that their species guides are not yet available.

The unusual tiny text sizes returned for two Figma component instances (observation card and Palau notes) have been matched to the visible reference render using readable 15px/12–13px text.

## Structure

- `src/pages/` — Collection, Explore, area sheet, and detail screens.
- `src/components/UI.tsx` — shared navigation, modal, cards, search, and icon components.
- `src/styles.css` — Figma design tokens, layout, responsive rules, and reduced-motion support.
- `src/assets.ts` — local asset paths.
- `public/assets/` — original Figma exports; no temporary remote asset URLs.
- `docs/verification.md` — browser checks and known boundaries.

Design content and artwork come from the supplied Figma file. No additional license is assumed.
