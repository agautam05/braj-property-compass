import { createFileRoute } from '@tanstack/react-router';
import { ContactPage } from '@/components/site/PublicPages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/contact')({ head: () => pageHead('Contact', 'Call or WhatsApp BrajProperty.in for current property details in Mathura and Vrindavan, or save a browser-local demo enquiry.'), component: ContactPage });