# Create and Deploy Docusaurus to GitHub Pages

This guide starts with an empty GitHub repository. It covers creating Docusaurus, configuring it, adding automatic deployment, and publishing the first version.

The examples use:

| Setting | Example |
| --- | --- |
| GitHub organization | `codetinker-dev` |
| Repository | `handbook` |
| Default branch | `master` |
| Docusaurus directory | `codetinker` |
| Published URL | `https://codetinker-dev.github.io/handbook/` |

Replace these values for a different project.

## 1. Install the prerequisites

Install Git, Node.js 20 or newer, and npm. Confirm they are available:

```bash
git --version
node --version
npm --version
```

## 2. Create and clone the repository

Create an empty repository on GitHub, then clone it:

```bash
git clone https://github.com/codetinker-dev/handbook.git
cd handbook
```

## 3. Create Docusaurus

From the repository root, create a TypeScript site with the classic template:

```bash
npx create-docusaurus@latest codetinker classic --typescript
```

This creates the complete site under `codetinker`:

```text
handbook/
├── codetinker/
│   ├── docs/
│   ├── src/
│   ├── static/
│   ├── docusaurus.config.ts
│   ├── package.json
│   ├── package-lock.json
│   └── sidebars.ts
└── .git/
```

Preview the generated site:

```bash
cd codetinker
npm run start
```

It normally opens at `http://localhost:3000`.

## 4. Configure Docusaurus

Replace `codetinker/docusaurus.config.ts` with this complete configuration. Update its names and links for the new project.

```ts
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'CodeTinker Handbook',
  tagline: 'Documentation and team handbook',
  favicon: 'img/favicon.ico',

  // GitHub Pages host; do not include the repository path.
  url: 'https://codetinker-dev.github.io',

  // Project sites use /<repository-name>/.
  baseUrl: '/handbook/',

  organizationName: 'codetinker-dev',
  projectName: 'handbook',
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/codetinker-dev/handbook/tree/master/codetinker/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'CodeTinker Handbook',
      logo: {
        alt: 'CodeTinker logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/codetinker-dev/handbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} CodeTinker.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
```

`routeBasePath: '/'` makes the documentation the home page. Delete the generated `src/pages/index.tsx` if Docusaurus reports that it conflicts with the docs route.

For another normal project site, use:

```ts
url: 'https://<github-account>.github.io',
baseUrl: '/<repository-name>/',
organizationName: '<github-account>',
projectName: '<repository-name>',
```

Keep both `/` characters in `baseUrl`. If the repository is named `<account>.github.io`, it is served at the domain root and must use `baseUrl: '/'`.

## 5. Test the production build

Run these commands from `codetinker`:

```bash
npm run typecheck
npm run build
npm run serve
```

The deployable static website is generated in `codetinker/build`. Fix build errors before continuing.

## 6. Add automatic deployment

At the repository root, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy handbook to GitHub Pages

on:
  push:
    branches:
      - master
    paths:
      - "codetinker/**"
      - ".github/workflows/deploy.yml"
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: handbook-production
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: codetinker

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: codetinker/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Type-check
        run: npm run typecheck

      - name: Build Docusaurus
        run: npm run build

      - name: Upload website
        uses: actions/upload-pages-artifact@v3
        with:
          path: codetinker/build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy website
        id: deployment
        uses: actions/deploy-pages@v4
```

For another project, update:

- `master` if the default branch is `main` or another name.
- Every `codetinker` path if Docusaurus is in another directory.
- `handbook-production` to a unique name for the site.

If Docusaurus is at the repository root, remove `defaults.run.working-directory`, use `package-lock.json` for `cache-dependency-path`, and upload `build`.

## 7. Enable GitHub Pages

In the GitHub repository:

1. Open **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

No personal access token or `gh-pages` branch is required by this workflow.

## 8. Commit and deploy

From the repository root:

```bash
git add codetinker .github/workflows/deploy.yml
git commit -m "set up Docusaurus GitHub Pages deployment"
git push origin master
```

Use `main` instead of `master` when appropriate. Open the repository's **Actions** tab and confirm that both the `build` and `deploy` jobs pass.

The example site will appear at:

```text
https://codetinker-dev.github.io/handbook/
```

The first deployment can take a few minutes to become available.

## 9. Add documentation

Create Markdown or MDX files under `codetinker/docs`. For example, add `codetinker/docs/introduction.md`:

```md
---
sidebar_position: 1
title: Introduction
---

# Introduction

Welcome to the project documentation.
```

The generated `sidebars.ts` normally discovers files in `docs` automatically. Use `npm run start` to preview changes.

## Optional build variables

To provide a public, non-secret build value such as an API URL, change the build step to:

```yaml
- name: Build Docusaurus
  env:
    BACKEND_API_URL: ${{ vars.BACKEND_API_URL }}
  run: npm run build
```

Create it under **Settings** > **Secrets and variables** > **Actions** > **Variables**. Never expose passwords or private keys through Docusaurus: visitors can inspect values compiled into a static website.

## Custom domains

For a site at `https://docs.example.com`, use:

```ts
url: 'https://docs.example.com',
baseUrl: '/',
```

Create `codetinker/static/CNAME` containing:

```text
docs.example.com
```

Configure the same domain and its DNS records under **Settings** > **Pages**. Do not keep a `CNAME` file when using the normal `github.io/<repository>/` address.

## Troubleshooting

### “Your Docusaurus site did not load properly”

The deployed path and `baseUrl` do not match. A site published at `https://codetinker-dev.github.io/handbook/` must use:

```ts
baseUrl: '/handbook/',
```

### CSS, JavaScript, or images return 404

Confirm that `baseUrl` exactly matches the repository path and includes leading and trailing slashes. Rebuild and redeploy after changing it.

### The workflow does not start

Confirm that the pushed branch matches `on.push.branches`, a changed file matches `on.push.paths`, and the workflow is under `.github/workflows`. `workflow_dispatch` also provides a manual **Run workflow** button.

### `npm ci` fails

Ensure `package-lock.json` is committed and `cache-dependency-path` points to it. Run `npm install` locally to generate or update the lockfile.

### Build succeeds but deployment fails

Confirm that **Settings** > **Pages** uses **GitHub Actions** as its source and that the workflow has `pages: write` and `id-token: write` permissions.

If `actions/deploy-pages` reports `HttpError: Not Found` or status `404`, GitHub
Pages has not been enabled for the repository. An administrator must perform the
one-time setup in **Settings** > **Pages** by selecting **GitHub Actions** as the
publishing source, then rerun the failed workflow. The commit author's Git email
address does not control deployment authorization; the workflow uses the
repository's `GITHUB_TOKEN` and the permissions declared in the workflow.

## Final structure

```text
handbook/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── codetinker/
│   ├── docs/
│   ├── src/
│   ├── static/
│   ├── docusaurus.config.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── sidebars.ts
│   └── tsconfig.json
└── GITHUB_PAGES_DEPLOYMENT.md
```

Official references:

- [Docusaurus installation](https://docusaurus.io/docs/installation)
- [Docusaurus deployment](https://docusaurus.io/docs/deployment)
