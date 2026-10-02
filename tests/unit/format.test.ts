import { describe, expect, it } from 'vitest';
import { certificationStatus, formatMonth, formatRange, languageLevel } from '../../src/lib/cv';

describe('formatMonth', () => {
  it('formats YYYY-MM as short month and year', () => {
    expect(formatMonth('2019-01')).toBe('Jan 2019');
    expect(formatMonth('2026-12')).toBe('Dec 2026');
  });
});

describe('formatRange', () => {
  it('renders an open range as Present', () => {
    expect(formatRange('2019-01', null)).toBe('Jan 2019 – Present');
  });

  it('renders a closed range', () => {
    expect(formatRange('2017-11', '2018-12')).toBe('Nov 2017 – Dec 2018');
  });
});

describe('languageLevel', () => {
  it.each([
    [1, 'Basic'],
    [2, 'Elementary'],
    [3, 'Intermediate'],
    [4, 'Advanced'],
    [5, 'Native / fluent'],
  ])('maps level %i to %s', (level, label) => {
    expect(languageLevel(level)).toBe(label);
  });
});

describe('certificationStatus', () => {
  it('shows only the date for achieved certifications', () => {
    expect(certificationStatus('achieved', '2024-05')).toBe('May 2024');
  });

  it('flags certifications in preparation', () => {
    expect(certificationStatus('in_preparation', '2026-10')).toBe('In preparation (Oct 2026)');
  });
});
