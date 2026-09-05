# ryantthomas.github.io

My portfolio: one page, plus a resume tab. Plain HTML and CSS, no build step,
deployed to GitHub Pages by Actions on push to `main`.

## Directory

```
public/index.html         the whole portfolio: header, projects, contact
public/resume/index.html  resume tab, embeds the live resume repo
public/styles.css         one stylesheet, light + dark
public/resume/index.html  embeds[ryantthomas/resume](https://github.com/ryantthomas/resume) live from GitHub (via jsDelivr), so that repo stays the single source of truth for the resume.
```
