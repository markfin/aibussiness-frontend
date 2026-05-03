# CORS Fix TODO

## Steps to Complete:

- [x] Step 1: Create Next.js API proxy route at \`app/api/bi/route.ts\` to forward requests to backend (localhost:8000 dev, Supabase prod), bypassing CORS.
- [x] Step 2: Update \`app/page.tsx\` to use \`/api/bi\` endpoint (same-origin, works everywhere).
- [ ] Step 3: Test locally with \`npm run dev\`, enter ticker (e.g. NVDA), verify no CORS error and data loads.
- [ ] Step 4: Deploy to Netlify and set server env var \`API_URL=https://hfkkujmvhfpsfujihmhy.supabase.co\`.
- [ ] Complete: Task done.

Current progress: Steps 1-2 ✅ Complete. Now test locally (Step 3).
