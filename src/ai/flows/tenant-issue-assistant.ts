'use server';
/**
 * @fileOverview An AI-powered assistant to analyze tenant configurations and data,
 * identifying and suggesting potential issues. This includes recognizing 'Configuration pending'
 * statuses and missing information to improve management efficiency.
 *
 * - tenantIssueAssistant - A function that handles the tenant issue analysis process.
 * - TenantIssueAssistantInput - The input type for the tenantIssueAssistant function.
 * - TenantIssueAssistantOutput - The return type for the tenantIssueAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TenantIssueAssistantInputSchema = z.object({
  tenantName: z.string().describe('The name of the tenant.'),
  configurationStatus: z
    .string()
    .describe(
      'The current configuration status of the tenant (e.g., "Configuration pending", "Active", "Inactive").'
    ),
  contactEmail: z.string().email().optional().describe('The contact email of the tenant.'),
  contactPhone: z.string().optional().describe('The contact phone number of the tenant.'),
  lastLoginDate: z.string().optional().describe('The date of the tenant\'s last login, if available.'),
  isPaymentGatewayConfigured: z
    .boolean()
    .describe('True if the payment gateway is configured for the tenant.'),
  numberOfOutlets: z
    .number()
    .int()
    .min(0)
    .describe('The number of outlets configured for the tenant.'),
  numberOfUsers: z
    .number()
    .int()
    .min(0)
    .describe('The number of users defined for the tenant.'),
  merchantId: z.string().optional().describe('The merchant ID associated with the tenant, if any.'),
  additionalNotes: z
    .string()
    .optional()
    .describe('Any additional notes or free-form data about the tenant.'),
});
export type TenantIssueAssistantInput = z.infer<
  typeof TenantIssueAssistantInputSchema
>;

const IssueSchema = z.object({
  issueType: z
    .enum(['Configuration', 'Missing Data', 'Operational', 'Inactive', 'Other'])
    .describe('The category of the issue.'),
  description: z.string().describe('A detailed description of the identified issue.'),
  suggestion: z.string().describe('A clear suggestion or action to resolve the issue.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority level of the issue.'),
});

const TenantIssueAssistantOutputSchema = z.object({
  issues: z.array(IssueSchema).describe('A list of identified issues for the tenant.'),
});
export type TenantIssueAssistantOutput = z.infer<
  typeof TenantIssueAssistantOutputSchema
>;

export async function tenantIssueAssistant(
  input: TenantIssueAssistantInput
): Promise<TenantIssueAssistantOutput> {
  return tenantIssueAssistantFlow(input);
}

const tenantIssueAssistantPrompt = ai.definePrompt({
  name: 'tenantIssueAssistantPrompt',
  input: { schema: TenantIssueAssistantInputSchema },
  output: { schema: TenantIssueAssistantOutputSchema },
  prompt: `You are an AI-powered assistant designed to help administrators identify and resolve issues with tenant configurations and data. Analyze the provided tenant information and proactively identify potential problems, such as 'Configuration pending' statuses, missing essential information, or other operational inefficiencies.
For each identified issue, provide a clear description, a suggested action, and a priority level. If no issues are found, return an empty array for 'issues'.

Tenant Data:
Name: {{{tenantName}}}
Configuration Status: {{{configurationStatus}}}
Contact Email: {{{contactEmail}}}
Contact Phone: {{{contactPhone}}}
Last Login Date: {{{lastLoginDate}}}
Payment Gateway Configured: {{{isPaymentGatewayConfigured}}}
Number of Outlets: {{{numberOfOutlets}}}
Number of Users: {{{numberOfUsers}}}
Merchant ID: {{{merchantId}}}
Additional Notes: {{{additionalNotes}}}

Identify any issues and provide suggestions in the specified JSON format.`,
});

const tenantIssueAssistantFlow = ai.defineFlow(
  {
    name: 'tenantIssueAssistantFlow',
    inputSchema: TenantIssueAssistantInputSchema,
    outputSchema: TenantIssueAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await tenantIssueAssistantPrompt(input);
    return output!;
  }
);
