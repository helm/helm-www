---
sidebar_position: 1
sidebar_label: SDK Features
title: Helm 4 SDK Features
---

This page shows new features introduced for the Helm SDK in Helm 4.

## Context cancellation for wait operations

The Helm Kubernetes `Client`, defined in the Go package
`helm.sh/helm/v4/pkg/kube`, now provides the field
`WaitContext`. This is for allowing wait operations
to be canceled via context cancellation
besides the existing timeout mechanism.
If specified, wait operations will be canceled when
either the context is canceled or the timeout is
reached, whichever happens first.

This feature is useful for speeding up cancellation
of long-running wait operations. For example, in a
Kubernetes controller using the Helm SDK, the
controller may reach a state where the inputs
for the Helm release have changed while a wait
operation is still ongoing. In this case, the
controller can cancel the wait operation via
context cancellation and start a new release
sooner, instead of waiting for the timeout.

**Note 1**: The main advantage of this feature
is providing a way to cancel wait operations
that is detached from the context passed to
the Helm actions themselves. This means that
the context passed here will not affect
*apply* operations.

**Note 2**: Helm leaves the release on the "pending"
state when a wait operation is canceled or times out.
This leaves the release locked. SDK users should
handle this case appropriately, for example:

```go
if status := rls.Info.Status; status.IsPending() {
	rls.SetStatus(helmrelease.StatusFailed,
		fmt.Sprintf("Release unlocked from stale '%s' state", status.String()))
	if err = cfg.Releases.Update(rls); err != nil {
		// handle error
		return err
	}
	// handle success
}
```

This marks the release as failed, unlocking it
for future operations. This is just one way to
handle the situation; SDK users may choose other
approaches as appropriate for their use cases.
