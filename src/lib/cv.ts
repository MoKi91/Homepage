import { z } from 'astro/zod';
import raw from '../content/cv.json';

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'expected YYYY-MM');

const schema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  photo: z.object({ alt: z.string().min(1) }),
  links: z.object({ email: z.string().email(), linkedin: z.string() }),
  summary: z.array(z.string()).min(1),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      location: z.string(),
      start: month,
      end: month.nullable(),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      location: z.string(),
      start: month,
      end: month,
      note: z.string().optional(),
      grade: z.string().optional(),
      focus: z.array(z.string()).optional(),
    }),
  ),
  skills: z.array(z.object({ category: z.string(), items: z.array(z.string()) })),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      date: month,
      status: z.enum(['achieved', 'in_preparation']),
    }),
  ),
  languages: z.array(z.object({ name: z.string(), level: z.number().int().min(1).max(5) })),
});

export type CV = z.infer<typeof schema>;

// Throws at build time on invalid data.
export const cv: CV = schema.parse(raw);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonth(value: string): string {
  const [year, month] = value.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
}

const LEVELS: Record<number, string> = {
  1: 'Basic',
  2: 'Elementary',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Native / fluent',
};

export function languageLevel(level: number): string {
  return LEVELS[level] ?? String(level);
}

export function certificationStatus(status: CV['certifications'][number]['status'], date: string): string {
  return status === 'achieved' ? formatMonth(date) : `In preparation (${formatMonth(date)})`;
}
