import { describe, expect, it } from 'vitest';
import { seed, update, getDB, upsert } from '@/lib/store';
import { filterProjects } from '@/lib/project-filters';

describe('BrajProperty demo rules', () => {
  it('preserves the supplied six locations without invented project prices or sizes', () => {
    const d = seed();
    expect(d.projects.map((p) => [p.name, p.location])).toEqual([
      ['Banke Bihari Orchid', 'Behind Aggarwal Restaurant, Mathura'],
      ['Banke Bihari Dham', 'Rukmani Vihar, Vrindavan'],
      ['Braj Anand Vatika', 'Satoha–Naugaon Road, Mathura'],
      ['Banke Bihari Kunj', 'Ramtal, Jait Road, Vrindavan'],
      ['Braj Lotus Greens', 'Mathura–Govardhan Road'],
      ['Banke Bihari Greens', 'Opposite Char Dham Temple, Vrindavan'],
    ]);
    expect(d.projects.every((p) => p.priceMinLakh === null && p.priceMaxLakh === null && p.sizeMinSqYd === null && p.sizeMaxSqYd === null)).toBe(true);
    expect(d.settings.officeAddress).toBe('');
  });
  it('filters search and location together', () => {
    expect(filterProjects(seed().projects, 'Dham', 'Vrindavan').map((p) => p.slug)).toEqual(['banke-bihari-dham']);
    expect(filterProjects(seed().projects, 'Dham', 'Mathura')).toHaveLength(0);
  });
  it('uses known budget ranges while retaining unknown prices for confirmation', () => {
    const p = seed().projects[0];
    if (!p) throw new Error('Missing supplied project');
    const expensive = { ...p, id: 'expensive', priceMinLakh: 80, priceMaxLakh: 100 };
    const affordable = { ...p, id: 'affordable', priceMinLakh: 20, priceMaxLakh: 24 };
    expect(filterProjects([p, expensive, affordable], '', '', 'u25').map((x) => x.id)).toEqual([p.id, 'affordable']);
  });
  it('uses known size ranges while retaining unknown sizes for confirmation', () => {
    const p = seed().projects[0];
    if (!p) throw new Error('Missing supplied project');
    expect(filterProjects([p, { ...p, id: 'large', sizeMinSqYd: 250, sizeMaxSqYd: 300 }], '', '', '', 's100').map((x) => x.id)).toEqual([p.id]);
  });
  it('publishes and edits immediately through the same browser-local store', () => {
    const d = seed(); const first = d.projects[0];
    if (!first) throw new Error('Missing supplied project');
    const p = { ...first, id: 'new-demo', slug: 'new-demo', published: false };
    update(() => ({ ...d, projects: upsert(d.projects, p) }));
    expect(filterProjects(getDB().projects).some((x) => x.id === p.id)).toBe(false);
    update((db) => ({ ...db, projects: upsert(db.projects, { ...p, published: true, summary: 'Updated supplied details' }) }));
    expect(filterProjects(getDB().projects).find((x) => x.id === p.id)?.summary).toBe('Updated supplied details');
    update(() => seed());
  });
});