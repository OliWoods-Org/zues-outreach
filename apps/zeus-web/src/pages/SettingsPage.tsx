import { useState } from 'react';
import { Copy, Download, Eye, EyeOff, KeyRound, Users, Webhook } from 'lucide-react';
import { useMode } from '../App';
import {
  MARKETPLACE_CREATOR_SHARE_PERCENT,
  MARKETPLACE_PLATFORM_FEE_PERCENT,
} from '../constants/marketplace';

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-[22px] rounded-full transition-colors duration-150 ${enabled ? 'bg-siren-blue' : 'bg-[rgba(255,255,255,0.08)]'}`}
    >
      <div
        className="absolute top-[3px] w-4 h-4 rounded-full bg-white transition-transform duration-150"
        style={{ left: '3px', transform: enabled ? 'translateX(18px)' : 'translateX(0)' }}
      />
    </button>
  );
}

export function SettingsPage() {
  const { mode } = useMode();
  const isSales = mode === 'sales';
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoIntercept, setAutoIntercept] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [callRecording, setCallRecording] = useState(false);
  const [apiVisible, setApiVisible] = useState(false);
  const [webhookSecretVisible, setWebhookSecretVisible] = useState(false);

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="text-sm text-[#555] mt-1">Workspace profile, integrations, billing, and developer tools</p>
      </div>

      {/* Workspace */}
      <div className="siren-card p-6 glass-panel">
        <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5">Workspace</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-[#555] block mb-1.5">Workspace name</label>
            <input
              type="text"
              defaultValue="Acme Growth"
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-siren-blue/40"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#555] block mb-1.5">Your name</label>
            <input
              type="text"
              defaultValue="Alex Johnson"
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-siren-blue/40"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#555] block mb-1.5">Email</label>
            <input
              type="email"
              defaultValue="alex@company.com"
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-siren-blue/40"
            />
          </div>
        </div>
      </div>

      {/* General */}
      <div className="siren-card p-6 glass-panel">
        <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5">General</h3>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-3.5 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <p className="text-sm text-white">Notifications</p>
              <p className="text-[11px] text-[#555] mt-0.5">Alerts for deals, campaigns, and Guard events</p>
            </div>
            <Toggle enabled={notifications} onChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm text-white">Dark theme</p>
              <p className="text-[11px] text-[#555] mt-0.5">Zeus is optimized for dark UI</p>
            </div>
            <Toggle enabled={darkMode} onChange={setDarkMode} />
          </div>
        </div>
      </div>

      {/* Guard */}
      {!isSales && (
        <div className="siren-card p-6 glass-panel">
          <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5">Guard</h3>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3.5 border-b border-[rgba(255,255,255,0.06)]">
              <div>
                <p className="text-sm text-white">Auto-intercept</p>
                <p className="text-[11px] text-[#555] mt-0.5">Engage unknown callers automatically</p>
              </div>
              <Toggle enabled={autoIntercept} onChange={setAutoIntercept} />
            </div>
            <div className="flex items-center justify-between py-3.5 border-b border-[rgba(255,255,255,0.06)]">
              <div>
                <p className="text-sm text-white">Voice synthesis</p>
                <p className="text-[11px] text-[#555] mt-0.5">AI voices for personas</p>
              </div>
              <Toggle enabled={voiceEnabled} onChange={setVoiceEnabled} />
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm text-white">Call recording</p>
                <p className="text-[11px] text-[#555] mt-0.5">Record intercepted calls</p>
              </div>
              <Toggle enabled={callRecording} onChange={setCallRecording} />
            </div>
          </div>
        </div>
      )}

      {isSales && (
        <>
          <div className="siren-card p-6 glass-panel">
            <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Team
            </h3>
            <p className="text-sm text-[#888] mb-4">Invite operators and admins — roles control campaigns, billing, and API keys.</p>
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="colleague@company.com"
                className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-siren-blue/40"
              />
              <button type="button" className="px-4 py-2 rounded-lg btn-primary-railway text-sm font-semibold">
                Invite
              </button>
            </div>
            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] overflow-hidden text-sm">
              <div className="grid grid-cols-[1fr_100px_80px] gap-2 px-3 py-2 bg-[rgba(255,255,255,0.03)] text-[11px] text-[#555] uppercase tracking-wider">
                <span>Member</span>
                <span>Role</span>
                <span />
              </div>
              {[
                { email: 'alex@company.com', role: 'Admin' },
                { email: 'sam@company.com', role: 'Operator' },
              ].map(row => (
                <div key={row.email} className="grid grid-cols-[1fr_100px_80px] gap-2 px-3 py-2.5 border-t border-[rgba(255,255,255,0.05)] items-center">
                  <span className="text-white truncate">{row.email}</span>
                  <span className="text-[#888]">{row.role}</span>
                  <button type="button" className="text-xs text-siren-blue text-right hover:text-blue-300">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="siren-card p-6 glass-panel">
            <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5">CRM &amp; apps</h3>
            <div className="space-y-2">
              {['Salesforce', 'HubSpot', 'Slack', 'Gmail'].map(name => (
                <div
                  key={name}
                  className="flex items-center justify-between bg-[rgba(255,255,255,0.03)] rounded-lg px-4 py-3.5 border border-[rgba(255,255,255,0.06)]"
                >
                  <span className="text-sm text-white">{name}</span>
                  <button type="button" className="text-xs text-siren-blue hover:text-blue-300 font-medium">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="siren-card p-6 glass-panel">
            <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5 flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5" />
              API keys
            </h3>
            <p className="text-sm text-[#888] mb-4">Use for server-side dialers, CRM sync, and webhooks. Rotate keys if exposed.</p>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <code className="flex-1 font-mono text-xs px-3 py-2.5 rounded-lg bg-black/40 border border-[rgba(255,255,255,0.08)] text-[#888] truncate">
                {apiVisible ? 'sk_live_siren_••••••••••••k9fq' : 'sk_live_••••••••••••••••••••'}
              </code>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setApiVisible(v => !v)}
                  className="px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] text-[#888] hover:text-white inline-flex items-center gap-1.5"
                >
                  {apiVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] text-[#888] hover:text-white inline-flex items-center gap-1.5"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button type="button" className="mt-3 text-xs text-siren-blue hover:text-blue-300">
              + Generate new key
            </button>
          </div>

          <div className="siren-card p-6 glass-panel">
            <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5 flex items-center gap-2">
              <Webhook className="w-3.5 h-3.5" />
              Webhooks
            </h3>
            <label className="text-[11px] text-[#555] block mb-1.5">Endpoint URL</label>
            <input
              type="url"
              placeholder="https://api.yourcompany.com/siren/webhook"
              className="w-full mb-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-siren-blue/40"
            />
            <label className="text-[11px] text-[#555] block mb-1.5">Signing secret</label>
            <div className="flex gap-2">
              <input
                type={webhookSecretVisible ? 'text' : 'password'}
                readOnly
                value={webhookSecretVisible ? 'whsec_demo_siren_xyz' : '••••••••••••••••'}
                className="flex-1 font-mono text-sm px-3 py-2.5 rounded-lg bg-black/40 border border-[rgba(255,255,255,0.08)] text-[#ccc]"
              />
              <button
                type="button"
                onClick={() => setWebhookSecretVisible(v => !v)}
                className="px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] text-[#888]"
              >
                {webhookSecretVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#555] mt-3">
              Events: call.completed, campaign.paused, meeting.booked, script.purchased.
            </p>
          </div>

          <div className="siren-card p-6 glass-panel">
            <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5">Billing &amp; usage</h3>
            <p className="text-sm text-[#888] mb-4 leading-relaxed">
              Voice minutes, concurrent calls, and marketplace purchases bill to this workspace.
            </p>
            <button type="button" className="text-xs font-medium px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.12)] transition-colors">
              Manage billing
            </button>
          </div>

          <div className="siren-card p-6 glass-panel">
            <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5">Script marketplace</h3>
            <p className="text-sm text-[#888] leading-relaxed mb-4">
              Sellers earn <span className="text-white">{MARKETPLACE_CREATOR_SHARE_PERCENT}%</span> per sale. Zeus retains{' '}
              <span className="text-white">{MARKETPLACE_PLATFORM_FEE_PERCENT}%</span> for the in-product marketplace,
              payments, and review.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="text-xs font-medium px-4 py-2 rounded-lg bg-siren-blue/20 text-siren-blue hover:bg-siren-blue/30 transition-colors">
                Connect Stripe Connect
              </button>
              <button type="button" className="text-xs font-medium px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] text-[#888] hover:text-white transition-colors">
                Payout history
              </button>
            </div>
          </div>

          <div className="siren-card p-6 glass-panel">
            <h3 className="text-xs text-[#888] tracking-wide uppercase mb-5">Compliance &amp; data</h3>
            <ul className="text-sm text-[#888] space-y-2 mb-4">
              <li>
                <a href="#" className="text-siren-blue hover:text-blue-300">
                  TCPA &amp; consent checklist
                </a>{' '}
                — recording, DNC, disclosure templates.
              </li>
              <li>
                <a href="#" className="text-siren-blue hover:text-blue-300">
                  Data Processing Agreement
                </a>{' '}
                (request signed copy).
              </li>
            </ul>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.06)] text-white hover:bg-[rgba(255,255,255,0.1)]"
            >
              <Download className="w-4 h-4" />
              Export call &amp; billing logs (CSV)
            </button>
          </div>

          <div className="siren-card p-6 border border-red-500/15 glass-panel">
            <h3 className="text-xs text-red-400/90 tracking-wide uppercase mb-2">Danger zone</h3>
            <p className="text-sm text-[#888] mb-4">Delete workspace removes agents, campaigns, and recordings after 30 days.</p>
            <button type="button" className="text-xs font-medium px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10">
              Delete workspace…
            </button>
          </div>
        </>
      )}
    </div>
  );
}
