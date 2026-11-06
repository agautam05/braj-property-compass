import { createFileRoute } from '@tanstack/react-router';
import { DetailPage } from '@/components/site/PublicPages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/projects/$slug')({ head: ({ params }) => pageHead(params.slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Project location and details on enquiry from BrajProperty.in. Images are illustrative; verify documents before booking.'), component: DetailPage });