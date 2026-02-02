# ATN Dashboard - AI Agents Monitor

Dashboard de monitoring pour les 10 agents IA Air Tahiti Nui.

## Installation

```bash
cd dashboard-app
npm install
```

## Configuration

Copier `.env.local.example` vers `.env.local` et configurer:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ogsimsfqwibcmotaeevb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Airtable
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=appWd0x5YZPHKL0VK

# n8n
N8N_WEBHOOK_BASE=https://n8n.srv1140766.hstgr.cloud/webhook
```

## Lancement

```bash
npm run dev
```

Ouvrir http://localhost:3000

## Structure

```
src/
├── app/
│   ├── page.tsx ............. Overview (home)
│   ├── conversations/ ....... Build 1 - Concierge
│   ├── newsletters/ ......... Build 2 - Newsletter
│   ├── content/ ............. Build 3 - SEO Content
│   ├── roi/ ................. Build 4 - ROI Analyst
│   ├── bookings/ ............ Build 5 - Booking Assistant
│   ├── social/ .............. Build 6 - Social Monitor
│   ├── competitors/ ......... Build 7 - Competitor Intel
│   ├── flights/ ............. Build 8 - Flight Notifier
│   ├── reviews/ ............. Build 9 - Review Responder
│   └── upsell/ .............. Build 10 - Upsell Engine
├── components/
│   ├── Sidebar.tsx
│   └── AlertBell.tsx
└── lib/
    ├── supabase.ts .......... Client Supabase
    ├── airtable.ts .......... Client Airtable
    └── workflows.ts ......... Config workflows
```

## Tables Airtable

| Table | Build | Description |
|-------|-------|-------------|
| Concierge_Logs | 1 | Conversations chatbot |
| Newsletter_Logs | 2 | Emails personnalisés |
| SEO_Content | 3 | Articles générés |
| ROI_Alerts | 4 | Alertes ROI |
| Booking_Logs | 5 | Demandes de réservation |
| Social_Mentions | 6 | Mentions réseaux sociaux |
| Competitor_Intel | 7 | Veille concurrentielle |
| Flight_Alerts | 8 | Alertes vols |
| Reviews | 9 | Avis clients |
| Upsell_Offers | 10 | Offres upsell |

## Tables Supabase

- `atn_workflow_executions` - Logs d'exécution
- `atn_daily_metrics` - Métriques agrégées
- `atn_realtime_alerts` - Alertes temps réel
