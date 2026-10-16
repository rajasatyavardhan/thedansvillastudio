# Dansvilla website deployment

Vercel project `dansville` deploys `website/` as its Root Directory, with Framework Preset Other, empty install/build commands, and output directory `.`. This contains the V64 HTML website, media, student profile, and existing enquiry endpoint. The endpoint still uses GOOGLE_SCRIPT_URL.

The older React/TanStack scaffold remains at the repository root for reference. It is not installed, built, or served by this deployment. Upgrade and validate its dependencies before using that separate application. Do not enable the vulnerable TanStack override.

For future updates, edit `website/index.html` and adjacent assets. Keep the root HTML copy synchronized for the existing root-based hosting workflow.
