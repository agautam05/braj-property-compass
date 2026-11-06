import { createFileRoute } from '@tanstack/react-router';
import { GalleryPage } from '@/components/site/PublicPages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/gallery')({ head: () => pageHead('Illustrative gallery', 'Illustrative residential, township and landscape images. These are not verified project photographs.'), component: GalleryPage });