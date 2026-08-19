#!/usr/bin/env bash
#
# Publish the client-review preview.
#
#   npm run preview
#
# Builds a static export and pushes it to the PUBLIC preview repo, which is the
# only thing the client ever sees: no source, no notes, no transcript. This repo
# stays private, which is why the preview cannot simply be GitHub Pages on this
# one — a free plan will not serve Pages from a private repo.
#
# The build is force-pushed as a single commit: the preview repo is a publishing
# target, not a history. Its history is this repo's history.
set -euo pipefail

PREVIEW_REPO="vip-leasing-preview"
PREVIEW_OWNER="Sigovs"
BASE="/${PREVIEW_REPO}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "▸ building static export (basePath ${BASE})"
rm -rf out
GITHUB_PAGES=true PAGES_BASE="$BASE" npm run build

# Pages runs the output through Jekyll otherwise, and Jekyll ignores every
# directory starting with an underscore — including _next, i.e. all of the CSS
# and JavaScript.
touch out/.nojekyll

echo "▸ sanity check: no unprefixed assets"
if grep -rqE '(src|href|poster)="/(ilusso|showcase|brands|closing|hero|logo)' out; then
  echo "  ✗ found asset paths without the ${BASE} prefix — they will 404 on the preview."
  echo "    Route them through lib/asset.ts (see docs/session/SESSION.md)."
  exit 1
fi
echo "  ✓ clean"

echo "▸ pushing to ${PREVIEW_OWNER}/${PREVIEW_REPO}"
TMP="$(mktemp -d)"
cp -R out/. "$TMP/"
cd "$TMP"
git init -q -b main
# The export ships two videos and ~200 photographs; the default 1MB HTTP buffer
# makes git hang up mid-push over HTTPS ("RPC failed; curl 55").
git config http.postBuffer 524288000
git config http.version HTTP/1.1
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999
git add -A
git -c user.name="$(git -C "$ROOT" config user.name)" \
    -c user.email="$(git -C "$ROOT" config user.email)" \
    commit -q -m "Preview build $(git -C "$ROOT" rev-parse --short HEAD)"
git remote add origin "https://github.com/${PREVIEW_OWNER}/${PREVIEW_REPO}.git"
git push -qf origin main
cd "$ROOT"
rm -rf "$TMP"

echo
echo "✓ live at https://sigovs.github.io/${PREVIEW_REPO}/"
echo "  (Pages takes ~30s to pick up a new build)"
