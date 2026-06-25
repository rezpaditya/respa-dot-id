#!/usr/bin/env bash
# scripts/setup-domain.sh
# Maps respa.id and www.respa.id → Cloud Run service via GCP Domain Mappings.
# Run once from GCP Cloud Shell (shell.cloud.google.com) or locally.
# Safe to re-run — all steps are idempotent.

set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-respa-dot-id}"
REGION="asia-southeast2"
SERVICE="respa-dot-id"
APEX="respa.id"
WWW="www.respa.id"

green()  { echo -e "\033[32m$*\033[0m"; }
yellow() { echo -e "\033[33m$*\033[0m"; }
bold()   { echo -e "\033[1m$*\033[0m"; }
step()   { echo; bold "── $* ──────────────────────────────"; }

# ── 0. Prereqs ────────────────────────────────────────────────────────────────
if ! command -v gcloud &>/dev/null; then
  echo "gcloud CLI not found."
  echo "Open Cloud Shell for free: https://shell.cloud.google.com"
  exit 1
fi

if ! gcloud auth print-access-token &>/dev/null; then
  yellow "Not logged in — opening browser login..."
  gcloud auth login
fi

gcloud config set project "$PROJECT_ID"
green "Project: $PROJECT_ID"

# ── 1. Enable domains API ─────────────────────────────────────────────────────
step "1 / 3  Enable domains API"
gcloud services enable domains.googleapis.com --project="$PROJECT_ID"
green "domains.googleapis.com enabled"

# ── 2. Verify Cloud Run service exists ────────────────────────────────────────
step "2 / 3  Verify Cloud Run service"
if ! gcloud run services describe "$SERVICE" \
     --region="$REGION" --project="$PROJECT_ID" &>/dev/null; then
  echo "ERROR: Cloud Run service '$SERVICE' not found in $REGION."
  echo "Deploy the app first (push to main), then re-run this script."
  exit 1
fi
green "Service '$SERVICE' found in $REGION"

# ── 3. Create domain mappings ─────────────────────────────────────────────────
# Domain mappings require the beta track — the stable track does not support --region.
step "3 / 3  Create domain mappings"

MAPPING_FAILED=0

create_mapping() {
  local domain="$1"
  if gcloud beta run domain-mappings describe \
       --domain="$domain" \
       --region="$REGION" \
       --project="$PROJECT_ID" &>/dev/null 2>&1; then
    green "Mapping for $domain already exists — skipping"
    return
  fi

  yellow "Creating mapping for $domain..."
  if ! gcloud beta run domain-mappings create \
    --service="$SERVICE" \
    --domain="$domain" \
    --region="$REGION" \
    --project="$PROJECT_ID" 2>&1; then
    echo
    yellow "⚠  Domain ownership verification required for $domain."
    yellow "   1. Go to: https://console.cloud.google.com/run/domains?project=$PROJECT_ID"
    yellow "   2. Click 'Manage Custom Domains' → add domain → follow verification steps."
    yellow "   3. Add the TXT record at your registrar and wait for DNS propagation."
    yellow "   4. Re-run this script once verified."
    echo
    MAPPING_FAILED=1
  else
    green "Mapping created for $domain"
  fi
}

create_mapping "$APEX"
create_mapping "$WWW"

# ── Print DNS records ─────────────────────────────────────────────────────────
echo
bold "══════════════════════════════════════════════════"
bold " DNS records to add at your registrar"
bold "══════════════════════════════════════════════════"
echo
bold "Step A — Domain ownership verification (do this FIRST):"
echo "  1. Open: https://console.cloud.google.com/run/domains?project=$PROJECT_ID"
echo "  2. Copy the TXT verification value shown there."
echo "  3. At your registrar, add:"
echo "       Type: TXT   Host: @   Value: google-site-verification=<value>"
echo "  4. Wait ~5 min for TXT to propagate, then re-run this script."
echo
bold "Step B — Apex domain ($APEX) — DELETE any existing A records on @ first:"
echo "  Type: A   Host: @   Value: 216.239.32.21"
echo "  Type: A   Host: @   Value: 216.239.34.21"
echo "  Type: A   Host: @   Value: 216.239.36.21"
echo "  Type: A   Host: @   Value: 216.239.38.21"
echo
bold "Step C — www subdomain:"
echo "  Type: CNAME   Host: www   Value: ghs.googlehosted.com"
echo
bold "══════════════════════════════════════════════════"
echo
yellow "Monitor DNS propagation:"
yellow "  dig +short $APEX A          # should return 4 Google IPs"
yellow "  dig +short $WWW CNAME       # should return ghs.googlehosted.com"
echo
yellow "GCP auto-provisions SSL (~15–30 min after DNS resolves)."
yellow "Track status: https://console.cloud.google.com/run/domains?project=$PROJECT_ID"
echo

if [ "$MAPPING_FAILED" -eq 1 ]; then
  yellow "⚠  One or more mappings could not be created yet."
  yellow "   Complete domain verification (Step A above) and re-run this script."
else
  green "All done! SSL will provision automatically once DNS resolves (~15–30 min)."
fi
