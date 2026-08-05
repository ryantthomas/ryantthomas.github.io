import { z } from 'astro/zod';
import raw from './site.yaml';

/**
 * site.yaml is hand-edited, and YAML fails quietly. An unquoted value
 * containing ": " parses as a mapping rather than a string, which silently
 * dropped a résumé bullet from both pages once. Validating here turns that
 * class of mistake into a build failure instead of missing content.
 */
const bullet = z.string().min(1, 'bullet must be a string — quote any value containing ": "');

const schema = z.object({
  name: z.string(),
  role: z.string(),
  lede: z.string(),
  stack: z.array(z.string()).min(1),
  availability: z.string(),
  location: z.string(),
  locationNote: z.string(),
  contact: z.object({
    email: z.string().email(),
    github: z.string().url(),
    githubLabel: z.string(),
    linkedin: z.string().url(),
    linkedinLabel: z.string(),
    phone: z.string(),
  }),
  groups: z.array(z.object({
    key: z.enum(['platforms', 'agents', 'tooling']),
    title: z.string(),
    intro: z.string(),
  })).min(1),
  experience: z.array(z.object({
    role: z.string(),
    org: z.string(),
    place: z.string(),
    dates: z.string(),
    bullets: z.array(bullet).min(1),
  })).min(1),
  education: z.object({
    degree: z.string(),
    school: z.string(),
    place: z.string(),
    date: z.string(),
  }),
  skills: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
});

const parsed = schema.safeParse(raw);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  site.yaml → ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  throw new Error(`site.yaml failed validation:\n${issues}`);
}

export type Site = z.infer<typeof schema>;
export default parsed.data;
