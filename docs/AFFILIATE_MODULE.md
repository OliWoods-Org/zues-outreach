# Affiliate / referral module (Viral Loops–class)

Zeus **Affiliate** is an add-on SKU: programs, partners, links, events, and a **RewardsQueue** for payouts (Stripe Connect or manual later).

## Airtable tables (canonical)

See [`AIRTABLE_ZEUS_SCHEMA.md`](AIRTABLE_ZEUS_SCHEMA.md) § Affiliate — **`AffiliatePrograms`**, **`Partners`**, **`ReferralLinks`**, **`ReferralEvents`**, **`RewardsQueue`**.

| Table | Role |
|-------|------|
| **AffiliatePrograms** | Commission model, legal URL, active flag, Product link |
| **Partners** | Enrolled affiliates; payout method; Status |
| **ReferralLinks** | Per-partner codes/URLs; UTM defaults |
| **ReferralEvents** | signup / trial / paid events; attribution |
| **RewardsQueue** | Amount, status (pending / paid / hold), paid date |

## Payouts tier (packaging)

| Tier | Includes |
|------|----------|
| **Affiliate Lite** | Programs + links + event logging; manual fulfillment |
| **Affiliate Pro** | RewardsQueue automation hooks; export for finance |
| **Affiliate + Pay** (later) | Stripe Connect or batch payouts; tax forms workflow |

Mission Control **Affiliates** page lists programs and queue depth; workers sync events from checkout or CRM webhooks.

## Zeus Web

Route **`/affiliates`** — programs grid, partners snapshot, rewards queue (wire to Airtable when PAT is configured).

## Execution layer

Plugin commands can append **`ReferralEvents`** from UTM landing hits when webhook workers exist (`docs/CLAUDE_TASKS.md` Track G).
