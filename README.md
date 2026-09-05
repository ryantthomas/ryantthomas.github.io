# ryantthomas.github.io

My portfolio: one page, plus a resume tab. Plain HTML and CSS, no build step,
deployed to GitHub Pages by Actions on push to `main`.

## Where things live

```
public/index.html         the whole portfolio: header, projects, contact
public/resume/index.html  resume tab, embeds the live resume repo
public/styles.css         one stylesheet, light + dark
```

The resume itself is not duplicated here. `public/resume/index.html` embeds
[ryantthomas/resume](https://github.com/ryantthomas/resume) live from GitHub
(via jsDelivr), so that repo stays the single source of truth for the resume.

## Editing

Edit `public/index.html` directly, then commit and push to `main`. There is
no build; GitHub Actions publishes `public/` as-is.

Deep-dive case study pages for individual projects will come back later.
