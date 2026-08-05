# ryantthomas.github.io

My portfolio and résumé. Astro, deployed to GitHub Pages by Actions on push to `main`.

## Where things live

```
src/data/site.yaml        every fact about me — bio, contact, experience, skills
src/content/projects/     one Markdown file per case study
src/content/posts/        blog posts (empty for now)
src/pages/                index, /resume, /work/[slug]
src/layouts/Base.astro    nav + footer shared by every page
src/styles/global.css     one stylesheet, light + dark + print
public/assets/            hand-authored SVG diagrams
```

`site.yaml` is the single source of truth. The homepage and the résumé both read
from it, so a fact is fixed in one place, not six.

## Adding things

**A project** — drop a `.md` file in `src/content/projects/`. The frontmatter is
schema-validated in `src/content.config.ts`; a missing scope line or a bad group
key fails the build rather than rendering a broken card.

**A post** — drop a `.md` file in `src/content/posts/`.

## Running it

```bash
npm install
npm run dev      # localhost:4321, live reload
npm run build    # -> dist/
```

The résumé prints to a clean PDF from the browser (Ctrl/Cmd + P).
