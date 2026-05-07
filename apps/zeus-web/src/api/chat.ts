/**
 * Optional assistant backend — POST `{base}/completion` when VITE_ZEUS_CHAT_API_URL is set.
 * Request body: `{ mode: 'sales' | 'guard', messages: { role, content }[] }`
 * Response: `{ content: string }`
 */

export type ChatApiMessage = { role: 'user' | 'assistant' | string; content: string };

export async function fetchChatCompletion(params: {
  mode: 'sales' | 'guard';
  messages: ChatApiMessage[];
}): Promise<{ content: string } | null> {
  const base =
    typeof import.meta.env.VITE_ZEUS_CHAT_API_URL === 'string' ? import.meta.env.VITE_ZEUS_CHAT_API_URL.trim() : '';
  if (!base) return null;
  try {
    const url = `${base.replace(/\/$/, '')}/completion`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      credentials: 'omit',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { content?: unknown };
    if (typeof json?.content === 'string' && json.content.length > 0) {
      return { content: json.content };
    }
    return null;
  } catch {
    return null;
  }
}
