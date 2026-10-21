# CASA MAREA
## Luxury Resort Operations, POS & Spa Management Experience
**Baja California Sur, Mexico** · *Odoo Enterprise-Inspired Unified Hospitality Platform*

[![Netlify Status](https://api.netlify.com/api/v1/badges/casamarea/deploy-status)](https://app.netlify.com/)

---

## 1. Product Overview

**CASA MAREA** is an interactive, high-fidelity luxury resort operations platform designed for hospitality decision-makers. It demonstrates an integrated operational ecosystem connecting:

- **Point of Sale (POS):** 4 connected outlets (*Marea Terraza Restaurant*, *El Mirador Agave Bar*, *Las Rocas Beach Club*, *La Colección Boutique*) with table service, split billing, gratuity calculation, and kitchen station routing.
- **Spa & Wellness Scheduling:** Calendar day/agenda views, therapist allocation, conflict prevention with mandatory 15-minute cleanup buffers, and seamless balance routing into POS checkout.
- **PMS Room Folio Synchronization:** In-house guest folio posting with stable idempotency keys and error-recovery simulation.
- **Stripe Digital Payments:** Deposit processing, simulated payment links, and automated end-of-day reconciliation audits.
- **Mexican Fiscal Invoicing (CFDI 4.0):** SAT Anexo 20 catalog compliance, RFC validation, 16% IVA separation, and simulated timbrado certificate preview.
- **Bilingual & Multi-Currency:** Real-time English & Mexican Spanish translation and MXN / USD price conversion.

---

## 2. Five Core Demonstration Scenarios

1. **Scenario A — Restaurant Table Checkout & Folio Posting:**
   - Navigate to `/app/pos` or `/app/restaurant`.
   - Add items, apply voluntary gratuity, select table service.
   - Choose *Guest Room Charge*, look up an in-house guest (e.g. *Sofia Alatorre, Rm 214*), confirm payment, and inspect the synchronized room folio at `/app/folios`.

2. **Scenario B — Complete Spa-to-POS Guest Journey:**
   - Start at the public booking wizard `/book-spa`.
   - Select treatment, date, therapist, and cabin. Complete simulated 50% deposit.
   - Open `/app/spa`, check the guest in, start treatment, complete session.
   - Click *Charge Remaining Balance to POS* to send the outstanding amount straight to checkout.

3. **Scenario C — PMS Failure & Idempotent Retry:**
   - Open `/app/folios`.
   - Inspect a simulated 504 Gateway Timeout posting (e.g., Room 406).
   - Click *Retry Idempotent Posting* to verify that the system re-attempts synchronization using the same unique posting reference without creating duplicate charges.

4. **Scenario D — Stripe Settlement Reconciliation:**
   - Open `/app/payments`.
   - Click *Run Demo Reconciliation* to audit transactions against processor records and inspect discrepancies.

5. **Scenario E — Mexican Invoicing (CFDI 4.0):**
   - Open `/app/invoicing`.
   - Select a completed POS order or spa payment. Validate RFC and fiscal tax regime.
   - Inspect the CFDI 4.0 document preview with explicit demonstration watermark and simulated SAT timbrado stamp.

---

## 3. Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Routing:** React Router v7 with Netlify SPA redirects
- **Design System:** Restrained Vanilla CSS with 8pt spacing rhythm, DM Sans, Inter, and Cormorant Garamond typography
- **Icons:** Lucide React
- **State & Persistence:** LocalStorage-backed AppContext with deterministic demo dataset and one-click reset

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Start local development server (60 FPS)
npm run dev

# Build for production
npm run build
```

---

## 5. Netlify Deployment

The project is pre-configured with `netlify.toml` and `public/_redirects`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Deploying to Netlify:
1. Connect this GitHub repository (`https://github.com/arcthaneaidelta/Odoo-POS-SPA.git`) to Netlify.
2. Netlify will automatically detect the build settings from `netlify.toml`:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. Click **Deploy Site**.
