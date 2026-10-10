import { createFileRoute } from '@tanstack/react-router'

import guide from '@/content/owner-guide.html?raw'
import { getAdmin } from '@/server/auth'

// The guide file is authored without a document shell (it is also published
// as a shareable page), so split its head and body parts here.
const bodyStart = guide.indexOf('<div class="wrap">')
const headPart = guide.slice(0, bodyStart)
const bodyPart = guide.slice(bodyStart)

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/favicon.ico" sizes="48x48">
${headPart}
</head>
<body>
${bodyPart}
</body>
</html>`

/** Owner's guide, visible only to a signed-in admin. */
export const Route = createFileRoute('/admin/guide.html')({
  server: {
    handlers: {
      GET: async () => {
        const admin = await getAdmin()
        if (!admin) {
          return new Response(null, {
            status: 302,
            headers: { Location: '/admin/login?redirect=%2Fadmin%2Fguide.html', 'Cache-Control': 'private, no-store' },
          })
        }
        return new Response(page, {
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store' },
        })
      },
    },
  },
})
