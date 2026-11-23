# National Park Visit Planner

Peterson Cordeiro's WDD 330 personal project. Explore U.S. National Park Service sites, search for parks, filter by state, and view a park's details.

Built with HTML, CSS, and vanilla JavaScript ES modules. There are no application frameworks or JavaScript libraries. Node is used to prepare static files and run ESLint.

## Local setup

Requires Node.js 22.16+ and Python 3 (for the local static server).

1. Run `npm install`.
2. Copy `.env.example` to `.env` and replace the placeholder with your NPS API key.
3. Run `npm run dev`.
4. Open <http://127.0.0.1:5173>.

The build reads `.env` and creates `build/`. Both `.env` and `build/` are ignored by Git. After source changes, run `npm run build` again; refresh the browser. Run `npm run lint` to check JavaScript.

## Render static site

Use the existing Render **Static Site** connected to this repository:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Root directory | Leave blank |
| Build command | `npm ci && npm run build` |
| Publish directory | `build` |
| Environment variable | `NPS_API_KEY` set to your own key |

`build` is the chosen output directory. `dist` is another common name, but the folder configured in Render must match the build script's output. The two HTML pages are real files, so no single-page-app rewrite is needed.

The build writes `build/js/config.mjs` from the environment variable. The key is excluded from tracked source files, but it **is visible in the built JavaScript and browser requests**. Static hosting cannot keep a browser API key secret. A server-side proxy would be needed to keep it private. Never commit `.env` or generated configuration.

## Week 5

- Shared responsive layout, proposal colors, Arial typography, and mountain/trail icon.
- Explore page with live NPS results, keyword search, state selection, and 12 results per page.
- Search parameters stay in the URL; details link back to the same results.
- Park Details page with name, description, state, photo/credit, and official NPS website.
- Loading, empty, failure/retry, missing-photo, and invalid-park messages.
- CSS loading animation with a reduced-motion alternative.

Search uses the NPS keyword search, which can match information beyond the park's name. The list includes all types of NPS sites, including national parks, monuments, and historic sites.

Week 6: park alerts, seven-day weather, Celsius/Fahrenheit selection, favorites/Saved view, and one editable visit note per park. Favorites, notes, and the selected unit will use localStorage.

Week 7: visual refinement, accessibility and responsive checks, bug fixes, and final publication/submission.

## Files

- `index.html`, `js/main.js`: Explore page and control events.
- `js/parks-list.mjs`: result cards and pagination requests.
- `js/nps.mjs`: shared NPS API requests.
- `park.html`, `js/park.js`: selected park information.
- `css/style.css`: shared styles and responsive layout.
- `scripts/build.mjs`: copy static files and generate browser configuration.

## Data sources

Park information and photography: [National Park Service API](https://www.nps.gov/subjects/developer/). Photo credits are shown on each park's details page. This student project is not affiliated with the NPS.

Weather planned for Week 6: [Open-Meteo](https://open-meteo.com/en/docs). Its free noncommercial forecast API does not require an API key. Weather data attribution will be included with the forecast.
