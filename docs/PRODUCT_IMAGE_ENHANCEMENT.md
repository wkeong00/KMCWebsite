# Product image enhancement — 2026-10-31

Generated with the built-in image_gen tool. Originals remain in src/Assets/optimized. Only src/data/products.js imports changed; product records and models remain unchanged.

Prompt set: edit the supplied low-resolution product photo into a high-resolution realistic catalog photograph. Preserve product identity, silhouette, proportions, viewpoint, color, lighting, and component placement. Restore crisp metal edges and subtle surface texture. No redesign, additional objects, text, labels, or comparison panels. White background for trays, first two steamers and trolley; preserve alpha transparency for thirdgen and fourth.

Tray constraints:
- JS20108 / JS20208: 15 oblong cavities, 3 columns × 5 rows.
- JS20308: 15 circular cavities, 5 columns × 3 rows.
- JS30108: 18 oblong cavities, 3 columns × 6 rows.
- JS30208: 12 oblong cavities, 2 columns × 6 rows.
- JS30308: 7 vertical oblong cavities in one row.

Equipment constraints: preserve doors and open/closed state, hinges, handles, piping, control panels, wheels, rails, and relative positioning. Fine detail is AI reconstructed and should be checked against the physical equipment before publication.

Web assets: src/Assets/enhanced (JPEG quality 92 for opaque photos; PNG for transparent photos). Lossless opaque masters are retained locally under artifacts/product-enhancement/masters (ignored by Git).
