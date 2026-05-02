export type DealStage = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed';

export interface Deal {
  id: number;
  company: string;
  contact: string;
  value: number;
  stage: DealStage;
  probability: number;
  lastActivity: string;
  nextStep: string;
}

export const deals: Deal[] = [
  { id: 1, company: 'Apex Industries', contact: 'Sarah Chen', value: 125000, stage: 'Negotiation', probability: 75, lastActivity: '2 hours ago', nextStep: 'Send revised proposal' },
  { id: 2, company: 'BlueStar Corp', contact: 'Mike Torres', value: 89000, stage: 'Proposal', probability: 50, lastActivity: '1 day ago', nextStep: 'Schedule demo call' },
  { id: 3, company: 'Cascade Systems', contact: 'Lisa Park', value: 210000, stage: 'Qualified', probability: 30, lastActivity: '3 hours ago', nextStep: 'Technical deep-dive' },
  { id: 4, company: 'DataFlow Inc', contact: 'James Wright', value: 67000, stage: 'Closed', probability: 100, lastActivity: '1 week ago', nextStep: 'Onboarding scheduled' },
  { id: 5, company: 'Echo Ventures', contact: 'Anna Kim', value: 45000, stage: 'Lead', probability: 10, lastActivity: '4 hours ago', nextStep: 'Initial outreach' },
  { id: 6, company: 'Frontier Tech', contact: 'David Lee', value: 156000, stage: 'Negotiation', probability: 80, lastActivity: '30 min ago', nextStep: 'Contract review' },
  { id: 7, company: 'GridPoint LLC', contact: 'Rachel Adams', value: 33000, stage: 'Lead', probability: 15, lastActivity: '2 days ago', nextStep: 'Qualify budget' },
  { id: 8, company: 'Harbor Digital', contact: 'Tom Garcia', value: 78000, stage: 'Proposal', probability: 45, lastActivity: '5 hours ago', nextStep: 'Follow up on pricing' },
  { id: 9, company: 'Ionic Solutions', contact: 'Priya Patel', value: 92000, stage: 'Qualified', probability: 35, lastActivity: '1 day ago', nextStep: 'Stakeholder mapping' },
  { id: 10, company: 'JetStream Media', contact: 'Chris Nguyen', value: 52000, stage: 'Closed', probability: 100, lastActivity: '3 days ago', nextStep: 'Upsell opportunity' },
];

export const pipelineStats = {
  totalDeals: 23,
  totalValue: 847000,
  winRate: 34,
  avgDealSize: 36826,
};
