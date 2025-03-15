---
title: "Installing"
weight: 2
---

## Installing

### Why aren't there native packages of Helm for Fedora and other Linux distros?

The Helm project does not maintain packages for operating systems and
environments. The Helm community may provide native packages and if the Helm
project is made aware of them they will be listed. This is how the Homebrew
formula was started and listed. If you're interested in maintaining a package,
we'd love it.

### Why do you provide a `curl ...|bash` script?

There is a script in our repository (`scripts/get-helm-3`) that can be executed
as a `curl ..|bash` script. The transfers are all protected by HTTPS, and the
script does some auditing of the packages it fetches. However, the script has
all the usual dangers of any shell script.

We provide it because it is useful, but we suggest that users carefully read the
script first. What we'd really like, though, are better packaged releases of
Helm.

### How do I put the Helm client files somewhere other than their defaults?

Helm uses the XDG structure for storing files. There are environment variables
you can use to override these locations:

- `$XDG_CACHE_HOME`: set an alternative location for storing cached files.
- `$XDG_CONFIG_HOME`: set an alternative location for storing Helm
  configuration.
- `$XDG_DATA_HOME`: set an alternative location for storing Helm data.

Note that if you have existing repositories, you will need to re-add them with
`helm repo add...`.

