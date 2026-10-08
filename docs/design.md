# DiveDex implementation scope

Approved scope: the seven frames in the user's screenshot, in the requested Divedex_Vibe_Coding folder. React, TypeScript and Vite, with the Figma design as the visual source. Identify is deferred.

Use shared page scaffolding, status bar, navigation, cards and native dialogs. Use hash routes for static hosting and URL search parameters for collection filters. Only the selected area is persisted, with graceful fallback when browser storage is unavailable. The application uses Figma example data; no external backend is required.

Mobile targets: Collection 390×930, Species Detail 390×985, Explore 390×1454, Choose an area 390×844, Palau 390×1198, Green Turtle 390×1183, Ocean Note 390×876. Source colors: background #f5f3ed, primary #123e59, ink #172b36, secondary #63737a, borders #dce2e1, tint #e5eef1. Inter is loaded locally.

Large-screen adaptation: centered 960px shell; collection four-column grid, Explore two-column sections, reading pages max-width 720px. Navigation remains sticky and dialogs stay within the viewport.

Verify build, local assets, all seven mobile screens, search/filter states, modal navigation, area persistence, return destinations, image geometry, keyboard dismissal, and 320px/768px/1440px layouts. Document unsupported flows without fabricating completed functionality.
