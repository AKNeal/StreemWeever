# Streemweever

A directory of movies and TV shows and the streaming services that carry them,
at [streemweever.com](https://www.streemweever.com).

## Stack

Currently a single self-contained `index.html` (no build step). Hosted on Vercel
with auto-deploy from `main`.

## Local preview

Just open `index.html` in a browser, or serve the folder with any static server:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploying

Pushing to `main` triggers a Vercel deploy automatically. There's no build
command — Vercel serves the root of the repo as static.

## History

This repo previously hosted a podcasting studio app (also called "Streem
Weever") and a projection-mapping tool called "Screen Mapper". Those have been
moved into a separate local project (`NealMediaApps/`) and are no longer part
of the deployed site.
