#!/bin/zsh
set -e

cd "$(dirname "$0")"
PORT="${PORT:-8080}"

echo "Under the Hood is running at http://127.0.0.1:${PORT}"
echo "Keep this window open. Press Control-C to stop the app."
python3 -m http.server "$PORT" --bind 127.0.0.1
