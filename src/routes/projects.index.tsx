import { createFileRoute } from '@tanstack/react-router';
import { ProjectsPage } from '@/components/site/PublicPages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/projects/')({ head: () => pageHead('Projects', 'Explore residential projects in Mathura and Vrindavan with search, location, indicative budget and plot size filters.'), component: ProjectsPage });