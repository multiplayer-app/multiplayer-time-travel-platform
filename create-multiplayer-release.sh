#!/usr/bin/env bash
# shellcheck disable=SC2155 disable=SC1090

SERVICE_NAME=$(basename "${PWD}")

RELEASE_NOTES="[GitHub commit: ${COMMIT_SHORT}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${COMMIT_SHA}) / [GitHub branch: ${BRANCH_NAME}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/compare/${PARENT_BRANCH})"

PROJECT_BRANCH_ID=$(curl --silent -H "X-API-KEY:$MULTIPLAYER_API_KEY" -H "Content-Type:application/json" "$MULTIPLAYER_HOST/version/workspaces/$MULTIPLAYER_WORKSPACE_ID/projects/$MULTIPLAYER_PROJECT_ID/branches/default" | jq -r -c '._id')

echo "project_branch_id=$PROJECT_BRANCH_ID"
echo "service_name=$SERVICE_NAME"

ENTITY_ID=$(curl --silent -H "X-API-KEY:$MULTIPLAYER_API_KEY" -H "Content-Type:application/json" "$MULTIPLAYER_HOST/version/workspaces/$MULTIPLAYER_WORKSPACE_ID/projects/$MULTIPLAYER_PROJECT_ID/branches/$PROJECT_BRANCH_ID/entities?key=$SERVICE_NAME&type=platform_component&limit=1&skip=0" | jq -r -c '.data[0].entityId')

echo "entity_id=$ENTITY_ID"

BODY='{"entity":"'$ENTITY_ID'","version":"'$SERVICE_VERSION'","releaseNotes": "'$RELEASE_NOTES'"}'

echo "release_body_payload=$BODY"

curl -X POST --write-out %{http_code} --silent --output /dev/null -H "X-API-KEY:$MULTIPLAYER_API_KEY" -H "Content-Type:application/json" -d "$BODY" "$MULTIPLAYER_HOST/version/workspaces/$MULTIPLAYER_WORKSPACE_ID/projects/$MULTIPLAYER_PROJECT_ID/releases"
