# RESERVA FLOW — Autonomous Reservation Orchestration SaaS

> Next-generation multi-channel booking orchestration, automated browser reservation bots, zero-collision channel conflict reconciliation, and intelligent guest yield management.

![RESERVA FLOW Preview](public/images/hero_ambient_landscape.jpg)

## Overview

**RESERVA FLOW** is a high-fidelity frontend prototype built for luxury boutique hotels, private alpine chalets, Michelin dining venues, and hospitality management groups.

The platform demonstrates autonomous reservation acquisition, cross-channel arbitration, biometric anti-bot bypass, and dynamic waitlist recovery within a unified interface.

---

## Key Features

1. **Autonomous Headless Reservation Workers**:
   - Deploys stealth Chromium browser sessions with humanized bezier cursor curves and residential ISP proxies (Frankfurt, Zurich, London, Tokyo).
2. **Zero-Collision Channel Shield**:
   - Resolves simultaneous booking attempts between Airbnb, Booking.com, and Direct engines in 320ms based on net margin arbitration.
3. **Biometric Anti-Bot Turnstile Solver**:
   - Automated Cloudflare Turnstile, DataDome, and PerimeterX clearance with 99.4% success rate.
4. **Dynamic Waitlist Yield Recovery**:
   - Detects OTA cancellations (Stornierung) and immediately backfills opened inventory with pre-authorized VIP guests in 1.2s.
5. **Deterministic Simulation Sandbox**:
   - Centrally drives 4 real-time scenarios synchronized live across Dashboard KPIs, Bookings Table, and Session telemetry.
6. **Live Ambient Cinema Hero**:
   - Classical alpine landscape visual with Ken Burns slow panning, real-time 60fps sunlight dust particle physics, and god-ray sweeps.

---

## Application Routes

- `/` — Marketing Landing Page (Hero, Features, Visualizer, Yield ROI Calculator, Comparison, Pricing, FAQ)
- `/dashboard` — Executive Overview (CheckinOs layout: Occupancy 87%, Revenue Curve, Platform Donut, Schedule Timeline, Tasks Checklist)
- `/workflows` — Automated Workflow Studio & 5-Step Creation Wizard
- `/bookings` — Multi-Channel Bookings Management Table (Full German hospitality metadata: Bestätigt, Storniert, Booked, Anreise/Abreise, Unit, Drawer)
- `/sessions` — Browser Automation Workers, Residential Proxy Fleet, and Live DevTools Console
- `/simulator` — Deterministic Execution Engine with 4 executable scenarios and live JSON event stream
- `/activity` — Cryptographic Chronological Event Stream & Audit Trail
- `/settings` — Platform Connectors (Booking.com, Airbnb, OpenTable, Stripe Vault) and Factory Reset

---

## Technical Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Vanilla CSS Design Tokens (Strict HSL tailored palette: Forest `#0D4E43`, Mint `#10B981`, Slate `#0F172A`)
- **State Management**: Centralized `DemoContext` with `useReducer` and `localStorage` persistence
- **Icons**: Lucide React
- **Hosting**: Pre-configured for Netlify (`netlify.toml` + `public/_redirects`)

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run production build
npm run build
```

---

## Netlify Deployment

This repository is pre-configured with `netlify.toml` and `public/_redirects` to handle Single Page Application (SPA) deep linking across all routes.
