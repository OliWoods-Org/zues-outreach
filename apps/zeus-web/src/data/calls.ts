export interface Call {
  id: number;
  number: string;
  caller: string;
  type: string;
  persona: string;
  duration: string;
  time: string;
  status: 'blocked' | 'intercepted' | 'whitelisted';
}

export const personas = [
  { id: 'grandma', name: 'Confused Grandma', description: 'Wastes scammer time with rambling stories and confusion', icon: '👵', color: '#f59e0b' },
  { id: 'hold', name: 'Hold Music Bot', description: 'Puts callers on infinite hold with elevator music', icon: '🎵', color: '#8b5cf6' },
  { id: 'survey', name: 'Survey Enthusiast', description: 'Turns the tables with endless survey questions', icon: '📋', color: '#10b981' },
  { id: 'techsupport', name: 'Tech Support Reverse', description: 'Pretends the scammer called tech support', icon: '🖥️', color: '#a78bfa' },
  { id: 'buyer', name: 'Interested Buyer', description: 'Acts extremely interested but never commits', icon: '🤑', color: '#ef4444' },
];

export const calls: Call[] = [
  { id: 1, number: '+1 (555) 012-3456', caller: 'Extended Warranty Scam', type: 'Robocall', persona: 'Confused Grandma', duration: '4:23', time: '10 min ago', status: 'intercepted' },
  { id: 2, number: '+1 (555) 789-0123', caller: 'IRS Impersonation', type: 'Scam', persona: 'Tech Support Reverse', duration: '7:12', time: '25 min ago', status: 'intercepted' },
  { id: 3, number: '+1 (555) 234-5678', caller: 'Solar Panel Sales', type: 'Telemarketer', persona: 'Survey Enthusiast', duration: '3:45', time: '1 hour ago', status: 'intercepted' },
  { id: 4, number: '+1 (555) 345-6789', caller: 'Medicare Scam', type: 'Scam', persona: 'Interested Buyer', duration: '12:08', time: '1 hour ago', status: 'intercepted' },
  { id: 5, number: '+1 (555) 456-7890', caller: 'Student Loan Forgiveness', type: 'Robocall', persona: 'Hold Music Bot', duration: '2:34', time: '2 hours ago', status: 'blocked' },
  { id: 6, number: '+1 (555) 567-8901', caller: 'Amazon Impersonation', type: 'Scam', persona: 'Confused Grandma', duration: '8:56', time: '2 hours ago', status: 'intercepted' },
  { id: 7, number: '+1 (555) 678-9012', caller: 'Credit Card Services', type: 'Telemarketer', persona: 'Tech Support Reverse', duration: '5:17', time: '3 hours ago', status: 'intercepted' },
  { id: 8, number: '+1 (555) 111-2222', caller: 'SSN Suspension Scam', type: 'Scam', persona: 'Survey Enthusiast', duration: '6:43', time: '3 hours ago', status: 'intercepted' },
  { id: 9, number: '+1 (555) 333-4444', caller: 'Home Security Sales', type: 'Telemarketer', persona: 'Interested Buyer', duration: '4:01', time: '4 hours ago', status: 'intercepted' },
  { id: 10, number: '+1 (555) 555-6666', caller: 'Crypto Investment Scam', type: 'Scam', persona: 'Hold Music Bot', duration: '15:22', time: '5 hours ago', status: 'intercepted' },
  { id: 11, number: '+1 (555) 777-8888', caller: 'Package Delivery Scam', type: 'Robocall', persona: 'Confused Grandma', duration: '3:12', time: '6 hours ago', status: 'blocked' },
  { id: 12, number: '+1 (555) 999-0000', caller: 'Insurance Telemarketer', type: 'Telemarketer', persona: 'Tech Support Reverse', duration: '7:45', time: '7 hours ago', status: 'intercepted' },
  { id: 13, number: '+1 (555) 121-3434', caller: 'Apple ID Phishing', type: 'Scam', persona: 'Survey Enthusiast', duration: '9:03', time: '8 hours ago', status: 'intercepted' },
  { id: 14, number: '+1 (555) 565-7878', caller: 'Timeshare Offer', type: 'Telemarketer', persona: 'Interested Buyer', duration: '11:34', time: '10 hours ago', status: 'intercepted' },
  { id: 15, number: '+1 (555) 909-1212', caller: 'Fake Charity Call', type: 'Scam', persona: 'Hold Music Bot', duration: '6:18', time: '12 hours ago', status: 'blocked' },
];

export const guardStats = {
  callsIntercepted: 47,
  hoursSaved: 3,
  scamsBlocked: 28,
  telemarketersDeflected: 19,
};
