# interview-prep

Practice platform for a **Media Strategy Analyst** interview at **Kepler Group** — and, more generally, for analyst roles at performance-marketing and media agencies.

**Live site:** https://cameronjtoy.github.io/interview-prep/

## Features

- **Question bank** — 105 technical and non-technical questions across 8 categories (behavioral, company & industry, media strategy, marketing fundamentals, measurement, Excel & SQL, case studies, estimation). Each has key points, and many have sample answers and tips. Filter by category, type, difficulty, or your own status, and search.
- **Flashcards** — study any filtered set; <kbd>Space</kbd> flips, <kbd>←</kbd>/<kbd>→</kbd> navigate.
- **Mock interview** — a timed, randomized set (5/8/12 questions, balanced or focused mix). Take notes, reveal key points, rate yourself 1–5, and get a summary by category.
- **Exercises** — 25 checkable problems: metric math (CPM, CTR, CPA, ROAS), profitability, planning, incrementality, campaign-table analysis, SQL, and Excel.
- **Progress tracking** — mark questions confident / needs work; progress is saved in your browser's localStorage.

Question sources are noted on each card. Company-specific tags (Kepler, Merkle, Horizon Media, Mindshare/GroupM) mean a question or a close variant was reported by candidates on Glassdoor; the rest are standard agency-analyst questions.

## Password

The site shows a password screen before anything loads. Once unlocked, the browser remembers it until you click **Lock** in the footer.

To change the password, generate its SHA-256 hash and replace `PASSWORD_HASH` in `src/components/PasswordGate.tsx`:

```bash
printf '%s' 'new-password' | sha256sum
```

This keeps casual visitors out, but it is not real security: GitHub Pages is static hosting, the app's JavaScript is public, and so is this repository.

## Development

```bash
npm install
npm run dev       # http://localhost:5173/interview-prep/
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

## Adding or editing content

- Questions: `src/data/questions/<category>.ts`
- Exercises: `src/data/exercises.ts`
- Company / role profile and category names: `src/data/role.ts` — change this to retarget the site at another company or role.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages.

One-time setup: in the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

If you rename the repository, update `base` in `vite.config.ts` to match.
