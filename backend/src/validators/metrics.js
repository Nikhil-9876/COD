import { z } from 'zod';

export const metricsQuerySchema = z.object({
    client_id: z.string().uuid().optional(),
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
    platform: z.enum(['google_ads', 'meta_ads', 'mailchimp', 'manual']).optional(),
});

export const chartQuerySchema = z.object({
    client_id: z.string().uuid().optional(),
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// CSV headers that MUST be present in an upload
export const CSV_REQUIRED_HEADERS = [
    'campaign_id',
    'date',
    'spend',
    'impressions',
    'clicks',
    'leads',
];
