import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from '@/components/site/PublicPages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute("/")({
  head: () => pageHead('Property in Vrindavan', 'Explore BrajProperty.in residential projects across Mathura and Vrindavan. Indicative details on enquiry; illustrative images.'),
  component: HomePage,
});
