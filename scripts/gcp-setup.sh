#!/usr/bin/env bash
# GCP setup script for respa-dot-id → Cloud Run
# Run this locally or paste into GCP Cloud Shell.
# Safe to re-run — all steps are idempotent.

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
PROJECT_ID="${GCP_PROJECT_ID:-respa-dot-id}"
REGION="asia-southeast2"
REPO="respa-dot-id"
SA_NAME="github-actions"
POOL_ID="github-pool"
PROVIDER_ID="github-provider"
GITHUB_REPO="rezpaditya/respa-dot-id"
# ─────────────────────────────────────────────────────────────────────────────

green()  { echo -e "\033[32m$*\033[0m"; }
yellow() { echo -e "\033[33m$*\033[0m"; }
bold()   { echo -e "\033[1m$*\033[0m"; }
step()   { echo; bold "── $* ──────────────────────────────────────"; }

# ── 0. Check gcloud ───────────────────────────────────────────────────────────
if ! command -v gcloud &>/dev/null; then
  echo "gcloud CLI not found."
  echo "Install it from: https://cloud.google.com/sdk/docs/install"
  echo "Or open Cloud Shell at: https://shell.cloud.google.com"
  exit 1
fi

step "1 / 6  Authenticate & project"
if ! gcloud auth print-access-token &>/dev/null; then
  yellow "Not logged in — opening browser login..."
  gcloud auth login
fi

# Create project if it doesn't exist
if ! gcloud projects describe "$PROJECT_ID" &>/dev/null; then
  yellow "Creating project: $PROJECT_ID"
  gcloud projects create "$PROJECT_ID" --name="$PROJECT_ID"
else
  green "Project $PROJECT_ID already exists — skipping create"
fi

gcloud config set project "$PROJECT_ID"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
green "Project: $PROJECT_ID  (number: $PROJECT_NUMBER)"

# ── 1. Billing check ──────────────────────────────────────────────────────────
BILLING=$(gcloud billing projects describe "$PROJECT_ID" --format="value(billingEnabled)" 2>/dev/null || echo "false")
if [ "$BILLING" != "True" ]; then
  echo
  yellow "⚠  Billing is not enabled on this project."
  yellow "   Cloud Run free tier requires billing to be enabled (you won't be charged under the free limits)."
  yellow "   Enable it at: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
  echo
  read -r -p "Press Enter once billing is enabled, or Ctrl+C to abort... "
fi

# ── 2. Enable APIs ────────────────────────────────────────────────────────────
step "2 / 6  Enable APIs"
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  --project="$PROJECT_ID"
green "APIs enabled"

# ── 3. Artifact Registry ──────────────────────────────────────────────────────
step "3 / 6  Artifact Registry"
if ! gcloud artifacts repositories describe "$REPO" \
     --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
  gcloud artifacts repositories create "$REPO" \
    --repository-format=docker \
    --location="$REGION" \
    --project="$PROJECT_ID" \
    --description="respa.id website Docker images"
  green "Repository created: $REPO"
else
  green "Repository already exists — skipping"
fi

# ── 4. Service account ────────────────────────────────────────────────────────
step "4 / 6  Service account & IAM roles"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

if ! gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" &>/dev/null; then
  gcloud iam service-accounts create "$SA_NAME" \
    --display-name="GitHub Actions" \
    --project="$PROJECT_ID"
  green "Service account created: $SA_EMAIL"
else
  green "Service account already exists — skipping create"
fi

# Cloud Run admin
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/run.admin" \
  --condition=None \
  --quiet

# Artifact Registry writer
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/artifactregistry.writer" \
  --condition=None \
  --quiet

# Service account user on the Compute default SA (needed for Cloud Run deployments)
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
gcloud iam service-accounts add-iam-policy-binding "$COMPUTE_SA" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/iam.serviceAccountUser" \
  --project="$PROJECT_ID" \
  --quiet

green "IAM roles granted"

# ── 5. Workload Identity Federation ───────────────────────────────────────────
step "5 / 6  Workload Identity Federation"

# Pool
if ! gcloud iam workload-identity-pools describe "$POOL_ID" \
     --location="global" --project="$PROJECT_ID" &>/dev/null; then
  gcloud iam workload-identity-pools create "$POOL_ID" \
    --location="global" \
    --display-name="GitHub Actions Pool" \
    --project="$PROJECT_ID"
  green "Identity pool created"
else
  green "Identity pool already exists — skipping"
fi

# Provider
if ! gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" \
     --location="global" \
     --workload-identity-pool="$POOL_ID" \
     --project="$PROJECT_ID" &>/dev/null; then
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
    --location="global" \
    --workload-identity-pool="$POOL_ID" \
    --display-name="GitHub Provider" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
    --attribute-condition="attribute.repository=='${GITHUB_REPO}'" \
    --project="$PROJECT_ID"
  green "OIDC provider created"
else
  green "OIDC provider already exists — skipping"
fi

# Allow the pool to impersonate the service account
PRINCIPAL="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${GITHUB_REPO}"
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --member="$PRINCIPAL" \
  --role="roles/iam.workloadIdentityUser" \
  --project="$PROJECT_ID" \
  --quiet
green "Workload Identity binding set"

# ── 6. Print GitHub Secrets ───────────────────────────────────────────────────
step "6 / 6  GitHub Secrets"

PROVIDER_FULL=$(gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_ID" \
  --project="$PROJECT_ID" \
  --format="value(name)")

echo
bold "Go to: https://github.com/${GITHUB_REPO}/settings/secrets/actions"
bold "Add these three repository secrets:"
echo
echo "  Secret name                      Value"
echo "  ──────────────────────────────── ────────────────────────────────────────────────────"
printf "  %-32s %s\n" "GCP_PROJECT_ID"                  "$PROJECT_ID"
printf "  %-32s %s\n" "GCP_WORKLOAD_IDENTITY_PROVIDER"  "$PROVIDER_FULL"
printf "  %-32s %s\n" "GCP_SERVICE_ACCOUNT"             "$SA_EMAIL"
echo
green "All done! Merge (or push) to main to trigger your first deploy."
