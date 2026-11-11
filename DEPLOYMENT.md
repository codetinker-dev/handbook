# Handbook deployment

A push to `production` builds the Docusaurus site. Server deployment stays disabled until
`HANDBOOK_DEPLOY_ENABLED` is set to `true`. This lets the build workflow run safely
before server access is ready.

Normal handbook work can remain on `master` or a feature branch. Merge reviewed changes
into `production` only when they are ready to publish.

## Information to collect

Ask the person who manages the Ubuntu server or cloud account for:

| Value | Where it comes from |
|---|---|
| Server host or IP | Cloud provider console or the existing server administrator |
| SSH user | The account used to SSH into the server, commonly `ubuntu` |
| Domain | The DNS provider or the person who manages the company domain |
| Deploy path | Create `/var/www/handbook`, owned by the SSH deployment user |
| Backend API URL | The public URL of the Chase backend, ending in `/v1` |
| SSH host key | Run `ssh-keyscan` from a trusted network and verify it against the server |

The server administrator must install Nginx and point its document root at:

```text
/var/www/handbook/current
```

The deployment user must be able to create files under `/var/www/handbook` without
using `sudo`.

## GitHub repository variables

Configure these under **Settings → Secrets and variables → Actions → Variables**:

| Variable | Example |
|---|---|
| `BACKEND_API_URL` | `https://app.example.com/v1` |
| `HANDBOOK_BASE_URL` | `/` |
| `HANDBOOK_DEPLOY_ENABLED` | `false` initially; change to `true` after setup |
| `HANDBOOK_DEPLOY_PATH` | `/var/www/handbook` |
| `HANDBOOK_HEALTHCHECK_URL` | `https://handbook.example.com/` |
| `HANDBOOK_SSH_HOST` | Server IP or hostname |
| `HANDBOOK_SSH_KNOWN_HOSTS` | Verified OpenSSH host-key line |
| `HANDBOOK_SSH_USER` | `ubuntu` or a dedicated deployment user |
| `HANDBOOK_URL` | `https://handbook.example.com` |

Add `HANDBOOK_SSH_PRIVATE_KEY` under **Actions → Secrets**. Use a dedicated deployment
key, not a developer's personal SSH key.

## First release

### 1. Create the production branch

Run this once after the deployment changes have been committed to `master`:

```bash
git switch master
git pull --ff-only origin master
git switch -c production
git push -u origin production
git switch master
```

The workflow file must exist on `production`. In GitHub, protect the `production` branch
and require a pull request before merge if handbook publication needs approval.

### 2. Confirm the build before enabling deployment

1. Keep `HANDBOOK_DEPLOY_ENABLED` unset or set it to `false`.
2. Open a pull request from `master` into `production`.
3. Merge the pull request.
4. Open the repository's **Actions** tab.
5. Confirm **Build and deploy handbook** completes its build job. The deploy job should
   show as skipped.

### 3. Prepare the server

Ask the server administrator to:

1. Install Nginx if it is not already installed.
2. Create `/var/www/handbook`.
3. Give the SSH deployment user write access to that directory.
4. Configure the Nginx document root as `/var/www/handbook/current`.
5. Point the handbook domain to the server in DNS.
6. Install a TLS certificate for HTTPS.
7. Create a dedicated SSH deployment key and add its public key to the deployment
   user's `~/.ssh/authorized_keys` file.
8. Provide the server host, SSH user, verified SSH host key, handbook URL, and backend
   API URL.

### 4. Configure GitHub

1. Open the handbook repository on GitHub.
2. Go to **Settings → Secrets and variables → Actions**.
3. Add all variables listed above, but keep `HANDBOOK_DEPLOY_ENABLED=false`.
4. Add `HANDBOOK_SSH_PRIVATE_KEY` under **Secrets**.
5. Confirm the private key belongs to the dedicated public key installed on the server.
6. Change `HANDBOOK_DEPLOY_ENABLED=true` only after every other value is ready.

### 5. Run the first deployment

1. Open **Actions → Build and deploy handbook**.
2. Choose **Run workflow** and select the `production` branch.
3. Wait for both the build and deploy jobs to pass.
4. Open `HANDBOOK_HEALTHCHECK_URL` in a private browser window.
5. Confirm login and static assets load correctly.

If the deploy job fails, change `HANDBOOK_DEPLOY_ENABLED=false` while correcting the
server configuration. The previously active release remains available.

## Publishing future handbook changes

For each publication:

1. Make and test the documentation changes on a feature branch or `master`.
2. Commit and push the changes.
3. Open a pull request into `production`.
4. Review the generated changes and merge the pull request.
5. Watch **Actions → Build and deploy handbook**.
6. Confirm the health check passes.

No SSH, Nginx, or server commands should be needed after the one-time setup.

Each release is stored under `releases/<commit-sha>`. The `current` symlink changes
atomically, and only the five newest releases are retained.
