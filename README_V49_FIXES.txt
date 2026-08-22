DANSVILLA CAMPAIGNS — v49 FIXES
=================================

WHAT WAS WRONG (found by checking your actual GitHub repo)
Your repo doesn't use an "assets" subfolder at all — the flyer/video
files you uploaded are sitting directly in the repo root, right next
to index.html (e.g. "josh-dancetrotter-flyer.jpg", not
"assets/josh-dancetrotter/josh-dancetrotter-flyer.jpg"). My index.html
was still looking for the assets/ subfolder versions, so both files
404'd. Fixed: index.html now points at the flat, root-level paths
that match how you actually upload.

Also fixed:
- The "0 seats" JOSH-booking email: the two campaigns' scriptUrl
  values are pointing at the same Apps Script somewhere, so a JOSH
  registration was landing in the Hai Garmi sheet/script, which
  doesn't have adults/kids fields — hence "0 seat(s)". I added a
  safety check to BOTH Apps Scripts (below) that now REJECTS a
  submission if it doesn't match the campaign it's supposed to be
  for, so this fails with a clear error instead of silently saving
  wrong data. You'll still need to double check the two scriptUrl
  lines in index.html and make sure each has ITS OWN correct URL —
  see "TO DO" below.
- The invisible dropdown text: the Age Group / Already Training /
  etc. dropdowns had white text with no background set on the popup
  list, so it was unreadable until highlighted. Fixed with an
  explicit dark background on the dropdown options.

FILES IN THIS FOLDER (all go directly in your repo ROOT — no subfolders)
- index.html — replaces your current one.
- hai-garmi-flyer.jpg
- josh-dancetrotter-flyer.jpg
- josh-dancetrotter-teaser.mp4
- google_apps_script_josh_dancetrotter.js — updated with the safety
  check. If you already deployed the old version, replace the code
  in that same Apps Script project and re-deploy (Deploy > Manage
  deployments > Edit > New version) rather than creating a new one,
  so the URL stays the same.
- google_apps_script_hai_garmi.js — same update, for Hai Garmi's
  script.

TO DO ON YOUR END
1. Upload these 6 files to the repo root (github.com/rajasatyavardhan/
   thedansvillastudio) — same level as your existing index.html,
   package.json, etc. No new folders.
2. Open index.html and find the two lines that look like:
       scriptUrl: 'https://script.google.com/macros/s/.../exec',
   One is inside the Hai Garmi entry, one inside the JOSH entry
   (search for "scriptUrl" — they're a few hundred lines apart).
   Confirm each one has the CORRECT script's URL — not the same URL
   twice. If you're not sure which is which, paste me both lines and
   I'll tell you.
3. If you already deployed either Apps Script before, update its
   code in place (see above) so the campaignId safety check is live,
   then re-test a booking on each form.
