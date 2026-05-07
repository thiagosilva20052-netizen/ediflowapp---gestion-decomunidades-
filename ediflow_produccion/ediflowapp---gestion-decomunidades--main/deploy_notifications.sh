#!/usr/bin/env bash
set -euo pipefail

# deploy_notifications.sh
# - Sets VAPID + Resend secrets in Supabase (does NOT touch SUPABASE_ reserved vars)
# - Deploys the `sendPush` Edge Function
# - Installs deps and starts the app in dev mode
# Usage: `bash ./deploy_notifications.sh` (ensure you have `npx` and `bash` available)

echo "[deploy] Loading .env (if present)"
if [ -f .env ]; then
  # export simple KEY=VALUE pairs (naive parser, avoids lines starting with #)
  while IFS='=' read -r key val; do
    if [[ "$key" =~ ^[A-Z0-9_]+$ ]]; then
      # remove possible surrounding quotes
      val="${val%"}"; val="${val#"}"
      eval "export $key=\"$val\""
    fi
  done < <(grep -E '^[A-Z0-9_]+=.*' .env || true)
fi

if [ -z "${PROJECT_REF:-}" ]; then
  # try to derive from SUPABASE_URL or VITE_SUPABASE_URL
  URL="${SUPABASE_URL:-${VITE_SUPABASE_URL:-}}"
  if [ -n "$URL" ]; then
    HOST=$(echo "$URL" | sed -E 's#https?://##' | sed -E 's#/.*##')
    PROJECT_REF=$(echo "$HOST" | sed -E 's/\.supabase\.co$//')
  fi
fi

if [ -z "${PROJECT_REF:-}" ]; then
  echo "[deploy][error] PROJECT_REF not set and could not be inferred. Export PROJECT_REF or set SUPABASE_URL in .env." >&2
  exit 1
fi

echo "[deploy] Using project ref: $PROJECT_REF"

# Ensure we have VAPID keys
if [ -z "${VAPID_PRIVATE_KEY:-}" ] || [ -z "${VAPID_PUBLIC_KEY:-}" ]; then
  echo "[deploy] VAPID keys not found in env; generating new keys (web-push)..."
  JSON=$(npx web-push generate-vapid-keys --json)
  VAPID_PUBLIC_KEY=$(echo "$JSON" | sed -n 's/.*"publicKey":"\([^"]*\)".*/\1/p')
  VAPID_PRIVATE_KEY=$(echo "$JSON" | sed -n 's/.*"privateKey":"\([^"]*\)".*/\1/p')
  echo "[deploy] Generated VAPID public key: ${VAPID_PUBLIC_KEY:0:6}..."
fi

echo "[deploy] Preparing to set secrets in Supabase (VAPID, RESEND_API_KEY if present)"

# Build secrets command (omit empty values). Do NOT set SUPABASE_ variables here.
SECRETS_CMD=(npx supabase secrets set)
SECRETS_CMD+=("VAPID_PRIVATE_KEY=$VAPID_PRIVATE_KEY")
SECRETS_CMD+=("VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY")
if [ -n "${RESEND_API_KEY:-}" ]; then
  SECRETS_CMD+=("RESEND_API_KEY=$RESEND_API_KEY")
fi
SECRETS_CMD+=("--project-ref" "$PROJECT_REF")

echo "[deploy] Running: ${SECRETS_CMD[*]}"
"${SECRETS_CMD[@]}"

echo "[deploy] Deploying Edge Function 'sendPush'"
npx supabase functions deploy sendPush --project-ref "$PROJECT_REF"

echo "[deploy] Installing dependencies and starting dev server (this will block)."
echo "If you want to run the server separately, run: npm install && npm run dev"

npm install
npm run dev
