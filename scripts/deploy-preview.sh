#!/usr/bin/env bash
#
# Publish the client-review preview.
#
#   npm run preview
#
# Builds a static export and force-pushes it to the gh-pages branch of THIS
# repo, which GitHub Pages serves at https://sigovs.github.io/VIP-LEASING/.
#
# The reference project kept its preview in a separate repo because its source
# repo was private and Pages will not serve from a private repo on a free plan.
# This source repo is already public, so the separation buys nothing and a second
# repo is one more thing to create and keep in sync.
#
# The branch is force-pushed as a single commit: it is a publishing target, not
# a history. Its history is this repo's history.
set -euo pipefail

PREVIEW_REPO="VIP-LEASING"
PREVIEW_OWNER="Sigovs"
PREVIEW_BRANCH="gh-pages"
BASE="/${PREVIEW_REPO}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "▸ building static export (basePath ${BASE})"
rm -rf out
# MSYS_NO_PATHCONV is for Git Bash on Windows, which rewrites anything shaped
# like a unix path before a native program sees it — PAGES_BASE=/VIP-LEASING
# reached node as C:/Program Files/Git/VIP-LEASING and the build refused it.
# Scoped to this one command on purpose: exported, it breaks the git calls
# further down, which need their /c/... paths converted.
MSYS_NO_PATHCONV=1 GITHUB_PAGES=true PAGES_BASE="$BASE" npm run build

# Pages runs the output through Jekyll otherwise, and Jekyll ignores every
# directory starting with an underscore — including _next, i.e. all of the CSS
# and JavaScript.
touch out/.nojekyll

echo "▸ sanity check: every referenced image exists"
node scripts/check-assets.mjs

# Nothing in out/ may exceed what the remote will accept. The export copies the
# whole of public/, so one oversized file dropped in there sails through the
# build and is only refused at the far end, after the push — which is exactly
# how a 134MB video master got this far once. Catch it here instead.
echo "▸ sanity check: no file too large for the remote"
BIG="$(find out -type f -size +90M -printf "%p (%sB)
" 2>/dev/null || true)"
if [ -n "$BIG" ]; then
  echo "  ✗ over GitHub's 100MB per-file limit:"
  echo "$BIG"
  echo "    Move it out of public/ — ignoring it is not enough, the export copies it."
  exit 1
fi
echo "  ✓ clean"

echo "▸ sanity check: no unprefixed assets"
if grep -rqE '(src|href|poster)="/(ilusso|showcase|site|video|brands|closing|hero|logo)' out; then
  echo "  ✗ found asset paths without the ${BASE} prefix — they will 404 on the preview."
  echo "    Route them through lib/asset.ts (see docs/session/SESSION.md)."
  exit 1
fi
echo "  ✓ clean"

echo "▸ pushing to ${PREVIEW_OWNER}/${PREVIEW_REPO} (${PREVIEW_BRANCH})"
TMP="$(mktemp -d)"
cp -R out/. "$TMP/"
cd "$TMP"
git init -q -b "$PREVIEW_BRANCH"
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
git push -qf origin "$PREVIEW_BRANCH"
cd "$ROOT"
rm -rf "$TMP"

echo
echo "✓ live at https://${PREVIEW_OWNER}.github.io/${PREVIEW_REPO}/"
echo "  (Pages takes ~30s to pick up a new build)"
