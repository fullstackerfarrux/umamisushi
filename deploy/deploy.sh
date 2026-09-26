#!/usr/bin/env bash
# Build locally and upload to the server (app.umamisushibot.uz).
# The server disk is nearly full, so we build here and ship only dist/.
set -euo pipefail
cd "$(dirname "$0")/.."

SERVER="ubuntu@16.171.151.190"

yarn build
rsync -az --delete dist/ "$SERVER:/var/www/umamisushi/"
echo "Deployed to https://app.umamisushibot.uz"
