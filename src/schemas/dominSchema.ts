import { z } from 'zod';

export const domainValidation = z.string().url().min(1, "Domain is required");

export const dominSchema = z.object({
    domain: domainValidation,
    workDescription: z.string().min(1, { message: 'Work description must be at least 10 characters' }),
    keywords: z.array(z.string().min(1, { message: 'Keyword must be at least 1 character'})),
});