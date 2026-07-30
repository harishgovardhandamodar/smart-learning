# Smart Learning

Adaptive STEM learning platform for children, with AI-generated deep dive curricula.

## Setup

```bash
docker compose up -d --build
```

The app runs at `http://localhost:14101`.

## CLI: Generate Physics Deep Dives

Uses Ollama-compatible models to generate 4-week physics curricula for 10-11 year olds.

```bash
# English (default)
node scripts/generate-physics.js

# Dutch
node scripts/generate-physics.js --locale nl

# Both locales
node scripts/generate-physics.js --both

# Custom model
node scripts/generate-physics.js --model gemma4:31b
node scripts/generate-physics.js --model glm-4.7-flash:bf16

# Custom API endpoint
node scripts/generate-physics.js --api http://localhost:8081/v1
```

Generated files land in `public/` and are served by the app at `/physics-deep-dive-en.json` and `/physics-deep-dive-nl.json`. On page load, the app auto-fetches the locale-appropriate file and caches it in localStorage.

The script generates one week at a time (4 API calls per locale) to avoid context-window limits. It retries automatically if a week produces fewer than 7 days.

### Recommended models

| Model | Speed | Quality |
|---|---|---|
| `llama3.2:3b` (default) | Fast | Good |
| `glm-4.7-flash:bf16` | Fast | Better |
| `gemma4:31b` | Slow | Best |

## Architecture

- Vue 3 SPA served by nginx
- Ollama-compatible API (hive-server) for AI generation
- Locale-aware content via `/physics-deep-dive-{locale}.json`
