# respa.id

Personal website — photo gallery, blog, and software portfolio.
Built with Next.js, deployed to GCP Cloud Run.

---

## Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPMENT                                   │
│                                                                         │
│   ┌──────────────────┐          ┌─────────────────────────────────┐     │
│   │   Claude AI      │          │         Terminal                │     │
│   │                  │          │                                 │     │
│   │  📱 Mobile app   │  ideas   │  📱 Termius (SSH)                │    │
│   │  💻 MacBook      │ ──────▶  │  🌐 Google Cloud Shell           │    │
│   │                  │          │                                 │     │
│   │  Write & review  │          │  git add / commit / push        │     │
│   │  code with AI    │          │  bash scripts/gcp-setup.sh      │     │
│   └──────────────────┘          └───────────────┬─────────────────┘     │
│                                                 │                       │
└─────────────────────────────────────────────────┼───────────────────────┘
                                                  │ git push
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           GITHUB                                        │
│                                                                         │
│   ┌──────────────────┐          ┌─────────────────────────────────┐     │
│   │  Pull Request    │          │      GitHub Actions CI/CD       │     │
│   │                  │  merge   │                                 │     │
│   │  📱 Mobile app   │ ──────▶  │  1. npm run lint                │     │
│   │  🌐 Web UI       │          │  2. tsc --noEmit                │     │
│   │                  │          │  3. npm run build               │     │
│   │  Review → Merge  │          │  4. docker build & push         │     │
│   └──────────────────┘          └───────────────┬─────────────────┘     │
│                                                 │                       │
└─────────────────────────────────────────────────┼───────────────────────┘
                                                  │ on main push
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           GCP                                           │
│                                                                         │
│   ┌──────────────────┐          ┌─────────────────────────────────┐     │
│   │ Artifact Registry│          │         Cloud Run               │     │
│   │                  │  deploy  │                                 │     │
│   │  Docker images   │ ──────▶  │  europe-west1                   │     │
│   │  (keep last 5)   │          │  0–3 instances, scale-to-zero   │     │
│   │                  │          │  respa.id (custom domain)       │     │
│   └──────────────────┘          └───────────────┬─────────────────┘     │
│                                                 │                       │
└─────────────────────────────────────────────────┼───────────────────────┘
                                                  │ traffic
                                                  ▼
                                   ┌──────────────────────┐
                                   │  Google Analytics 4  │
                                   │                      │
                                   │  Realtime visitors   │
                                   │  Page views          │
                                   │  Audience insights   │
                                   └──────────────────────┘
```

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, standalone output) |
| Styling | Tailwind CSS v4 |
| Photos | `yet-another-react-lightbox` + Flickr CDN |
| Blog | MDX with `next-mdx-remote` + gray-matter |
| Auth (CI→GCP) | Workload Identity Federation — no JSON keys |
| Container registry | GCP Artifact Registry (`europe-west1`) |
| Hosting | GCP Cloud Run (free tier, scale-to-zero) |
| Domain | respa.id via Cloud Run Domain Mappings + auto-SSL |
| Analytics | Google Analytics 4 (`G-FCYGKV6D51`) |

---

## Local setup

```bash
npm install
npm run dev        # http://localhost:3000
```

---

## GCP setup (one-time)

```bash
bash scripts/gcp-setup.sh      # provision infra, prints GitHub secrets
bash scripts/setup-domain.sh   # map respa.id + www.respa.id
```

Add the three printed values as repository secrets in GitHub:
`GCP_PROJECT_ID` · `GCP_WORKLOAD_IDENTITY_PROVIDER` · `GCP_SERVICE_ACCOUNT`

---

## Deploy

Push to `main` — the CI workflow handles the rest.
