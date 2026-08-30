# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Govind (creator/developer) and visitors/evaluators exploring personal web experiments, interactive prototypes, and standalone tools.

## Product Purpose

A central personal launcher and showcase to explore, test, and host standalone interactive tools, visual prototypes, and creative web experiments.

## Positioning

A zero-friction, modular personal workspace and showcase where each project or experiment lives in its own isolated directory while being indexed and searchable from a unified root dashboard.

## Operating Context

Hosted statically on Cloudflare Pages from the repository root (`/`). Accessed across modern desktop and mobile browsers.

## Capabilities and Constraints

- Central root hub (`index.html` + `style.css`) providing instant client-side search, tag/category filtering, and responsive project grid.
- Modular subprojects located in `projects/<project-name>/` (supporting standalone static HTML/CSS/JS or modern client frameworks over time).
- Subprojects remain isolated to avoid dependency and styling conflicts across experiments.
- Static hosting constraint on Cloudflare Pages.

## Brand Commitments

- Name: Govind's Projects / Personal Projects Portal
- Repository: `gov33/Personal`
- Incumbent aesthetic: Deep dark mode, subtle ambient glows, modern typography (Inter + JetBrains Mono), sleek card elevation, and clean micro-interactions.

## Evidence on Hand

- Root dashboard (`index.html`, `style.css`) with live search and filter controls.
- Starter template folder at `projects/template/` (`index.html`, `style.css`, `script.js`).
- Repository documentation (`README.md`).

## Product Principles

- **Modular Isolation**: Every experiment or tool is self-contained within its own directory.
- **Fast Discovery**: Instant client-side search and filtering from the central launcher.
- **High Craft & Polish**: Premium visual hierarchy, responsive layout, smooth interactions, and attention to detail.
- **Frictionless Scaffolding**: Fast duplication and experimentation with minimal boilerplate.

## Accessibility & Inclusion

- Responsive layout across mobile and desktop viewport sizes.
- Semantic HTML tags, clear visual focus states, and accessible contrast ratios.
