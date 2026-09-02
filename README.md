# Personal Projects Portal

Personal projects and usage. A central hub and collection of standalone personal projects, web experiments, and interactive tools.

## Architecture

- **Root Hub**: [index.html](file:///c:/Users/govin/Desktop/work/govind%20personal/index.html) - Landing dashboard that indexes and links to all projects.
- **Projects Directory**: Each individual project lives inside its own isolated folder under `projects/<project-name>/`:
  - `projects/<project-name>/index.html`
  - `projects/<project-name>/style.css` (or project-specific styles)
  - `projects/<project-name>/script.js` (or project-specific scripts)
- **Deployment**: Hosted statically on Cloudflare Pages from repository root (`/`).

## Project Guidelines

- **Distinct Design & Language**: Each new personal project created must have its own new visual design, aesthetic, and design language. **Do not adapt or inherit the design from the main project hub page.** Every project should feel like a standalone, bespoke creation tailored to its specific purpose.

## Adding a New Project

1. Duplicate the template folder:
   ```bash
   cp -r projects/template projects/my-new-project
   ```
2. Build your project inside `projects/my-new-project/`.
3. Add the project card entry into the project directory inside `index.html`.

