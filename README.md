# ColdFact.ai

Pre-launch marketing landing page for **ColdFact** — a tool concept that reads
a 60-second speech sample and returns three blunt signals: **FACT**, **FORCE**,
**FOG**. The page is explicit that this is not a lie detector and not a
verdict on the speaker — it scores concreteness, rhetorical pressure, and
vagueness in one sample.

## What this repo is

A static site: `index.html` + `styles.css` + `app.js`, no build step, no
framework, no backend. The "Run demo" section on the page is a scripted
mock (fixed scenarios in `app.js`) — it does not call any API or upload
audio; nothing typed into the demo leaves the browser.

## Run it locally

No build step required.

```bash
open index.html
```

or serve it locally, e.g.:

```bash
python -m http.server 8000
```

## Live URL

Not currently live at a custom domain (`coldfact.ai` DNS is not pointed
here yet — see commit history). Update this section once the site is
deployed.

## License

See [LICENSE](LICENSE). Copyright is retained; this is not published under
an open-source license.
