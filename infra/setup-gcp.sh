#!/usr/bin/env bash
# One-time GCP setup for deploying the API to Cloud Run. Run it in Cloud Shell:
#
#   bash infra/setup-gcp.sh <PROJECT_ID>
#
# Safe to run again: existing resources are left as they are, and IAM bindings
# are additive. It asks for the Neon connection string without echoing it; press
# Enter to keep the one already stored. The .github/workflows/deploy-api.yml
# workflow relies on every name below.
set -euo pipefail

PROJECT_ID="${1:?usage: bash infra/setup-gcp.sh <PROJECT_ID>}"
export CLOUDSDK_CORE_PROJECT="$PROJECT_ID"

REGION=europe-west1
REPO=api            # Artifact Registry repository
SERVICE=api         # Cloud Run service
SECRET=database-url # Secret Manager secret with the Neon connection string
GITHUB_REPO=acmfeup/new-website
POOL=github
PROVIDER=github-actions
RUNTIME_SA="api-runtime@$PROJECT_ID.iam.gserviceaccount.com"
DEPLOYER_SA="github-deployer@$PROJECT_ID.iam.gserviceaccount.com"

step() { printf '\n==> %s\n' "$*"; }
# The describe calls are existence checks; their "not found" output is noise.
exists() { "$@" >/dev/null 2>&1; }

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"

step "Enabling APIs"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  secretmanager.googleapis.com iam.googleapis.com iamcredentials.googleapis.com \
  sts.googleapis.com cloudresourcemanager.googleapis.com

step "Artifact Registry repository '$REPO'"
if ! exists gcloud artifacts repositories describe "$REPO" --location="$REGION"; then
  gcloud artifacts repositories create "$REPO" --location="$REGION" \
    --repository-format=docker --description="API images, pushed by GitHub Actions"
fi
# Keep the 10 newest images (enough to roll back) and delete the rest.
policy="$(mktemp)"
cat >"$policy" <<'JSON'
[
  {"name": "keep-recent", "action": {"type": "Keep"}, "mostRecentVersions": {"keepCount": 10}},
  {"name": "delete-old", "action": {"type": "Delete"}, "condition": {"tagState": "any"}}
]
JSON
gcloud artifacts repositories set-cleanup-policies "$REPO" --location="$REGION" \
  --policy="$policy" --no-dry-run >/dev/null
rm -f "$policy"

step "Secret '$SECRET'"
if ! exists gcloud secrets describe "$SECRET"; then
  gcloud secrets create "$SECRET" --replication-policy=user-managed --locations="$REGION"
fi
has_version="$(gcloud secrets versions list "$SECRET" --filter='state:ENABLED' --limit=1 --format='value(name)')"
while true; do
  prompt="Neon direct connection string"
  [ -n "$has_version" ] && prompt="$prompt (Enter keeps the current one)"
  read -rsp "$prompt: " url
  echo
  if [ -z "$url" ] && [ -n "$has_version" ]; then
    echo "Keeping the current version."
    break
  fi
  case "$url" in
    postgres://* | postgresql://*) ;;
    *) echo "That does not look like a postgres:// URL. Try again."; continue ;;
  esac
  case "$url" in
    *-pooler.*) echo "That is the pooled host (-pooler). Use the direct connection string."; continue ;;
  esac
  printf '%s' "$url" | gcloud secrets versions add "$SECRET" --data-file=- >/dev/null
  echo "Stored a new version."
  break
done
unset url

step "Service accounts"
if ! exists gcloud iam service-accounts describe "$RUNTIME_SA"; then
  gcloud iam service-accounts create api-runtime --display-name="API (Cloud Run runtime)"
fi
if ! exists gcloud iam service-accounts describe "$DEPLOYER_SA"; then
  gcloud iam service-accounts create github-deployer --display-name="GitHub Actions deployer"
fi

step "Permissions"
# Runtime: read this one secret, nothing else.
gcloud secrets add-iam-policy-binding "$SECRET" --member="serviceAccount:$RUNTIME_SA" \
  --role=roles/secretmanager.secretAccessor >/dev/null
# Deployer: push images to this repository, deploy the service and the
# migration job, and run them as the runtime account. It has no direct access to
# the secret, but code it deploys runs with it: whoever controls what this
# account deploys (the deploy workflow on main) can reach the connection string.
gcloud artifacts repositories add-iam-policy-binding "$REPO" --location="$REGION" \
  --member="serviceAccount:$DEPLOYER_SA" --role=roles/artifactregistry.writer >/dev/null
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$DEPLOYER_SA" \
  --role=roles/run.developer --condition=None >/dev/null
gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_SA" \
  --member="serviceAccount:$DEPLOYER_SA" --role=roles/iam.serviceAccountUser >/dev/null

step "Workload Identity Federation for $GITHUB_REPO"
# The numeric id, not the name: a deleted repo's name can be taken by someone else.
repo_id="$(curl -fsS "https://api.github.com/repos/$GITHUB_REPO" | jq -r .id)" || repo_id=""
if [ -z "$repo_id" ]; then
  read -rp "Could not look up the GitHub repo id. Enter it (gh api repos/$GITHUB_REPO --jq .id): " repo_id
fi
# Only the deploy workflow, running on main of this repo, gets credentials. PRs,
# forks, other branches and any other workflow on main (say a future
# pull_request_target one) are rejected before any role is checked.
condition="assertion.repository_id=='$repo_id' && assertion.ref=='refs/heads/main' && assertion.job_workflow_ref=='$GITHUB_REPO/.github/workflows/deploy-api.yml@refs/heads/main'"
mapping="google.subject=assertion.sub,attribute.repository_id=assertion.repository_id,attribute.ref=assertion.ref"
if ! exists gcloud iam workload-identity-pools describe "$POOL" --location=global; then
  gcloud iam workload-identity-pools create "$POOL" --location=global --display-name="GitHub Actions"
fi
if exists gcloud iam workload-identity-pools providers describe "$PROVIDER" \
  --workload-identity-pool="$POOL" --location=global; then
  gcloud iam workload-identity-pools providers update-oidc "$PROVIDER" \
    --workload-identity-pool="$POOL" --location=global \
    --attribute-mapping="$mapping" --attribute-condition="$condition" >/dev/null
else
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" \
    --workload-identity-pool="$POOL" --location=global --display-name="GitHub Actions" \
    --issuer-uri=https://token.actions.githubusercontent.com \
    --attribute-mapping="$mapping" --attribute-condition="$condition"
fi
gcloud iam service-accounts add-iam-policy-binding "$DEPLOYER_SA" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL/attribute.repository_id/$repo_id" \
  >/dev/null

step "Cloud Run service '$SERVICE'"
# Created here with a placeholder image so that making it public stays a human
# decision: the deployer can deploy new revisions but cannot change IAM.
if ! exists gcloud run services describe "$SERVICE" --region="$REGION"; then
  gcloud run deploy "$SERVICE" --region="$REGION" \
    --image=us-docker.pkg.dev/cloudrun/container/hello \
    --service-account="$RUNTIME_SA" --no-allow-unauthenticated \
    --min-instances=0 --max-instances=1
fi
if ! err="$(gcloud run services add-iam-policy-binding "$SERVICE" --region="$REGION" \
  --member=allUsers --role=roles/run.invoker 2>&1 >/dev/null)"; then
  if grep -qiE 'allowedPolicyMemberDomains|permitted customer|FAILED_PRECONDITION' <<<"$err"; then
    cat >&2 <<EOF

The API could not be made public: an organisation policy on this project
(iam.allowedPolicyMemberDomains, "Domain restricted sharing") forbids granting
roles to allUsers. The site calls the API from the browser, so it has to be public.

What to do, then run this script again:
  - Ask an organisation admin to override the policy for this project
    (IAM & Admin > Organization Policies > "Domain restricted sharing" >
    Manage policy > Override parent's policy > Allow all), or
  - Create the project outside the organisation (no organisation).
EOF
  else
    echo "$err" >&2
  fi
  exit 1
fi

url="$(gcloud run services describe "$SERVICE" --region="$REGION" --format='value(status.url)')"

cat <<EOF

Done. Add these as GitHub Actions *variables* (Settings > Secrets and variables >
Actions > Variables), not secrets:

  GCP_PROJECT_ID    = $PROJECT_ID
  GCP_WIF_PROVIDER  = projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL/providers/$PROVIDER
  GCP_DEPLOYER_SA   = $DEPLOYER_SA

API URL, for NEXT_PUBLIC_API_URL on Vercel:

  $url
EOF
