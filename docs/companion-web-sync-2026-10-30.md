# DiveDex companion web sync · 30 October 2026

Approved Figma file: fcbAdLWiwl1fn8im60FEgd. Main sources: Home 509:3559, at-the-spot 965:5484, after-dive 965:5561; Explore 427:2817, 947:5512, 947:5557; Raja Ampat 975:5727, 975:5787, 975:5846; correction prompt 965:5916.

## Shipped locally

- Three Home stages, compact dismissible selector, full first-screen hero and identification entry.
- Confirmed Home location and Explore browsing area are separate. Browsing another destination never infers the user travelled there.
- Native location dialog with browser geolocation on explicit request, nearby matching for the two sample regions, retry, permission-error handling, searchable manual selection, and an explicit unknown-area state. Coordinates are transient and are not written to storage or sent to a server.
- Explore keeps its category in the URL. Changing Amed/Raja Ampat updates maps, recommendations, species and activities. Details retain area context.
- Interest/experience personalization, saved destination ideas, camera-learning and prep flows.
- Previous identification, Collection, species knowledge and account prototype flows preserved. The long tour no longer opens automatically; it remains available from Help.

## Data boundaries

Maps, wildlife distribution, seasonal recommendations, activities, AI guidance and study submissions remain illustrative. GPS only proposes a supported region after permission; user confirmation is required. No live seasonal feed, generative AI service, booking system or research submission was added. Preferences and saved ideas persist in the same browser/origin only.

## Assets

The five animal photographs match the Figma design. Manta, turtle and clownfish MCP exports returned transparent 32-pixel placeholders, so the exact existing source photos from public/v2 were reused. Tang, idol, Amed map and both intrinsic-size Raja Ampat SVGs were downloaded from design-context assets. New durable files are in public/v3/companion; no expiring asset URLs are used at runtime.

## Verification

- npm test: existing V1/V2/V3 asset checks, companion data checks, TypeScript and production build.
- git diff --check.
- Isolated Chromium: stage persistence; geolocation confirmation using simulated coordinates; manual search; category-preserving location switches; area-specific details; unknown-location fallback; personalization.
- 390×844, 375×812, 360×640: complete first-screen sections, no horizontal overflow or browser errors.

Preview: http://127.0.0.1:5174/#/v3/home. No public deployment or Git push performed.
