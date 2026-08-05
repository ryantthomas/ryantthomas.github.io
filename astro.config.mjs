// @ts-check
import { defineConfig } from 'astro/config';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://ryantthomas.github.io',
  // User site — served from the domain root, so no `base` needed.
  build: { format: 'directory' },
  // Lets `src/data/site.yaml` be imported directly, so facts live in YAML
  // rather than being duplicated across templates.
  vite: { plugins: [yaml()] },
});
