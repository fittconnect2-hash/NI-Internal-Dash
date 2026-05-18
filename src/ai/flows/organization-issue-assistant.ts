'use server';
/**
 * @fileOverview An AI-powered assistant to analyze organization configurations and data,
 * identifying and suggesting potential issues. This includes recognizing 'Configuration pending'
 * statuses and missing information to improve management efficiency.
 *
 * - organizationIssueAssistant - A function that handles the organization issue analysis process.
 * - OrganizationIssueAssistantInput - The input type for the organizationIssueAssistant function.
 * - OrganizationIssueAssistantOutput - The return type for the organizationIssueAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OrganizationIssueAssistantInputSchema = z.object({
  organizationName: z.string().describe('The name of the organization.'),
  configurationStatus: z
    .string()
    .describe(
      'The current configuration status of the organization (e.g., "Configuration pending", "Active", "Inactive").'
    ),
  contactEmail: z.string().email().optional().describe('The contact email of the organization.'),
  contactPhone: z.string().optional().describe('The contact phone number of the organization.'),
  lastLoginDate: z.string().optional().describe('The date of the organization\'s last login, if available.'),
  isPaymentGatewayConfigured: z
    .boolean()
    .describe('True if the payment gateway is configured for the organization.'),
  numberOfOutlets: z
    .number()
    .int()
    .min(0)
    .describe('The number of outlets configured for the organization.'),
  numberOfUsers: z
    .number()
    .int()
    .min(0)
    .describe('The number of users defined for the organization.'),
  merchantId: z.string().optional().describe('The merchant ID associated with the organization, if any.'),
  additionalNotes: z
    .string()
    .optional()
    .describe('Any additional notes or free-form data about the organization.'),
});
export type OrganizationIssueAssistantInput = z.infer<
  typeof OrganizationIssueAssistantInputSchema
>;

const IssueSchema = z.object({
  issueType: z
    .enum(['Configuration', 'Missing Data', 'Operational', 'Inactive', 'Other'])
    .describe('The category of the issue.'),
  description: z.string().describe('A detailed description of the identified issue.'),
  suggestion: z.string().describe('A clear suggestion or action to resolve the issue.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority level of the issue.'),
});

const OrganizationIssueAssistantOutputSchema = z.object({
  issues: z.array(IssueSchema).describe('A list of identified issues for the organization.'),
});
export type OrganizationIssueAssistantOutput = z.infer<
  typeof OrganizationIssueAssistantOutputSchema
>;

export async function organizationIssueAssistant(
  input: OrganizationIssueAssistantInput
): Promise<OrganizationIssueAssistantOutput> {
  return organizationIssueAssistantFlow(input);
}

const organizationIssueAssistantPrompt = ai.definePrompt({
  name: 'organizationIssueAssistantPrompt',
  input: { schema: OrganizationIssueAssistantInputSchema },
  output: { schema: OrganizationIssueAssistantOutputSchema },
  prompt: `You are an AI-powered assistant designed to help administrators identify and resolve issues with organization configurations and data. Analyze the provided organization information and proactively identify potential problems, such as 'Configuration pending' statuses, missing essential information, or other operational inefficiencies.
For each identified issue, provide a clear description, a suggested action, and a priority level. If no issues are found, return an empty array for 'issues'.

Organization Data:
Name: {{{organizationName}}}
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

const organizationIssueAssistantFlow = ai.defineFlow(
  {
    name: 'organizationIssueAssistantFlow',
    inputSchema: OrganizationIssueAssistantInputSchema,
    outputSchema: OrganizationIssueAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await organizationIssueAssistantPrompt(input);
    return output!;
  }
);
