// worker.js
// Located at: frontend/worker.js
// Serves your React SPA — passes all requests to static assets
// not_found_handling = "single-page-application" in wrangler.toml
// handles all React Router routes automatically

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};