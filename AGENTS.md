<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Common gotchas

- **Showroom address/phone/hours are hardcoded somewhere? Stop.** They live in `lib/showroom.ts` only — the interior pages once shipped a stale "1500 Federal Hwy" address because each page carried its own copy. Import `SHOWROOM` / `DIRECTIONS_URL` instead.
- **`npm run dev` daemonizes.** Next 16's dev server detaches, prints a PID, and ignores a `--port` passthrough (it lands on 3000). Probe `localhost:3000` and `kill <PID>` when done — don't wait on the foreground process.
