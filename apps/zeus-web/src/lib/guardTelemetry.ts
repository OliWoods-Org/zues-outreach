import { calls, guardStats, personas } from '../data/calls';

/** Most-used persona label in the demo call log (intercept flows). */
export function topPersonaFromCallLog(): { name: string; note: string } {
  const counts = new Map<string, number>();
  for (const c of calls) {
    counts.set(c.persona, (counts.get(c.persona) ?? 0) + 1);
  }
  let topName = 'Confused Grandma';
  let max = 0;
  for (const [name, n] of counts) {
    if (n > max) {
      max = n;
      topName = name;
    }
  }
  const p = personas.find(x => x.name === topName);
  return { name: topName, note: p?.description ?? '' };
}

/** Defense assistant stub copy grounded in `guardStats` + demo call log (until live API). */
export function buildDefenseAssistantStub(userText: string): string {
  const { callsIntercepted, hoursSaved, scamsBlocked, telemarketersDeflected } = guardStats;
  const top = topPersonaFromCallLog();
  return [
    `Looking into "${userText}" for you.`,
    '',
    'Based on your current Guard configuration (demo telemetry):',
    `- ${callsIntercepted} calls intercepted this period`,
    `- ~${hoursSaved}h+ scammer time absorbed (estimated from sample log)`,
    `- ${scamsBlocked} scam-type events · ${telemarketersDeflected} telemarketer-type events (dashboard rollup)`,
    `- Most active persona in log: ${top.name}${top.note ? ` — ${top.note}` : ''}`,
    '',
    "Anything else you'd like to know?",
  ].join('\n');
}
