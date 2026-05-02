/** Placeholder for Zeus lanes until wired to Airtable / TNT / workers */
export function ModuleStub({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-[11px] uppercase tracking-[2px] text-brand-blue/90 mb-2">{eyebrow ?? 'Zeus'}</p>
      <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">{title}</h1>
      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{description}</p>
      <div className="siren-card p-6">
        <p className="text-zinc-500 text-sm leading-relaxed">
          Stub route — connect to{' '}
          <code className="text-brand-blue/90 text-[13px]">zues-outreach</code> plugin, Airtable bases (
          <code className="text-zinc-400 text-[13px]">docs/AIRTABLE_ZEUS_SCHEMA.md</code>
          ), and TNT FastAPI per <code className="text-zinc-400 text-[13px]">docs/TNT_LOCAL_PREVIEW.md</code>.
        </p>
      </div>
    </div>
  );
}
