import { z } from 'zod';

export const createClientSchema = z.object({
    name: z.string().min(1).max(255).trim(),
    industry: z.string().max(100).trim().optional(),
    monthly_budget: z.number().positive().max(999999999999).optional(),
    contact_name: z.string().min(1).max(255).trim(),
    contact_email: z.string().email().max(255).trim().toLowerCase(),
});

export const updateClientSchema = z.object({
    name: z.string().min(1).max(255).trim().optional(),
    industry: z.string().max(100).trim().optional(),
    monthly_budget: z.number().positive().max(999999999999).optional(),
});

export const connectPlatformSchema = z.object({
    access_token: z.string().min(1, 'Access token is required'),
    refresh_token: z.string().optional(),
    account_id: z.string().max(255).optional(),
});

export const updateOnboardingStatusSchema = z.object({
    onboarding_status: z.enum(['pending', 'connected', 'active']),
});

export const platformParamSchema = z.enum(['google_ads', 'meta_ads', 'mailchimp']);

export const uuidParamSchema = z.string().uuid('Invalid ID format');
