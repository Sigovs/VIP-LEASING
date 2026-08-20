# Source images

The client's original frames, as supplied — full resolution, untouched.

The site does not serve these. The web-sized versions it actually uses live in
`public/site/` (2000px, JPEG q82) and, for the Lookbook sets, `public/showcase/`.
Regenerate one with:

    sips -s format jpeg -s formatOptions 82 -Z 2000 source-images/<file> --out public/site/<name>.jpg

Kept in the repo so the originals are not on one machine only. They are NOT in
`app/` on purpose: every folder under `app/` is scanned as a route by the App
Router, and 35MB of PNGs have no business in a routing tree.

Supplied 19 Aug 2026. Which frame went where is recorded in the commit
"New background photography, and the borrowed footage goes with it".
