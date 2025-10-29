---
sidebar_position: 2
sidebar_label: Full Changelog
---

# Helm 4 Full Changelog

**Scope**: 260 PRs from (`v4.0.0-beta.2`) compared to `v3.19.0`
**v4-only**: 237 PRs (23 backported to v3 excluded)

See the [Overview](/overview.md) for an actionable summary of these changes.

## Helm 4 Features

New features in Helm 4 that were not backported to v3

```text
#31338  2025-10-21T19:51:31Z  yzewei            Add loongarch64 support
#31351  2025-10-21T19:32:40Z  gjenkins8         feat: `helm version` print Kubernetes (client-go) version
#31362  2025-10-21T19:21:16Z  fabiocarneiro     Clarify the intent of the resource instructions
#31376  2025-10-21T19:23:40Z  benoittgt         Do not ignore *.yml file on linting while accepting *.yaml
#31372  2025-10-10T17:30:07Z  mattfarina        Enable Releases To Have Multiple Versions
#31254  2025-09-23T00:15:09Z  benoittgt         Warn when we fallback to a different version on `helm pull`
#31275  2025-09-10T18:52:08Z  benoittgt         Extend --skip-schema-validation for lint command
#31295  2025-10-13T19:04:20Z  TerryHowe         Fix make helm list show all by default
#31076  2025-08-11T14:24:11Z  matheuscscp       pkg/registry: Login option for passing TLS config in memory
#13604  2025-04-05T13:45:25Z  AustinAbro321     Introduce kstatus watcher
#31034  2025-08-05T20:15:23Z  Mazafard          Feat: Add color output functionality and tests for release statuses
#12690  2025-01-01T16:49:14Z  TerryHowe         feat: OCI install by digest
#13655  2025-02-20T22:37:52Z  LuBingtan         feat: support multi-document values files
#30553  2025-05-07T03:56:41Z  Zhanweelee        feat: Add mustToYaml and mustToJson template functions
#13481  2025-02-18T19:48:30Z  banjoh            feat: Enable CPU and memory profiling
#31101  2025-07-30T15:35:44Z  banjoh            feat: switch yaml library to go.yaml.in/yaml/v3
#13154  2025-07-10T16:31:44Z  carloslima        Allow post-renderer to process hooks
#30734  2025-04-21T15:13:13Z  ipaqsa            feat(pkg/engine): add support for custom template funcs
#30571  2025-02-24T20:36:19Z  yardenshoham      feat: error out when post-renderer produces no output
#31011  2025-07-17T17:49:48Z  yalosev           feature: add labels to metadata
#31152  2025-08-18T19:30:57Z  TerryHowe         feature: enable shuffle in Makefile for unit tests
#31150  2025-08-18T16:08:04Z  TerryHowe         Feature add stale pr workflow
#30900  2025-06-23T01:00:57Z  unguiculus        Add timeout flag to repo add and update commands
#11112  2025-02-22T20:50:31Z  felipecrs         perf(dep-up): do not update the same repo multiple times
#30294  2025-02-19T20:04:06Z  Zhanweelee        Supports json arguments
#13283  2025-04-14T18:52:03Z  win-t             adding support for JSON Schema 2020
#30718  2025-04-16T20:07:44Z  klihub            Allow signing multiple charts with a single passphrase from stdin
```

## Helm 4 Fixes

Fixes in Helm 4 that were not backported to v3

```text
#31337  2025-10-22T19:40:33Z  rachelvweber      Fixing rollback and uninstall client WaitStrategy
#31406  2025-10-21T16:36:35Z  jessesimpson36    fix: kube client should return empty results objects instead of nil
#31204  2025-10-22T19:47:14Z  benoittgt         Avoid panic in helm.sh/helm/v3/pkg/chartutil.ValidateAgainstSchema
#31393  2025-10-21T19:29:59Z  benoittgt         Return errors during upgrade when the deletion of resources fails
#31330  2025-09-25T23:06:13Z  mattfarina        Restore lint rule for excluding meaningless name
#31334  2025-09-30T19:13:56Z  fleaz             Fix typo in bug-report issue template
#31227  2025-10-03T00:41:41Z  evankanderson     Use filepath.Path when handling directory names
#31277  2025-09-11T16:32:37Z  benoittgt         Fix deprecation warning for spf13/pflag from 1.0.7 to 1.0.10
#31285  2025-09-12T14:31:30Z  bennsimon         fix: remove leftover debugging line that outputs invalid YAML for helm template command
#31349  2025-10-07T20:00:51Z  TerryHowe         fix: flakey lint test on shuffle
#31327  2025-10-07T19:54:46Z  TerryHowe         fix: broken `--html` flag to coverage script
#31320  2025-09-25T01:31:08Z  kosiew            provenance: allow RSA signing when ed25519 keys are present (switch to ProtonMail/go-crypto)
#31354  2025-10-07T19:34:50Z  TerryHowe         fix: flake upgrade test
#31307  2025-10-02T21:02:47Z  TerryHowe         fix: Ignore absolute path when RepoUrl is provided
#31375  2025-10-13T16:42:05Z  TerryHowe         fix: release info time parsing
#31272  2025-09-09T20:37:43Z  TerryHowe         fix: idea gitignore entry
#31252  2025-09-05T12:45:22Z  kamilswiec        fix:chartfile tests - semver2 error message
#31222  2025-09-03T19:59:38Z  benoittgt         Prevent failing `helm push` on ghcr.io using standard GET auth token flow
#31224  2025-09-01T17:40:18Z  gjenkins8         fix: Adjust PostRenderer plugin output to value
#31126  2025-08-12T14:24:41Z  paologallinaharbur fix(transport): leverage same tls config
#30891  2025-08-13T19:33:02Z  gjenkins8         fix: Port pluginCommand & command warning
#31024  2025-07-03T13:17:02Z  gjenkins8         fix: 'TestRunLinterRule' stateful test
#30884  2025-05-21T19:18:11Z  mattfarina        Reverting fix "renders int as float"
#30699  2025-03-21T19:49:27Z  mattfarina        Error when failed repo update.
#30612  2025-03-04T21:10:03Z  gjenkins8         fix: Fix go report card badge reference/link
#30562  2025-02-20T18:15:53Z  robertsirc        fixing error handling from a previous PR
#13656  2025-02-03T23:59:07Z  gjenkins8         fix: Bind repotest server to `localhost`
#13552  2024-12-20T20:25:07Z  gjenkins8         Fix `dependabot.yml` `target-branch` typo
#12581  2025-06-03T19:02:19Z  MichaelMorrisEst  Consider full GroupVersionKind when matching resources
#30862  2025-05-20T14:38:49Z  OmriSteiner       fix: correctly concat absolute URIs in repo cache
#30590  2025-03-01T16:25:05Z  SantalScript      fix:add proxy support when mTLS configured
#30939  2025-06-03T19:04:57Z  TerryHowe         fix: action hooks delete policy mutex
#30958  2025-06-06T17:42:20Z  TerryHowe         fix: repo update cmd mutex
#30972  2025-06-10T19:57:55Z  TerryHowe         fix: kube client create mutex
#30981  2025-06-15T18:11:31Z  TerryHowe         fix: lint test SetEnv errors
#30979  2025-06-17T19:06:31Z  TerryHowe         fix: OAuth username password login for v4
#31004  2025-06-26T13:01:27Z  andreped          fix(docs): Typofix in README
#30842  2025-05-15T18:38:00Z  ayushontop        Fix : No repository is not an error,use the helm repo list command ,if there is no repository,it should not be an error #30606
#30766  2025-04-17T12:36:50Z  benoittgt         Fix main branch by defining wait strategy parameter on hooks
#30930  2025-05-28T19:03:47Z  benoittgt         Fix flaky TestFindChartURL due to non-deterministic map iteration
#30955  2025-06-04T15:33:40Z  carloslima        Fix tests deleting XDG_DATA_HOME
#12382  2025-04-20T19:35:51Z  edbmiller         fix(pkg/lint): unmarshals Chart.yaml strictly
#30576  2025-02-23T19:51:34Z  felipecrs         Fix flaky TestDedupeRepos
#31109  2025-08-06T13:52:28Z  carlossg          fix: prevent panic when ChartDownloader.getOciURI
#31042  2025-07-10T14:19:16Z  TerryHowe         fix: test teardown dns data race
#31149  2025-08-18T15:22:41Z  TerryHowe         fix: stale issue workflow
#31191  2025-08-26T20:12:51Z  TerryHowe         fix: send logging to stderr
#31151  2025-08-30T06:00:34Z  TerryHowe         fix: make file whitespace
#31200  2025-09-05T02:35:55Z  TerryHowe         fix: installer action goroutine count
#31199  2025-09-05T02:39:45Z  TerryHowe         fix: flaky registry data race on mockdns close
#9318   2025-04-07T22:58:34Z  wahabmk           Fix issue with helm pull failing if pulling from a repository that redirects to another domain
#30864  2025-05-16T13:21:23Z  jessesimpson36    fix: remove duplicate error message
#13586  2025-06-04T01:37:54Z  jessesimpson36    fix: add formatting for errors to make multiline stacktraces in helm templates
#13583  2025-01-15T20:39:33Z  jiashengz         fix: check group for resource info match
#30973  2025-06-12T20:37:09Z  manslaughter03    fix: wrap run release test error in case GetPodLogs failed.
#12879  2025-01-23T20:00:42Z  ryanhockstad      bugfix: Override subcharts with null values
#30777  2025-04-23T19:07:54Z  ryanhockstad      fix: null merge
#30737  2025-04-11T20:06:45Z  rpolishchuk       fix: order dependent test
#30783  2025-04-23T19:58:14Z  rpolishchuk       fix: chart icon presence test
#12968  2025-08-13T17:44:02Z  sjeandeaux        helm uninstall dry run support `--ignore-not-found`
#31050  2025-08-08T17:42:54Z  heyLu             Fix `helm pull` untar dir check with repo urls
#13119  2025-04-05T17:50:59Z  idsulik           fix(concurrency): Use channel for repoFailList errors in updateCharts
#31138  2025-08-19T19:47:25Z  islewis           fix(helm-lint): Add HTTP/HTTPS URL support for json schema references
#13471  2025-02-19T21:04:02Z  wangjingcun       Use a more direct and less error-prone return value
#30572  2025-02-25T20:43:55Z  yardenshoham      fix: error when more than one post-renderer is specified
#31021  2025-07-05T00:21:23Z  zachburg          Update tests in create_test.go and package_test.go to work in a temp directory
#31015  2025-07-17T16:01:31Z  zachburg          Add linter support for the `crds/` directory
#31019  2025-07-17T18:08:21Z  zachburg          Return early when linting if the `templates/` directory does not exist
#30898  2025-07-06T18:39:38Z  AshmitBhardwaj    Fix issue 13198
#30618  2025-03-04T21:14:47Z  AustinAbro321     Fix namespace flag not registering
```

## Helm 4 Breaking Changes

Major architectural and user-facing changes for v4

```text
#13617  2025-02-27T21:16:04Z  AustinAbro321     Refactor cmd/helm to allow library usage
#30586  2025-02-26T15:42:49Z  mattfarina        Move pkg/chart to pkg/chart/v2 to prepare for v3 charts
#30589  2025-02-26T15:42:49Z  mattfarina        Move pkg/release to pkg/release/v1 to support v3 charts
#31081  2025-07-25T18:06:33Z  mattfarina        Initial addition of v3 charts
#31165  2025-08-22T19:04:26Z  mattfarina        Initial addition of content based cache
#31178  2025-08-28T16:38:48Z  mattfarina        Add content cache to helm env
#31216  2025-09-02T14:28:33Z  mattfarina        Move to versioned packages
#31225  2025-09-02T19:18:20Z  mattfarina        Move lint pkg to be part of each chart version
#30812  2025-08-27T01:52:16Z  gjenkins8         HIP-0023: Helm support server-side apply
#31030  2025-08-14T20:55:12Z  gjenkins8         HIP-0023: Kube client support server-side apply
#31142  2025-08-21T16:06:27Z  gjenkins8         [HIP-0026] Move pkg/plugin -> internal/plugin
#31194  2025-08-28T16:39:10Z  gjenkins8         [HIP-0026] Plugin extism/v1 runtime
#31145  2025-08-22T20:12:50Z  scottrigby        [HIP-0026] Plugin runtime interface
#31146  2025-08-23T05:42:41Z  scottrigby        [HIP-0026] Plugin types and plugin apiVersion v1
#31172  2025-08-26T03:04:01Z  scottrigby        [HIP-0026] Plugin OCI installer
#31174  2025-08-26T03:17:42Z  scottrigby        [HIP-0026] Plugin tarball support for HTTP and local installers
#31176  2025-08-30T17:25:29Z  scottrigby        [HIP-0026] Plugin packaging, signing, and verification
#31196  2025-08-31T22:22:24Z  scottrigby        [HIP-0026] Remove unnecessary file i/o operations from signing and verifying
#31217  2025-09-01T01:23:50Z  scottrigby        [HIP-0026] Move Postrenderer to a plugin type
#31218  2025-09-01T17:34:59Z  gjenkins8         Remove legacy Command/Hooks from v1 Subprocess (#23)
#31219  2025-09-02T16:31:14Z  gjenkins8         Remove 'SetupPluginEnv'
#31220  2025-09-02T17:06:44Z  gjenkins8         refactor: utilize `pluginTypesIndex` for config unmarshalling
#13629  2025-08-22T18:20:18Z  gjenkins8         Rename 'atomic' -> 'rollback-on-failure'
#30982  2025-08-05T04:21:43Z  gjenkins8         Rename 'force' to 'force-replace'
#13573  2024-12-27T12:31:54Z  mattfarina        Updating to helm.sh/helm/v4
#13611  2025-01-07T17:07:28Z  mattfarina        Updating the internal version to v4
#30550  2025-02-19T20:07:47Z  mattfarina        Moving to SetOut and SetErr for Cobra
#30567  2025-02-21T20:49:30Z  mattfarina        Moving chartutil to chart/util
#30580  2025-02-24T20:15:47Z  mattfarina        Move pkg/releaseutil to pkg/release/util
#13494  2025-01-18T16:37:15Z  gjenkins8         Remove deprecated `repo add --no-update` flag
#31023  2025-07-03T15:07:20Z  gjenkins8         Remove deprecated '--create-pods' flag
#13458  2025-04-05T13:39:49Z  thudi             #13449 Resolves: Replacing NewSimpleClientSet to NewClientSet due to deprecation
#30686  2025-04-11T18:34:47Z  mattfarina        Remove deprecated code
#30749  2025-04-11T20:07:42Z  mattfarina        Removing the alpine test chart
```

## Helm 4 Refactor/Cleanup

Code quality improvements and modernization

```text
#31395  2025-10-21T19:20:09Z  wyrapeseed        chore: fix some comment format
#31365  2025-10-21T19:43:07Z  reddaisyy         refactor: use reflect.TypeFor
#31390  2025-10-21T19:49:13Z  TerryHowe         fix: improve pkg/cmd/list test coverage
#31401  2025-10-17T19:32:08Z  TerryHowe         refactor: remove unused err from pkg/registry/client.go
#31391  2025-10-15T13:02:51Z  TerryHowe         chore: rename test registry
#31408  2025-10-21T19:52:55Z  AndiDog           Improve error message when plugin source cannot be determined or a non-directory is passed
#31292  2025-09-16T19:13:06Z  reddaisyy         refactor: use strings.builder
#31286  2025-09-12T19:44:31Z  yajianggroup      refactor: use strings.CutPrefix
#31287  2025-09-16T19:28:20Z  miledxz           improve fileutil test coverage
#31303  2025-09-18T20:22:31Z  mattfarina        Update the action interfaces for chart apiversions
#31321  2025-09-24T09:41:46Z  juejinyuxitu      chore: fix some typos in comment
#30712  2025-10-10T20:55:18Z  gjenkins8         cleanup: Remove extra lint/rules.Template functions
#30980  2025-10-10T21:05:09Z  gjenkins8         cleanup: Remove/consolidate redundant kube client Interfaces
#30833  2025-10-09T20:29:29Z  gjenkins8         refactor/cleanup: Replace action 'DryRun' string with DryRunStrategy type + deprecations
#31312  2025-10-01T17:08:40Z  gjenkins8         Remove unused 'Settings' from plugin schema
#31383  2025-10-13T14:07:00Z  dirkmueller       Avoid accessing .Items on nil object
#31315  2025-09-22T23:51:28Z  benoittgt         Remove unused golangci-lint rules that produce warning
#31249  2025-09-25T01:48:52Z  banjoh            chore: add additional logging to plugin installer
#31302  2025-10-13T18:38:21Z  TerryHowe         fix: helm verify Run signature
#31270  2025-10-13T18:37:00Z  TerryHowe         chore: registry utils clean up
#31379  2025-10-13T12:48:29Z  TerryHowe         fix: clean up coverage script temp file
#31326  2025-10-07T19:45:34Z  TerryHowe         Update sign tests to use testify
#31143  2025-09-25T15:12:37Z  TerryHowe         fix: remove redundant error check
#31297  2025-09-22T23:55:10Z  TerryHowe         fix: hide notes in helm test command
#31294  2025-09-19T19:32:01Z  TerryHowe         Remove implicit support for helm lint current directory
#31301  2025-09-19T19:25:37Z  TerryHowe         chore: remove helm version `--client` option
#31198  2025-09-16T19:57:40Z  TerryHowe         fix: replace pkg/engine regular expressions with parser
#31293  2025-09-16T19:25:37Z  TerryHowe         chore: remove pkg/time which is no longer needed
#31258  2025-09-08T21:54:49Z  StephanieHhnbrg   Refactor unreachableKubeClient for testing into failingKubeClient
#31079  2025-07-22T12:30:40Z  gjenkins8         cleanup: Remove plugin deprecated 'UseTunnelDeprecated'
#31074  2025-07-18T12:34:27Z  joejulian         add missing template directory to badcrdfile testdata
#31057  2025-07-18T12:41:17Z  danilobuerger     Pass credentials when either chart repo or repo dont specify a port but it matches the default port of that scheme
#31047  2025-07-10T13:46:10Z  jingchanglu       chore: fix typo in pkg/repo/chartrepo.go
#31029  2025-07-07T21:28:31Z  gjenkins8         chore(refactor): Privatize 'k8sYamlStruct'
#30905  2025-05-23T20:33:39Z  robertsirc        forward porting 30902
#30871  2025-05-20T17:57:13Z  gjenkins8         Run test OCI registry localhost
#30863  2025-05-16T19:39:34Z  mattfarina        Adding test for list command
#30803  2025-04-25T19:47:15Z  mattfarina        Fixing windows build
#30760  2025-04-16T20:10:22Z  robertsirc        adding slog debug to a few points
#30751  2025-04-13T22:33:40Z  benoittgt         Add detailed debug logging for resource readiness states
#30713  2025-04-11T20:35:52Z  gjenkins8         cleanup: Remove Helm v2 template lint rules
#30736  2025-04-09T15:11:06Z  robertsirc        manually updating go.mod file
#30603  2025-03-21T20:18:40Z  robertsirc        converting inline log to slog
#30665  2025-03-13T15:54:46Z  mattfarina        Updating to 0.37.0 for x/net
#30611  2025-03-04T21:29:59Z  gjenkins8         chore: Remove 'coveralls'
#30592  2025-02-28T20:27:31Z  robertsirc        changing from log to slog
#30585  2025-02-25T20:27:32Z  robertsirc        removing old apis
#30566  2025-02-21T20:47:39Z  robertsirc        remove unused config.go
#30470  2025-02-19T20:10:38Z  gjenkins8         Cleanup `repotest.Server` constructors
#13665  2025-02-05T21:21:51Z  gjenkins8         chore: Remove unused `WaitAndGetCompletedPodPhase`
#13579  2025-02-05T21:21:36Z  gjenkins8         refactor: Remove duplicate `FindChartIn*RepoURL` functions
#13535  2025-02-05T21:23:50Z  gjenkins8         refactor: tlsutil use options pattern
#13538  2025-01-17T20:42:15Z  godhanipayal      Add Contextual Error Messages to RunWithContext
#13633  2025-01-17T20:16:59Z  mattfarina        Ensuring the file paths are clean prior to passing to securejoin
#13600  2025-01-14T20:42:54Z  gjenkins8         cleanup: `NewShowWithConfig` -> `NewShow`
#13601  2025-01-09T00:46:19Z  gjenkins8         cleanup: Remove superseded 'lint/rules.Values' function
#13599  2025-01-07T16:36:25Z  gjenkins8         cleanup: `ProcessDependenciesWithMerge` -> `ProcessDependencies`
#13576  2025-01-07T16:41:19Z  gjenkins8         refactor: Consolidate lint package Run() functions
#13577  2025-01-07T16:37:00Z  gjenkins8         refactor: Remove redundant `NewPullWithOpts`
#12624  2025-08-13T21:51:34Z  papdaniel         show crds command output separated by document separator
#13578  2025-04-18T19:43:53Z  gjenkins8         refactor: Remove ChartRepository `[]ChartPaths`
#13516  2025-01-24T02:30:24Z  TerryHowe         chore: fix problems with latest lint
#30844  2025-05-08T13:28:40Z  TerryHowe         fix: rename slave replica
#30829  2025-05-09T14:54:22Z  TerryHowe         Increase pkg/time test coverage
#30957  2025-06-04T17:53:06Z  acceptacross      chore: fix some function names in comment
#30824  2025-05-05T17:29:59Z  adharsh277        Fix bug in .golangci.yml configuration
#30708  2025-04-11T19:50:34Z  benoittgt         Migrate pkg to slog
#30752  2025-04-16T19:50:56Z  benoittgt         Bump golangci lint to last major version and fix static-check errors
#30872  2025-05-20T11:14:48Z  benoittgt         Bump golangci-lint version to match last golangci-lint-action
#30914  2025-05-27T14:59:02Z  benoittgt         Fix dependabot upgrade of jsonschema to v6.0.2
#13602  2025-01-17T21:06:01Z  crystalstall      refactor: using slices.Contains to simplify the code
#31002  2025-06-26T13:01:09Z  curlwget          chore: fix function in comment
#30508  2025-02-19T19:47:54Z  eimhin-rover      Update version option description with more accurate info
#30827  2025-05-06T17:59:16Z  findnature        refactor: use slices.Contains to simplify code
#31116  2025-09-02T15:27:09Z  banjoh            chore: check if go modules are tidy before build
#31065  2025-07-15T18:52:21Z  TerryHowe         chore: improve OCI debug logging
#31175  2025-08-21T18:43:12Z  cuiweixie         pkg/register: refactor to use atomic.Uint64
#30546  2025-02-19T18:55:13Z  hugehope          refactor: using slices.Contains to simplify the code
#30909  2025-06-03T21:59:11Z  jinjiadu          refactor: replace HasPrefix+TrimPrefix with CutPrefix
#31134  2025-08-14T14:35:58Z  joemicky          refactor: omit unnecessary reassignment
#31133  2025-08-14T14:38:31Z  joemicky          refactor: replace HasPrefix+TrimPrefix with CutPrefix
#31132  2025-08-19T14:51:00Z  joemicky          refactor: replace []byte(fmt.Sprintf) with fmt.Appendf
#13460  2025-04-23T22:47:36Z  justenstall       fix: replace "github.com/pkg/errors" with stdlib "errors" package
#30693  2025-03-20T19:41:17Z  linghuying        chore: make function comment match function name
#31018  2025-07-01T20:20:14Z  mattfarina        Move logging setup to be configurable
#31094  2025-08-04T14:11:21Z  mikelolasagasti   chore(deps): remove phayes/freeport module
#30781  2025-04-22T16:45:31Z  mmorel-35         chore: remove `github.com/hashicorp/go-multierror` dependency
#30785  2025-04-23T13:51:18Z  mmorel-35         fix: govulncheck workflow
#30786  2025-04-25T19:49:24Z  mmorel-35         refactor: reorganize .golangci.yml for better clarity and structure
#30800  2025-04-25T23:54:08Z  mmorel-35         fix: dep fs errors
#30810  2025-05-08T14:35:10Z  mmorel-35         chore: enable usestdlibvars linter
#30866  2025-05-20T13:47:54Z  mmorel-35         chore: enable thelper linter
#30865  2025-05-22T14:34:35Z  mmorel-35         fix: update json-patch import path and add gomodguard settings
#30809  2025-06-03T18:57:06Z  mmorel-35         chore: enable usetesting linter
#30850  2025-05-12T17:29:49Z  yetyear           refactor: use maps.Copy for cleaner map handling
#31060  2025-07-18T14:50:10Z  yumeiyin          refactor: replace Split in loops with more efficient SplitSeq
#11700  2025-08-13T21:16:25Z  suzaku            Refactor, use sort.Slice to reduce boilerplate code
#30788  2025-04-23T14:48:39Z  stephenpmurray    ref(helm): Export Chart Not Found error
#13653  2025-01-23T17:55:43Z  petercover        chore: fix some comments
#13111  2025-08-13T20:44:58Z  rawtaz            style(pkg/chartutil): add missing dots and indentation to defaultValues
#30684  2025-03-21T20:34:14Z  twz123            Remove ClientOptResolver from OCI Client
#31197  2025-09-03T19:45:58Z  tzchenxixi        chore: fix function name
#30773  2025-04-18T13:28:35Z  wangcundashang    chore: fix function name in comment
#31107  2025-08-06T19:24:06Z  Pavanipogula      test(pkg/kube): Add unit tests to wait and roundtripper files
#31106  2025-08-05T19:46:24Z  irikeish          test(pkg/kube): add test for Client.isReachable
#31058  2025-08-07T21:39:44Z  farazkhawaja      Add test coverage for get_values/metadata.go
#31033  2025-07-14T19:58:55Z  navinag1989       test: increase test coverage for pkg/cli/options.go file
#31009  2025-07-02T19:37:55Z  tpresa            test: increase test coverage for pkg/pusher
```

## Helm Project Changes

Infrastructure and project management improvements

```text
#31392  2025-10-16T10:09:09Z  TerryHowe         feature: create copilot structured context
#30904  2025-05-23T12:06:12Z  benoittgt         [Doc] Help users avoid specifying URL scheme and path with `helm registry`
#13563  2024-12-21T13:17:32Z  gjenkins8         Run `build-test` action on `dev-v3` branch
#30912  2025-06-17T19:18:31Z  Bhargavkonidena   Fix #30893 - issue templates
#30882  2025-05-20T18:17:35Z  caniszczyk        Add new LFX Insights Health Score Badge
#31077  2025-07-21T12:59:29Z  gaspergrom        fix: LFX health score badge link
#30295  2025-02-07T14:43:12Z  edithturn         Add Percona to the list of organizations using Helm
#13625  2025-01-13T18:01:23Z  shahbazaamir      ading info to install helm , referring the documentation
#30784  2025-04-22T15:37:12Z  scottrigby        chore(OWNERS): Add TerryHowe as Triage Maintainer
#31259  2025-09-07T16:52:58Z  StephanieHhnbrg   Adapt test-coverage command to be able to run for a certain package
#30497  2025-02-12T20:59:01Z  robertsirc        adding-my-key
```

## Backported to v3 (excluded from list)

These PRs were included in v4 but were also backported to v3 releases

```text
#12912  2025-03-11T23:09:32Z  hegerdes            feat: add httproute from gateway-api to create chart template
#13382  2025-02-03T17:43:38Z  TerryHowe           chore(oci): migrate to ORAS Golang library v2
#13533  2025-01-24T20:16:59Z  althmoha            fix: (toToml) renders int as float
#13581  2024-12-31T16:54:04Z  ldlb9527            Upgrade golang.org/x/net to v0.33.0 to address CVE-2024-45338
#30673  2025-04-16T21:21:28Z  nvanthao            fix: Process all hook deletions on failure
#30677  2025-04-18T19:02:37Z  dongjiang1989       chore: Update Golang to v1.24
#30696  2025-03-24T19:19:10Z  benoittgt           Inform about time spent waiting resources to be ready in slog format
#30697  2025-04-17T15:54:11Z  p-se                Fix --take-ownership for custom resources - closes #30622
#30701  2025-04-11T20:56:39Z  zanuka              updates mutate and validate web hook configs
#30741  2025-04-11T19:53:39Z  benoittgt           Bumps github.com/distribution/distribution/v3 from 3.0.0-rc.3 to 3.0.0
#30754  2025-04-16T14:18:46Z  mattfarina          Simplify the JSON Schema checking
#30775  2025-04-19T15:50:48Z  benoittgt           Bump toml
#30894  2025-05-23T19:51:14Z  benoittgt           Prevent push cmd failure in 3.18 by handling version tag resolution in ORAS memory store
#30917  2025-06-01T22:12:15Z  TerryHowe           fix: add debug logging to oci transport
#30928  2025-05-28T14:27:57Z  TerryHowe           fix: plugin installer test with no Internet
#30937  2025-05-30T19:36:14Z  TerryHowe           fix: legacy docker support broken for login
#30992  2025-08-18T17:42:02Z  TerryHowe           fix: force bearer oauth for if registry requests bearer auth
#31064  2025-09-05T02:38:59Z  kamilswiec          lint: throw warning when chart version is not semverv2
#31078  2025-07-24T19:17:08Z  8tomat8             fix: k8s version parsing to match original
#31115  2025-08-18T17:29:51Z  banjoh              fix: use username and password if provided
#31156  2025-08-22T03:20:20Z  estroz              fix: set repo authorizer in registry.Client.Resolve()
#9175   2025-04-23T18:40:52Z  dastrobu            fix: copy dependencies on aliasing to avoid sharing chart references on multiply aliased dependencies
#10309  2025-02-21T23:12:16Z  Bez625              Add hook annotation to output hook logs to client on error
```
