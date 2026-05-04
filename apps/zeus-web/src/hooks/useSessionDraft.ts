/** Persist composer draft per mode — backlog item 29. */

export function draftKey(mode: 'sales' | 'guard'): string {
  return `zeus-chat-draft-${mode}`;
}

export function readDraft(mode: 'sales' | 'guard'): string {
  try {
    return sessionStorage.getItem(draftKey(mode)) ?? '';
  } catch {
    return '';
  }
}

export function writeDraft(mode: 'sales' | 'guard', value: string): void {
  try {
    if (!value.trim()) sessionStorage.removeItem(draftKey(mode));
    else sessionStorage.setItem(draftKey(mode), value);
  } catch {
    /* ignore quota */
  }
}
