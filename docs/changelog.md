---
sidebar_position: 2
sidebar_label: Full Changelog
---

# Helm 4 Full Changelog

**Scope**: 290 PRs from (`v4.0.0-rc.1`) compared to `v3.19.0`
**v4-only**: 257 PRs (33 backported to v3 excluded)

See the [Overview](/overview.md) for an actionable summary of these changes.

## New Features

New features in Helm 4 that were not backported to v3

| PR | Date | Author | Title |
|---|---|---|---|
| #31435 | 2025-11-03 | matheuscscp | Introduce a context for canceling wait operations |
| #31389 | 2025-10-30 | TerryHowe | chore: fix pkg/registry warnings to reduce noise |
| #31338 | 2025-10-21 | yzewei | Add loongarch64 support |
| #31351 | 2025-10-21 | gjenkins8 | feat: `helm version` print Kubernetes (client-go) version |
| #31376 | 2025-10-21 | benoittgt | Do not ignore *.yml file on linting while accepting *.yaml |
| #31362 | 2025-10-21 | fabiocarneiro | Clarify the intent of the resource instructions |
| #31392 | 2025-10-16 | TerryHowe | feature: create copilot structured context |
| #31295 | 2025-10-13 | TerryHowe | Fix make helm list show all by default |
| #31372 | 2025-10-10 | mattfarina | Enable Releases To Have Multiple Versions |
| #31254 | 2025-09-23 | benoittgt | Warn when we fallback to a different version on `helm pull` |
| #31275 | 2025-09-10 | benoittgt | Extend --skip-schema-validation for lint command |
| #31116 | 2025-09-02 | banjoh | chore: check if go modules are tidy before build |
| #31217 | 2025-09-01 | scottrigby | <span class="breaking">BREAKING CHANGE:</span> [HIP-0026] Move Postrenderer to a plugin type |
| #31196 | 2025-08-31 | scottrigby | <span class="breaking">BREAKING CHANGE:</span> [HIP-0026] Remove unnecessary file i/o operations from signing and verifying |
| #31176 | 2025-08-30 | scottrigby | <span class="breaking">BREAKING CHANGE:</span> [HIP-0026] Plugin packaging, signing, and verification |
| #31194 | 2025-08-28 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> [HIP-0026] Plugin extism/v1 runtime |
| #30812 | 2025-08-27 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> HIP-0023: Helm support server-side apply |
| #31174 | 2025-08-26 | scottrigby | <span class="breaking">BREAKING CHANGE:</span> [HIP-0026] Plugin tarball support for HTTP and local installers |
| #31172 | 2025-08-26 | scottrigby | <span class="breaking">BREAKING CHANGE:</span> [HIP-0026] Plugin OCI installer |
| #31146 | 2025-08-23 | scottrigby | <span class="breaking">BREAKING CHANGE:</span> [HIP-0026] Plugin types and plugin apiVersion v1 |
| #31145 | 2025-08-22 | scottrigby | <span class="breaking">BREAKING CHANGE:</span> [HIP-0026] Plugin runtime interface |
| #31142 | 2025-08-21 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> [HIP-0026] Move pkg/plugin -> internal/plugin |
| #31030 | 2025-08-14 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> HIP-0023: Kube client support server-side apply |
| #12624 | 2025-08-13 | papdaniel | show crds command output separated by document separator |
| #13111 | 2025-08-13 | rawtaz | style(pkg/chartutil): add missing dots and indentation to defaultValues |
| #31076 | 2025-08-11 | matheuscscp | pkg/registry: Login option for passing TLS config in memory |
| #31034 | 2025-08-05 | Mazafard | Feat: Add color output functionality and tests for release statuses |
| #31057 | 2025-07-18 | danilobuerger | Pass credentials when either chart repo or repo dont specify a port but it matches the default port of that scheme |
| #31019 | 2025-07-17 | zachburg | Return early when linting if the `templates/` directory does not exist |
| #31011 | 2025-07-17 | yalosev | feature: add labels to metadata |
| #31015 | 2025-07-17 | zachburg | Add linter support for the `crds/` directory |
| #13154 | 2025-07-10 | carloslima | Allow post-renderer to process hooks |
| #13586 | 2025-06-04 | jessesimpson36 | feat: add formatting for errors to make multiline stacktraces in helm templates |
| #30553 | 2025-05-07 | Zhanweelee | feat: Add mustToYaml and mustToJson template functions |
| #30734 | 2025-04-21 | ipaqsa | feat(pkg/engine): add support for custom template funcs |
| #13283 | 2025-04-14 | win-t | adding support for JSON Schema 2020 |
| #30751 | 2025-04-13 | benoittgt | Add detailed debug logging for resource readiness states |
| #30708 | 2025-04-11 | benoittgt | Migrate pkg to slog |
| #13604 | 2025-04-05 | AustinAbro321 | Introduce kstatus watcher |
| #13617 | 2025-02-27 | AustinAbro321 | <span class="breaking">BREAKING CHANGE:</span>  Refactor cmd/helm to allow library usage |
| #30571 | 2025-02-24 | yardenshoham | feat: error out when post-renderer produces no output |
| #13655 | 2025-02-20 | LuBingtan | feat: support multi-document values files |
| #13471 | 2025-02-19 | wangjingcun | Use a more direct and less error-prone return value |
| #30294 | 2025-02-19 | Zhanweelee | Supports json arguments |
| #13538 | 2025-01-17 | godhanipayal | Add Contextual Error Messages to RunWithContext |
| #12588 | 2024-11-22 | rynowak | Make the authorizer and registry authorizer configurable |

## Bug Fixes

Fixes in Helm 4 that were not backported to v3

| PR | Date | Author | Title |
|---|---|---|---|
| #31323 | 2025-10-29 | mattfarina | Reproducible chart archive builds |
| #31411 | 2025-10-29 | banjoh | fix: reinstate logger parameter to actions package |
| #31204 | 2025-10-22 | benoittgt | Avoid panic in helm.sh/helm/v3/pkg/chartutil.ValidateAgainstSchema |
| #31337 | 2025-10-22 | rachelvweber | Fixing rollback and uninstall client WaitStrategy |
| #31393 | 2025-10-21 | benoittgt | Return errors during upgrade when the deletion of resources fails |
| #31406 | 2025-10-21 | jessesimpson36 | fix: kube client should return empty results objects instead of nil |
| #31375 | 2025-10-13 | TerryHowe | fix: release info time parsing |
| #31349 | 2025-10-07 | TerryHowe | fix: flakey lint test on shuffle |
| #31327 | 2025-10-07 | TerryHowe | fix: broken `--html` flag to coverage script |
| #31354 | 2025-10-07 | TerryHowe | fix: flake upgrade test |
| #31227 | 2025-10-03 | evankanderson | Use filepath.Path when handling directory names |
| #31307 | 2025-10-02 | TerryHowe | fix: Ignore absolute path when RepoUrl is provided |
| #31334 | 2025-09-30 | fleaz | Fix typo in bug-report  issue template |
| #31330 | 2025-09-25 | mattfarina | Restore lint rule for excluding meaningless name |
| #31320 | 2025-09-25 | kosiew | provenance: allow RSA signing when ed25519 keys are present (switch to ProtonMail/go-crypto) |
| #31285 | 2025-09-12 | bennsimon | fix: remove leftover debugging line that outputs invalid YAML for helm template command |
| #31277 | 2025-09-11 | benoittgt | Fix deprecation warning for spf13/pflag from 1.0.7 to 1.0.10 |
| #31272 | 2025-09-09 | TerryHowe | fix: idea gitignore entry |
| #31252 | 2025-09-05 | kamilswiec | fix:chartfile tests - semver2 error message |
| #31199 | 2025-09-05 | TerryHowe | fix: flaky registry data race on mockdns close |
| #31200 | 2025-09-05 | TerryHowe | fix: installer action goroutine count |
| #31222 | 2025-09-03 | benoittgt | Prevent failing `helm push` on ghcr.io using standard GET auth token flow |
| #31191 | 2025-08-26 | TerryHowe | fix: send logging to stderr |
| #31138 | 2025-08-19 | islewis | fix(helm-lint): Add HTTP/HTTPS URL support for json schema references |
| #31152 | 2025-08-18 | TerryHowe | fix: enable shuffle in Makefile for unit tests |
| #12968 | 2025-08-13 | sjeandeaux | helm uninstall dry run support `--ignore-not-found` |
| #31126 | 2025-08-12 | paologallinaharbur | fix(transport): leverage same tls config |
| #31109 | 2025-08-06 | carlossg | fix: prevent panic when ChartDownloader.getOciURI |
| #31074 | 2025-07-18 | joejulian | add missing template directory to badcrdfile testdata |
| #31042 | 2025-07-10 | TerryHowe | fix: test teardown dns data race |
| #30898 | 2025-07-06 | AshmitBhardwaj | Fix issue 13198 |
| #31021 | 2025-07-05 | zachburg | Update tests in create_test.go and package_test.go to work in a temp directory |
| #31024 | 2025-07-03 | gjenkins8 | fix: 'TestRunLinterRule' stateful test |
| #30900 | 2025-06-23 | unguiculus | Add timeout flag to repo add and update commands |
| #30981 | 2025-06-15 | TerryHowe | fix: lint test SetEnv errors |
| #30973 | 2025-06-12 | manslaughter03 | fix: wrap run release test error in case GetPodLogs failed. |
| #30972 | 2025-06-10 | TerryHowe | fix: kube client create mutex |
| #30958 | 2025-06-06 | TerryHowe | fix: repo update cmd mutex |
| #30955 | 2025-06-04 | carloslima | Fix tests deleting XDG_DATA_HOME |
| #30939 | 2025-06-03 | TerryHowe | fix: action hooks delete policy mutex |
| #12581 | 2025-06-03 | MichaelMorrisEst | Consider full GroupVersionKind when matching resources |
| #30930 | 2025-05-28 | benoittgt | Fix flaky TestFindChartURL due to non-deterministic map iteration |
| #30884 | 2025-05-21 | mattfarina | Reverting fix "renders int as float" |
| #30862 | 2025-05-20 | OmriSteiner | fix: correctly concat absolute URIs in repo cache |
| #30864 | 2025-05-16 | jessesimpson36 | fix: remove duplicate error message |
| #30842 | 2025-05-15 | ayushontop | Fix : No repository is not an error,use the helm repo list command ,if there is no repository,it should not be an error #30606 |
| #30800 | 2025-04-25 | mmorel-35 | fix: dep fs errors |
| #30803 | 2025-04-25 | mattfarina | Fixing windows build |
| #30783 | 2025-04-23 | rpolishchuk | fix: chart icon presence test |
| #30777 | 2025-04-23 | ryanhockstad | fix: null merge |
| #9175 | 2025-04-23 | dastrobu | fix: copy dependencies on aliasing to avoid sharing chart references on multiply aliased dependencies |
| #12382 | 2025-04-20 | edbmiller | fix(pkg/lint): unmarshals Chart.yaml strictly |
| #30766 | 2025-04-17 | benoittgt | Fix main branch by defining wait strategy parameter on hooks |
| #30718 | 2025-04-16 | klihub | Allow signing multiple charts with a single passphrase from stdin. |
| #30752 | 2025-04-16 | benoittgt | Bump golangci lint to last major version and fix static-check errors |
| #30737 | 2025-04-11 | rpolishchuk | fix: order dependent test |
| #9318 | 2025-04-07 | wahabmk | Fix issue with helm pull failing if pulling from a repository that redirects to another domain |
| #13119 | 2025-04-05 | idsulik | fix(concurrency): Use channel for repoFailList errors in updateCharts |
| #30618 | 2025-03-04 | AustinAbro321 | Fix namespace flag not registering |
| #30590 | 2025-03-01 | SantalScript | fix:add proxy support when mTLS configured |
| #30572 | 2025-02-25 | yardenshoham | fix: error when more than one post-renderer is specified |
| #30576 | 2025-02-23 | felipecrs | Fix flaky TestDedupeRepos |
| #30562 | 2025-02-20 | robertsirc | fixing error handling from a previous PR |
| #13656 | 2025-02-03 | gjenkins8 | fix: Bind repotest server to `localhost` |
| #13633 | 2025-01-17 | mattfarina | Ensuring the file paths are clean prior to passing to securejoin |
| #13425 | 2024-11-15 | MathieuCesbron | Fix typo "re-use" to "reuse" |

## Refactor/Cleanup

Code quality improvements and modernization

| PR | Date | Author | Title |
|---|---|---|---|
| #31440 | 2025-10-29 | mattfarina | Updating Go and golangci-lint versions |
| #31408 | 2025-10-21 | AndiDog | Improve error message when plugin source cannot be determined or a non-directory is passed |
| #31390 | 2025-10-21 | TerryHowe | fix: improve pkg/cmd/list test coverage |
| #31365 | 2025-10-21 | reddaisyy | refactor: use reflect.TypeFor |
| #31395 | 2025-10-21 | wyrapeseed | chore: fix some comment format |
| #31401 | 2025-10-17 | TerryHowe | refactor: remove unused err from pkg/registry/client.go |
| #31391 | 2025-10-15 | TerryHowe | chore: rename test registry |
| #31302 | 2025-10-13 | TerryHowe | fix: helm verify Run signature |
| #31270 | 2025-10-13 | TerryHowe | chore: registry utils clean up |
| #31383 | 2025-10-13 | dirkmueller | Avoid accessing .Items on nil object |
| #31379 | 2025-10-13 | TerryHowe | fix: clean up coverage script temp file |
| #30980 | 2025-10-10 | gjenkins8 | cleanup: Remove/consolidate redundant kube client Interfaces |
| #30712 | 2025-10-10 | gjenkins8 | cleanup: Remove extra lint/rules.Template functions |
| #30833 | 2025-10-09 | gjenkins8 | refactor/cleanup: Replace action 'DryRun' string with DryRunStrategy type + deprecations |
| #31326 | 2025-10-07 | TerryHowe | Update sign tests to use testify |
| #31312 | 2025-10-01 | gjenkins8 | Remove unused 'Settings' from plugin schema |
| #31143 | 2025-09-25 | TerryHowe | fix: remove redundant error check |
| #31249 | 2025-09-25 | banjoh | chore: add additional logging to plugin installer |
| #31321 | 2025-09-24 | juejinyuxitu | chore: fix some typos in comment |
| #31297 | 2025-09-22 | TerryHowe | fix: hide notes in helm test command |
| #31315 | 2025-09-22 | benoittgt | Remove unused golangci-lint rules that produce warning |
| #31294 | 2025-09-19 | TerryHowe | Remove implicit support for helm lint current directory |
| #31301 | 2025-09-19 | TerryHowe | chore: remove helm version `--client` option |
| #31303 | 2025-09-18 | mattfarina | Update the action interfaces for chart apiversions |
| #31198 | 2025-09-16 | TerryHowe | refactor: replace pkg/engine regular expressions with parser |
| #31293 | 2025-09-16 | TerryHowe | chore: remove pkg/time which is no longer needed |
| #31287 | 2025-09-16 | miledxz | improve fileutil test coverage |
| #31292 | 2025-09-16 | reddaisyy | refactor: use strings.builder |
| #31286 | 2025-09-12 | yajianggroup | refactor: use strings.CutPrefix |
| #31258 | 2025-09-08 | StephanieHhnbrg | Refactor unreachableKubeClient for testing into failingKubeClient |
| #31259 | 2025-09-07 | StephanieHhnbrg | Adapt test-coverage command to be able to run for a certain package |
| #31225 | 2025-09-02 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Move lint pkg to be part of each chart version |
| #31220 | 2025-09-02 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> refactor: utilize `pluginTypesIndex` for config unmarshalling  |
| #31219 | 2025-09-02 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> Remove 'SetupPluginEnv' |
| #31216 | 2025-09-02 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Move to versioned packages |
| #31224 | 2025-09-01 | gjenkins8 | fix: Adjust PostRenderer plugin output to value |
| #31218 | 2025-09-01 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> Remove legacy Command/Hooks from v1 Subprocess (#23) |
| #31151 | 2025-08-30 | TerryHowe | fix: make file whitespace |
| #31178 | 2025-08-28 | mattfarina | Add content cache to helm env |
| #31165 | 2025-08-22 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Initial addition of content based cache |
| #13629 | 2025-08-22 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> Rename 'atomic' -> 'rollback-on-failure' |
| #31175 | 2025-08-21 | cuiweixie | pkg/register: refactor to use atomic.Uint64 |
| #31132 | 2025-08-19 | joemicky | refactor: replace []byte(fmt.Sprintf) with fmt.Appendf  |
| #31133 | 2025-08-14 | joemicky | refactor: replace HasPrefix+TrimPrefix with CutPrefix |
| #31134 | 2025-08-14 | joemicky | refactor: omit unnecessary reassignment |
| #11700 | 2025-08-13 | suzaku | Refactor, use sort.Slice to reduce boilerplate code |
| #31058 | 2025-08-07 | farazkhawaja | Add test coverage for get_values/metadata.go |
| #31107 | 2025-08-06 | Pavanipogula | test(pkg/kube): Add unit tests to wait and roundtripper files. |
| #31106 | 2025-08-05 | irikeish | test(pkg/kube): add test for Client.isReachable |
| #30982 | 2025-08-05 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> Rename 'force' to 'force-replace' |
| #31094 | 2025-08-04 | mikelolasagasti | chore(deps): remove phayes/freeport module |
| #31101 | 2025-07-30 | banjoh | feat: switch yaml library to go.yaml.in/yaml/v3 |
| #31081 | 2025-07-25 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Initial addition of v3 charts |
| #31079 | 2025-07-22 | gjenkins8 | cleanup: Remove plugin deprecated 'UseTunnelDeprecated' |
| #31060 | 2025-07-18 | yumeiyin | refactor: replace Split in loops with more efficient SplitSeq |
| #31065 | 2025-07-15 | TerryHowe | chore: improve OCI debug logging |
| #31033 | 2025-07-14 | navinag1989 | test: increase test coverage for pkg/cli/options.go file |
| #31029 | 2025-07-07 | gjenkins8 | chore(refactor): Privatize 'k8sYamlStruct' |
| #31023 | 2025-07-03 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> Remove deprecated '--create-pods' flag |
| #31009 | 2025-07-02 | tpresa | test: increase test coverage for pkg/pusher |
| #31018 | 2025-07-01 | mattfarina | Move logging setup to be configurable |
| #30909 | 2025-06-03 | jinjiadu | refactor: replace HasPrefix+TrimPrefix with CutPrefix |
| #30809 | 2025-06-03 | mmorel-35 | chore: enable usetesting linter |
| #30865 | 2025-05-22 | mmorel-35 | refactor: update json-patch import path and add gomodguard settings |
| #30871 | 2025-05-20 | gjenkins8 | Run test OCI registry localhost |
| #30866 | 2025-05-20 | mmorel-35 | chore: enable thelper linter |
| #30863 | 2025-05-16 | mattfarina | Adding test for list command |
| #30850 | 2025-05-12 | yetyear | refactor: use maps.Copy for cleaner map handling |
| #30829 | 2025-05-09 | TerryHowe | Increase pkg/time test coverage |
| #30810 | 2025-05-08 | mmorel-35 | chore: enable usestdlibvars linter |
| #30844 | 2025-05-08 | TerryHowe | fix: rename slave replica |
| #30827 | 2025-05-06 | findnature | refactor: use slices.Contains to simplify code |
| #13460 | 2025-04-23 | justenstall | fix: replace "github.com/pkg/errors" with stdlib "errors" package |
| #30788 | 2025-04-23 | stephenpmurray | ref(helm): Export Chart Not Found error |
| #30781 | 2025-04-22 | mmorel-35 | chore: remove `github.com/hashicorp/go-multierror` dependency |
| #13578 | 2025-04-18 | gjenkins8 | refactor: Remove ChartRepository `[]ChartPaths` |
| #30760 | 2025-04-16 | robertsirc | adding slog debug to a few points |
| #30713 | 2025-04-11 | gjenkins8 | cleanup: Remove Helm v2 template lint rules |
| #30749 | 2025-04-11 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Removing the alpine test chart |
| #30686 | 2025-04-11 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Remove deprecated code |
| #30736 | 2025-04-09 | robertsirc | manually updating go.mod file |
| #13458 | 2025-04-05 | thudi | <span class="breaking">BREAKING CHANGE:</span> #13449 Resolves: Replacing NewSimpleClientSet to NewClientSet due to deprecation |
| #30684 | 2025-03-21 | twz123 | Remove ClientOptResolver from OCI Client |
| #30603 | 2025-03-21 | robertsirc | converting inline log to slog |
| #30699 | 2025-03-21 | mattfarina | Error when failed repo update. |
| #30592 | 2025-02-28 | robertsirc | changing from log to slog |
| #30589 | 2025-02-26 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Move pkg/release to pkg/release/v1 to support v3 charts |
| #30586 | 2025-02-25 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Move pkg/chart to pkg/chart/v2 to prepare for v3 charts |
| #30585 | 2025-02-25 | robertsirc | removing old apis |
| #30580 | 2025-02-24 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Move pkg/releaseutil to pkg/release/util |
| #11112 | 2025-02-22 | felipecrs | perf(dep-up): do not update the same repo multiple times |
| #30567 | 2025-02-21 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Moving chartutil to chart/util |
| #30566 | 2025-02-21 | robertsirc | remove unused config.go |
| #30470 | 2025-02-19 | gjenkins8 | Cleanup `repotest.Server` constructors |
| #30550 | 2025-02-19 | mattfarina | Moving to SetOut and SetErr for Cobra |
| #30546 | 2025-02-19 | hugehope | refactor: using slices.Contains to simplify the code |
| #13535 | 2025-02-05 | gjenkins8 | refactor: tlsutil use options pattern |
| #13665 | 2025-02-05 | gjenkins8 | chore: Remove unused `WaitAndGetCompletedPodPhase` |
| #13579 | 2025-02-05 | gjenkins8 | refactor: Remove duplicate `FindChartIn*RepoURL` functions |
| #13516 | 2025-01-24 | TerryHowe | chore: fix problems with latest lint |
| #13494 | 2025-01-18 | gjenkins8 | <span class="breaking">BREAKING CHANGE:</span> Remove deprecated `repo add --no-update` flag |
| #13602 | 2025-01-17 | crystalstall | refactor: using slices.Contains to simplify the code |
| #13600 | 2025-01-14 | gjenkins8 | cleanup: `NewShowWithConfig` -> `NewShow` |
| #13601 | 2025-01-09 | gjenkins8 | cleanup: Remove superseded 'lint/rules.Values' function |
| #13611 | 2025-01-07 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Updating the internal version to v4 |
| #13576 | 2025-01-07 | gjenkins8 | refactor: Consolidate lint package Run() functions |
| #13577 | 2025-01-07 | gjenkins8 | refactor: Remove redundant `NewPullWithOpts` |
| #13599 | 2025-01-07 | gjenkins8 | cleanup: `ProcessDependenciesWithMerge` -> `ProcessDependencies` |
| #13573 | 2024-12-27 | mattfarina | <span class="breaking">BREAKING CHANGE:</span> Updating to helm.sh/helm/v4 |
| #13444 | 2024-12-07 | justenstall | refactor(status): remove --show-desc and --show-resources flags |

## Other

Infrastructure and project management improvements

| PR | Date | Author | Title |
|---|---|---|---|
| #31197 | 2025-09-03 | tzchenxixi | chore: fix function name |
| #31150 | 2025-08-18 | TerryHowe | Feature add stale pr workflow |
| #31149 | 2025-08-18 | TerryHowe | fix: stale issue workflow |
| #31077 | 2025-07-21 | gaspergrom | fix: LFX health score badge link |
| #31047 | 2025-07-10 | jingchanglu | chore: fix typo in pkg/repo/chartrepo.go |
| #31004 | 2025-06-26 | andreped | fix(docs): Typofix in README |
| #31002 | 2025-06-26 | curlwget | chore: fix function in comment |
| #30912 | 2025-06-17 | Bhargavkonidena | Fix #30893 - issue templates |
| #30957 | 2025-06-04 | acceptacross | chore: fix some function names in comment |
| #30914 | 2025-05-27 | benoittgt | Fix dependabot upgrade of jsonschema to v6.0.2 |
| #30904 | 2025-05-23 | benoittgt | [Doc] Help users avoid specifying URL scheme and path with `helm registry` |
| #30882 | 2025-05-20 | caniszczyk | Add new LFX Insights Health Score Badge |
| #30872 | 2025-05-20 | benoittgt | Bump golangci-lint version to match last golangci-lint-action |
| #30824 | 2025-05-05 | adharsh277 | Fix bug in .golangci.yml configuration |
| #30786 | 2025-04-25 | mmorel-35 | refactor: reorganize .golangci.yml for better clarity and structure |
| #30785 | 2025-04-23 | mmorel-35 | fix: govulncheck workflow |
| #30784 | 2025-04-22 | scottrigby | chore(OWNERS): Add TerryHowe as Triage Maintainer |
| #30773 | 2025-04-18 | wangcundashang | chore: fix function name in comment |
| #30754 | 2025-04-16 | mattfarina | Simplify the JSON Schema checking |
| #30693 | 2025-03-20 | linghuying | chore: make function comment match function name |
| #30665 | 2025-03-13 | mattfarina | Updating to 0.37.0 for x/net |
| #30611 | 2025-03-04 | gjenkins8 | chore: Remove 'coveralls' |
| #30612 | 2025-03-04 | gjenkins8 | fix: Fix go report card badge reference/link |
| #30508 | 2025-02-19 | eimhin-rover | Update version option description with more accurate info |
| #30497 | 2025-02-12 | robertsirc | adding-my-key |
| #30295 | 2025-02-07 | edithturn | Add Percona to the list of organizations using Helm |
| #13653 | 2025-01-23 | petercover | chore: fix some comments |
| #13625 | 2025-01-13 | shahbazaamir | ading info to install helm , referring the documentation |
| #13563 | 2024-12-21 | gjenkins8 | Run `build-test` action on `dev-v3` branch |
| #13552 | 2024-12-20 | gjenkins8 | Fix `dependabot.yml` `target-branch` typo |
| #13529 | 2024-12-15 | godhanipayal | Adding Oracle to the adopters list |
| #13509 | 2024-12-06 | gjenkins8 | Dependabot update `dev-v3` branch go modules |
| #13212 | 2024-12-01 | mbianchidev | Update ADOPTERS.md |
| #13465 | 2024-11-20 | banjoh | Add precommit config to .gitignore |
| #13443 | 2024-11-15 | mattfarina | Updating docs around v3 and v4 |

## v4 Changes Also Backported to v3

These PRs were included in v4 but were also backported to v3 releases

### New Features (Backported)

| PR | Date | Author | Title |
|---|---|---|---|
| #30696 | 2025-03-24 | benoittgt | Inform about time spent waiting resources to be ready in slog format |
| #12912 | 2025-03-11 | hegerdes | feat: add httproute from gateway-api to create chart template |
| #10309 | 2025-02-21 | Bez625 | Add hook annotation to output hook logs to client on error |
| #13481 | 2025-02-18 | banjoh | feat: Enable CPU and memory profiling |
| #12690 | 2025-01-01 | TerryHowe | feat: OCI install by digest |
| #13232 | 2024-12-20 | dnskr | ref(create): don't render empty resource fields |
| #12962 | 2024-12-04 | stevehipwell | feat: Added multi-platform plugin hook support |
| #13343 | 2024-11-19 | niladrih | Add annotations and dependencies to get metadata output |

### Bug Fixes (Backported)

| PR | Date | Author | Title |
|---|---|---|---|
| #31064 | 2025-09-05 | kamilswiec | lint: throw warning when chart version is not semverv2 |
| #31156 | 2025-08-22 | estroz | fix: set repo authorizer in registry.Client.Resolve() |
| #30992 | 2025-08-18 | TerryHowe | fix: force bearer oauth for if registry requests bearer auth |
| #31115 | 2025-08-18 | banjoh | fix: use username and password if provided |
| #30891 | 2025-08-13 | gjenkins8 | fix: Port pluginCommand & command warning |
| #31050 | 2025-08-08 | heyLu | Fix `helm pull` untar dir check with repo urls |
| #31078 | 2025-07-24 | 8tomat8 | fix: k8s version parsing to match original |
| #30979 | 2025-06-17 | TerryHowe | fix: OAuth username password login for v4 |
| #30917 | 2025-06-01 | TerryHowe | fix: add debug logging to oci transport |
| #30937 | 2025-05-30 | TerryHowe | fix: legacy docker support broken for login |
| #30928 | 2025-05-28 | TerryHowe | fix: plugin installer test with no Internet |
| #30905 | 2025-05-23 | robertsirc | forward porting 30902 |
| #30894 | 2025-05-23 | benoittgt | Prevent push cmd failure in 3.18 by handling version tag resolution in ORAS memory store |
| #30697 | 2025-04-17 | p-se | Fix --take-ownership for custom resources - closes #30622 |
| #30673 | 2025-04-16 | nvanthao | fix: Process all hook deletions on failure |
| #30701 | 2025-04-11 | zanuka | updates mutate and validate web hook configs |
| #13583 | 2025-01-15 | jiashengz | fix: check group for resource info match |

### Refactor/Cleanup (Backported)

| PR | Date | Author | Title |
|---|---|---|---|
| #30677 | 2025-04-18 | dongjiang1989 | chore: Update Golang to v1.24 |
| #30741 | 2025-04-11 | benoittgt | Bumps github.com/distribution/distribution/v3 from 3.0.0-rc.3 to 3.0.0 |
| #13382 | 2025-02-03 | TerryHowe | chore(oci): migrate to ORAS Golang library v2 |
| #13546 | 2024-12-19 | mattfarina | Update to Go 1.23 |
| #13499 | 2024-12-06 | gjenkins8 | Shadow ORAS remote.Client interface |

### Other (Backported)

| PR | Date | Author | Title |
|---|---|---|---|
| #30775 | 2025-04-19 | benoittgt | Bump toml |
| #13533 | 2025-01-24 | althmoha | fix: (toToml) renders int as float |
| #13581 | 2024-12-31 | ldlb9527 | Upgrade golang.org/x/net to v0.33.0 to address CVE-2024-45338 |

