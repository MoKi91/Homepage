import { z } from 'astro/zod';
import raw from '../content/quality.json';

const schema = z.object({
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'expected owner/name'),
  intro: z.string(),
  pipeline: z.array(z.string()).min(1),
  risks: z.array(z.object({ risk: z.string(), coverage: z.string() })).min(1),
});

export type Quality = z.infer<typeof schema>;

// Throws at build time on invalid data.
export const quality: Quality = schema.parse(raw);
