[INFO] Use the correct node version before start:

  - Window
    - refer .nvmrc file to setup correct node version

  - Mac
    - `nvm use` To read the node version from .nvmrc

[INFO] Inside that directory, you can run several commands:

  `npm start`
    Starts the development server.

  `npm run build`
    Bundles your website into static files for production.

  `npm run serve`
    Serves the built website locally.

  `npm run deploy`
    Publishes the website to GitHub pages.

We recommend that you begin by typing:

  `cd codetinker`
  `npm start`

Happy building awesome websites!

## First-time setup for Git media checks

The repository blocks image, audio, and video files larger than **5 MiB**. The
check runs before each commit, including commits made from VS Code.

After cloning the repository, complete these steps once on each device:

1. Open a terminal in the cloned repository.
2. Select the project's Node.js version. On macOS or Linux with `nvm`, run:

   ```bash
   nvm use
   ```

   On Windows, install or select the Node.js version listed in `.nvmrc`.

3. Enter the website directory:

   ```bash
   cd codetinker
   ```

4. Install the dependencies and activate the Git pre-commit hook:

   ```bash
   npm install
   ```

5. Confirm that the media check works:

   ```bash
   npm run check:media
   ```

   A successful setup prints `Media size check passed`.

No additional command is needed for later commits. When you commit from the
terminal or VS Code, the hook checks staged media automatically. If a media
file exceeds 5 MiB, the commit is stopped and the terminal output identifies
the file that must be compressed or removed.

Run `npm install` again after pulling changes that modify `package.json` or
`package-lock.json`. GitHub Actions also performs the same check on pull
requests, so the limit remains enforced if a local hook is skipped.

## GitHub Pages deployment

See [GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md) for the complete reusable GitHub Actions and Docusaurus setup guide.
