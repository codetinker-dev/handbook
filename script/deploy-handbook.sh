#!/usr/bin/env bash
set -euo pipefail

target_sha=${1:-}
deploy_root=${2:-}
retain_count=${3:-5}
archive="/tmp/handbook-build.tar.gz"
uploaded_script="/tmp/deploy-handbook.sh"

fail() {
  printf 'Handbook deploy: %s\n' "$*" >&2
  exit 1
}

[[ "$target_sha" =~ ^[a-f0-9]{40}$ ]] || fail 'Expected a full Git commit SHA.'
[[ "$deploy_root" == /* && "$deploy_root" != / ]] || fail 'Deploy path must be an absolute directory other than /.'
[[ "$retain_count" =~ ^[1-9][0-9]*$ ]] || fail 'Retention count must be a positive integer.'
[[ -f "$archive" ]] || fail "Build archive is missing at $archive."
command -v flock tar >/dev/null || fail 'The server requires flock and tar.'

releases_dir="$deploy_root/releases"
release_dir="$releases_dir/$target_sha"
temporary_dir="$releases_dir/.${target_sha}.tmp"
lock_file="$deploy_root/.deploy.lock"

mkdir -p "$releases_dir"
exec 9>"$lock_file"
flock -n 9 || fail 'Another handbook deployment is running.'

cleanup() {
  rm -f "$archive" "$uploaded_script"
  if [[ -d "$temporary_dir" ]]; then
    rm -rf -- "$temporary_dir"
  fi
}
trap cleanup EXIT

if [[ ! -d "$release_dir" ]]; then
  mkdir "$temporary_dir"
  tar -xzf "$archive" -C "$temporary_dir"
  [[ -f "$temporary_dir/index.html" ]] || fail 'The Docusaurus build does not contain index.html.'
  mv "$temporary_dir" "$release_dir"
fi

ln -sfn "releases/$target_sha" "$deploy_root/.current-$target_sha"
mv -Tf "$deploy_root/.current-$target_sha" "$deploy_root/current"

mapfile -t old_releases < <(
  find "$releases_dir" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
    | sort -rn \
    | tail -n "+$((retain_count + 1))" \
    | cut -d' ' -f2-
)

for old_release in "${old_releases[@]}"; do
  [[ "$old_release" == "$releases_dir/"* ]] || fail 'Refusing to remove a release outside the releases directory.'
  [[ "$old_release" != "$release_dir" ]] || continue
  rm -rf -- "$old_release"
done

printf 'Deployed handbook commit %s to %s/current.\n' "$target_sha" "$deploy_root"
