import { describe, expect, it } from 'vitest';
import raw from '../../src/content/cv.json';
import { cv } from '../../src/lib/cv';

// Collect every key and string value so the checks hold for any nesting.
function walk(value: unknown, keys: string[] = [], strings: string[] = []) {
  if (typeof value === 'string') strings.push(value);
  else if (Array.isArray(value)) value.forEach((v) => walk(v, keys, strings));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      keys.push(k);
      walk(v, keys, strings);
    }
  }
  return { keys, strings };
}

describe('cv.json contract', () => {
  it('passes the schema', () => {
    expect(cv.name).toBeTruthy();
  });

  it('contains public data only (no phone, birth date or street address)', () => {
    const { keys, strings } = walk(raw);
    expect(keys.filter((k) => /phone|mobile|tel|birth|dob|address|street/i.test(k))).toEqual([]);
    // Phone-like numbers: 8+ digits with optional separators; month ranges like 2019-01 are shorter.
    expect(strings.filter((s) => /\+?\d[\d\s/()-]{8,}\d/.test(s))).toEqual([]);
  });

  it('has date ranges that start before they end', () => {
    for (const item of [...cv.experience, ...cv.education]) {
      if (item.end) expect(item.start <= item.end, `${item.start} > ${item.end}`).toBe(true);
    }
  });

  it('has at most one open-ended (current) role', () => {
    expect(cv.experience.filter((e) => e.end === null).length).toBeLessThanOrEqual(1);
  });

  it('lists experience newest first', () => {
    const starts = cv.experience.map((e) => e.start);
    expect(starts).toEqual([...starts].sort().reverse());
  });
});
