# Verification — 8 October 2026

## User flow

Collection → search/category → Clown Anemonefish detail → Collection → Explore → Choose an area → Palau → Green Turtle / Ocean Note → return to the selected region.

## Passed

- `npm test`: 82 local Figma files exist and are non-empty; SVGs retain their intrinsic dimensions; source contains no temporary Figma asset URLs; strict TypeScript check and Vite production build pass.
- Collection: Turtles filter returns Green Turtle; scientific-name search `rhincodon` returns Whale Shark; nonexistent query shows a clear empty state; Clear filters restores the four supplied specimens.
- Clownfish opens the species detail and returns to My Collection.
- Area search `pal` narrows to Palau; selection updates the page and shows the designed no-cleanups state. Reload retains Palau. Returning from turtle and article details retains the originating region.
- Area dialog closes with Escape, unlocks scrolling, and returns focus to Selected area. Native dialogs contain keyboard focus and make background content inert.
- View all opens the regional list; a specimen information dialog can be opened and dismissed without losing the list.
- Reference mobile screens inspected against the supplied Figma renders. Collection, detail art, reference photography, navigation SVGs and article icons load from local files. Browser inspection confirms icon intrinsic geometry (14/16/18/20/21/24/26px as appropriate), 350×232 turtle image, 350×158 article photo, 88×88 Explore cards and 64.516×64.516 Palau note thumbnails.
- 320px: Collection, species detail, Palau, Green Turtle and Ocean Note have no horizontal overflow and all images load.
- 768px: Collection and Explore have no horizontal overflow and images load.
- 1440px: centered Collection shell is 960px with four 208px grid columns; Explore uses two columns; reading layout is constrained to 720px. No horizontal overflow.
- Browser console inspection reported no errors or warnings during the tested core flows.

## Boundaries

This is a local frontend using the supplied Figma dataset, not a live account or identification service. Location permission success/denial was not exercised against the user's real device location; the optional browser API is only called on explicit user interaction and has timeout/error fallback. Unsupported identification, full review, upload and registration actions show explanatory messages. Only the seven requested frames are fully implemented.

Reference screenshots and browser geometry logs are stored locally in `output/` and excluded from Git. One image-loading check ran before route images finished loading; checking the loaded page passed with no missing assets.
