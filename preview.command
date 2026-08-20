#!/usr/bin/env bash
# Double-click me. Starts the dev server and opens the site.
#
# Next 16's dev server daemonizes — it detaches, prints a PID and always lands
# on 3000 — so this cannot just wait on the process. It starts it, polls the
# port, and opens the browser once the port actually answers.
cd "$(dirname "$0")" || exit 1

PORT=3000
URL="http://localhost:$PORT"

if curl -s -o /dev/null --max-time 2 "$URL"; then
  echo "▸ already running"
else
  echo "▸ starting the dev server…"
  [ -d node_modules ] || { echo "▸ first run — installing dependencies"; npm install; }
  npm run dev > /tmp/vip-leasing-dev.log 2>&1 &
  printf "▸ waiting for %s " "$URL"
  for _ in $(seq 1 60); do
    curl -s -o /dev/null --max-time 2 "$URL" && break
    printf "."; sleep 1
  done
  echo
fi

if curl -s -o /dev/null --max-time 3 "$URL"; then
  echo "▸ opening $URL"
  open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null
else
  echo "✗ it did not come up. Log: /tmp/vip-leasing-dev.log"
  tail -20 /tmp/vip-leasing-dev.log
  read -r -p "press return to close"
fi
