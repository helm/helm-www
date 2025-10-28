#!/bin/bash

set -e
trap 'echo "Error on line $LINENO: Command failed with exit code $?"' ERR

# Parameters with defaults
BASE_REF=${1:-"dev-v3"}
HEAD_REF=${2:-"main"}

echo "Comparing ${HEAD_REF} against ${BASE_REF}..."

json='[]'
endCursor=''
pageCount=1
while [[ "${hasNextPage:-}" != "false" ]]; do
    # give some indication that things are happening and not just hanging
    echo "Processing page ${pageCount}..."

    out=$(gh api graphql \
    -F org=helm -F repo=helm \
    -F baseRef=${BASE_REF} -F headRef=${HEAD_REF} \
    -F endCursor=${endCursor:-} \
    -f query='
    query ($org: String!, $repo: String!, $baseRef: String!, $headRef: String!, $endCursor: String) {
      repository(owner: $org, name: $repo) {
        ref(qualifiedName: $baseRef) {
          compare(headRef: $headRef) {
            commits(first: 100, after: $endCursor) {
              pageInfo {
                hasNextPage
                endCursor
              }
              totalCount
              nodes {
                abbreviatedOid
                ## UNCOMMENT FOR CO-AUTHORS
                ## SEE commit authors doc
                ## REF https://docs.github.com/en/graphql/reference/objects#commit
                # oid
                # authors(first: 100) {
                #   nodes {
                #     user {
                #       login
                #     }
                #   }
                # }
                associatedPullRequests(first: 100) {
                  nodes {
                    number
                    title
                    mergedAt
                    author {
                      login
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }')
    ## DEBUG to find a commit with co-authors
    # echo ${out} | jq '.data.repository.ref.compare.commits.nodes[] | select(.oid=="8d964588cd3b54b470510ee9663eedba25c6186b")'
    # exit

    hasNextPage=$(jq '.data.repository.ref.compare.commits.pageInfo.hasNextPage' <<< "${out}")
    endCursor=$(jq -r '.data.repository.ref.compare.commits.pageInfo.endCursor' <<< "${out}")

    # do not include dependabot-authored PRs
    jsonchunks=$(jq '.data.repository.ref.compare.commits.nodes[].associatedPullRequests.nodes[] | select(.author.login != "dependabot")' <<< "${out}")
    jsonarray=$(jq --slurp <<< "${jsonchunks}")

    before=$(jq '. | map(.number) | length' <<< "${json}")
    json=$(jq --argjson json "${json}" '. += $json | unique' <<< "${jsonarray}")
    after=$(jq '. | map(.number) | length' <<< "${json}")

    echo "New PRs added: $((after-before))"

    ((pageCount++))
done

echo
echo "Total PRs: $(jq '. | map(.number) | length' <<< ${json})"
echo
jq -r '["NUMBER", "DATE", "AUTHOR", "TITLE"], (.[] | ["#\(.number)", .mergedAt, .author.login, .title]) | @tsv' <<< ${json} | column -t -s $'\t'
echo

echo "⚠️  Remember to manually check if each PR was backported to v3."
echo "   Because there's not a good way to automate that check when commit SHAs differ,"
echo "   and git diffs will often necessarily differ between v4 and v3."
echo
