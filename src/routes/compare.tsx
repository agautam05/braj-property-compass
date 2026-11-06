import { createFileRoute } from '@tanstack/react-router';
import { ComparePage } from '@/components/site/PublicPages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/compare')({ head: () => pageHead('Compare projects', 'Compare selected BrajProperty projects, locations and indicative details before requesting verified information.'), component: ComparePage });