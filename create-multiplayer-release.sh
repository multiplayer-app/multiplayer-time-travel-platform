#!/usr/bin/env bash
# shellcheck disable=SC2155 disable=SC1090

SERVICE_NAME=$(basename "${PWD}")

RELEASE_NOTES="[GitHub commit: ${COMMIT_SHORT}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${COMMIT_SHA}) / [GitHub branch: ${BRANCH_NAME}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/compare/${PARENT_BRANCH})"

SERVICE_NAME_ORIGINAL=$(basename "${PWD}")
SERVICE_NAME="${SERVICE_NAME_ORIGINAL/multiplayer-/}"
SERVICE_NAME="${SERVICE_NAME/-service/}"

multiplayer releases create \
  --api-key="$MULTIPLAYER_API_KEY" \
  --service="$SERVICE_NAME" \
  --repository-url="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}" \
  --commit-hash="$COMMIT_SHA" \
  --release-version="$SERVICE_VERSION" \
  --release-notes="$RELEASE_NOTES"
