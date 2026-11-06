import { createFileRoute } from '@tanstack/react-router';
import { DemoAdmin } from '@/components/site/DemoAdmin';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/admin')({ head: () => pageHead('Demo dashboard', 'Browser-local demonstration dashboard for BrajProperty projects, enquiries, gallery and website settings. No production authentication.'), component: DemoAdmin });