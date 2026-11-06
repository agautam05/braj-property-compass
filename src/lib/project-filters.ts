import type { Project } from './store';
import { BUDGETS, SIZES, overlaps } from './format';

export function filterProjects(projects: Project[], query = '', city = '', budget = '', size = '') {
  const b = BUDGETS.find((x) => x.id === budget);
  const s = SIZES.find((x) => x.id === size);
  return projects.filter((p) => p.published !== false &&
    `${p.name} ${p.location}`.toLowerCase().includes(query.toLowerCase()) &&
    (!city || p.city === city) &&
    (!b || overlaps(p.priceMinLakh, p.priceMaxLakh, b.min, b.max)) &&
    (!s || overlaps(p.sizeMinSqYd, p.sizeMaxSqYd, s.min, s.max)))
    .sort((a, b) => a.order - b.order);
}