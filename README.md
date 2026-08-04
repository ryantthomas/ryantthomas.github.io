# ryantthomas.github.io

My portfolio site. Plain HTML and CSS — no build step, no dependencies, no JS.

```
index.html      the whole pitch: fold, projects, experience, education
style.css       one stylesheet, light + dark via prefers-color-scheme
assets/         hand-authored SVG diagrams
work/           one case study per project
```

Edit, commit, push. GitHub Pages serves `main` from the root.

To preview locally:

```bash
python -m http.server 8000
```

The résumé is a separate repo, served at [/resume](https://ryantthomas.github.io/resume/).
