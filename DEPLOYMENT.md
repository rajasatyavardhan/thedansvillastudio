# Dansvilla deployment

The authoritative public website entry is root `index.html`. Root `vercel.json`
selects the static preset and runs `node build-static.mjs` without third-party
packages. It copies the explicit public file list into `dist/`; existing
`api/send-enquiry.js` remains the Vercel endpoint and uses GOOGLE_SCRIPT_URL.

The second Vercel project `dansville` also deploys the matching `website/` copy.
Keep root and website/index.html synchronized while both projects are connected.

The original TanStack scaffold remains in src/ with its original dependency
manifest and lockfile archived as non-active files in legacy-tanstack/.
It is not installed or built as part of the public HTML website.
Upgrade and validate that separate app before restoring its package manifest.
