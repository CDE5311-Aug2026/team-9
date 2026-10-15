# DiveDex V2 clickable prototype

Source: Figma file fcbAdLWiwl1fn8im60FEgd, page 190:399 (UI Design V2 · Blue / Black / White).

## Entry points

- `/#/v2/home`: existing-user home; also the root URL default.
- `/#/v2/welcome`: replay the first-use experience.
- Existing V1 URLs (`/#/collection`, `/#/explore`) remain available.

## Implemented journeys

- Home, five-position navigation and recent finds.
- Sample photo/video library, selection, simulated analysis, result expansion, candidate choice, unidentified status, bulk and individual saves, optional quiz.
- Collection categories, search, map markers, timeline, species and observation details.
- Explore, manual area selection, species guide, sample study, contribution review, optional photo consent, confirmation and contribution withdrawal status.
- Sample cleanup information.
- Profile, account/privacy/location information, demo notification preference.
- Welcome, introduction, sample first identification, account invitation, input validation, illustrative email verification and resumed first save.

## Implementation boundaries

React + TypeScript + Vite, plain scoped CSS, local Manrope and Instrument Serif fonts, local Figma exports. All primary navigation uses hash URLs. Collection species additions, selected region, guest status and sample contribution state persist in localStorage under `divedex.v2.*`. No passwords are stored. Identification uses a fixed demonstration result set, not the selected image content. Media selection uses the Figma sample library, not device uploads. The map is the Figma schematic sample, not a geographic service. Login, email, research submission, location access and account deletion do not call real services. Secondary state variations are represented with interactive components rather than a separate route per Figma frame.

## Verification (14 Oct 2026)

- TypeScript and Vite production build pass.
- Existing 82 Figma asset validation passes; 110 V2 local asset references checked.
- Browser exercised photo selection → analysis → results → bulk save → collection, category/map/timeline, guest identification → invitation → signup → verification → resumed save, study → optional consent → contribution confirmation → contributions, and video selection → analysis → results.
- Checked 390px and 320px viewport layouts; 320px document width equals scroll width. Desktop displays a centered phone-size prototype.
- Browser error log was empty during the exercised flows.

This is a functional frontend prototype, not a live identification or research platform.
