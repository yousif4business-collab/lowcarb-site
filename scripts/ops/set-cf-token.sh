#!/usr/bin/env bash
# Identify a Cloudflare API token's account, prove it can reach the
# lowcarb-site Pages project, then set it as a GitHub Actions secret.
# The token is read with a hidden prompt, never echoed, never written to
# disk, and unset before exit.

set -u
ACCOUNT_4BUSINESS=1e548e685d0e40eb49b2b8683a02c3a3
REPO=yousif4business-collab/lowcarb-site
API=https://api.cloudflare.com/client/v4

printf 'Paste the Cloudflare API token (input hidden), then press Enter: '
read -rs CF
printf '\n\n'

if [ -z "${CF:-}" ]; then echo "no token entered — aborting"; exit 1; fi

say() { python3 -c "$1"; }

echo "1) token status"
curl -s -H "Authorization: Bearer $CF" "$API/user/tokens/verify" | say '
import sys, json
d = json.load(sys.stdin)
if d.get("success"):
    print("   ", d["result"].get("status"))
else:
    print("   FAILED:", [e.get("message") for e in d.get("errors", [])])
'

echo "2) accounts this token can see"
curl -s -H "Authorization: Bearer $CF" "$API/accounts" | say '
import sys, json
d = json.load(sys.stdin)
for a in (d.get("result") or []):
    print("   ", a["id"], a["name"])
if not d.get("success"):
    print("   FAILED:", [e.get("message") for e in d.get("errors", [])])
'

echo "3) can it see the lowcarb-site Pages project on 4business?"
VERDICT=$(curl -s -H "Authorization: Bearer $CF" \
  "$API/accounts/$ACCOUNT_4BUSINESS/pages/projects" | say '
import sys, json
d = json.load(sys.stdin)
if not d.get("success"):
    print("NO")
    sys.exit()
names = [p["name"] for p in (d.get("result") or [])]
print("YES" if "lowcarb-site" in names else "NO")
')

if [ "$VERDICT" = "YES" ]; then
  echo "    YES — correct account, deploys will work"
  echo
  echo "4) setting the GitHub secret"
  if printf '%s' "$CF" | gh secret set CLOUDFLARE_API_TOKEN -R "$REPO"; then
    echo
    gh secret list -R "$REPO"
  fi
else
  echo "    NO — this token cannot reach the lowcarb-site Pages project."
  echo
  echo "    Mint a new one while signed in as yousifabdulkareem4business@gmail.com:"
  echo "      dash.cloudflare.com -> My Profile -> API Tokens -> Create Token"
  echo "      -> Custom token -> Permissions: Account | Cloudflare Pages | Edit"
  echo "      -> Account Resources: Include | Yousifabdulkareem4business@gmail.com's Account"
  echo "    Secret NOT set. Re-run this script with the new token."
fi

unset CF
