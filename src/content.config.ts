import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Project case studies. The schema is the contract — a project missing a scope
// line or pointing at a group that doesn't exist fails the build rather than
// rendering a half-empty card.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // Which homepage group this sits under; must match a key in site.yaml.
    group: z.enum(['platforms', 'agents', 'tooling']),
    order: z.number(),
    // One-sentence "what is it", shown on the card.
    summary: z.string(),
    // Hard numbers. These are what stop a card reading as a hobby project.
    scope: z.array(z.string()).min(2),
    tech: z.string(),
    // The one line that makes it not generic.
    differentiator: z.string(),
    repo: z.string().url().optional(),
    extraLinks: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    // Set for work that can't be open-sourced; renders a "private repo" note.
    private: z.boolean().default(false),
    diagram: z.string().optional(),
    diagramAlt: z.string().optional(),
    diagramCaption: z.string().optional(),
    description: z.string(),
  }),
});

// Blog posts. Nothing here yet — the collection exists so adding the first
// post is dropping a .md file in, not wiring up a pipeline.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, posts };
