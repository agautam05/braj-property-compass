import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '@/components/site/PublicPages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/about')({ head: () => pageHead('About', 'BrajProperty.in helps buyers explore residential property across Mathura and Vrindavan with details on enquiry.'), component: AboutPage });