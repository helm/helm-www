package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"

	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/cli"
	"helm.sh/helm/v3/pkg/registry"
)

var helmDriver string = os.Getenv("HELM_DRIVER")

func initActionConfig(settings *cli.EnvSettings, logger *log.Logger) (*action.Configuration, error) {
	return initActionConfigList(settings, logger, false)
}

func initActionConfigList(settings *cli.EnvSettings, logger *log.Logger, allNamespaces bool) (*action.Configuration, error) {

	actionConfig := new(action.Configuration)

	namespace := func() string {
		// For list action, you can pass an empty string instead of settings.Namespace() to list
		// all namespaces
		if allNamespaces {
			return ""
		}
		return settings.Namespace()
	}()

	if err := actionConfig.Init(
		settings.RESTClientGetter(),
		namespace,
		helmDriver,
		logger.Printf); err != nil {
		return nil, err
	}

	return actionConfig, nil
}

func newRegistryClient(settings *cli.EnvSettings, plainHTTP bool) (*registry.Client, error) {
	opts := []registry.ClientOption{
		registry.ClientOptDebug(settings.Debug),
		registry.ClientOptEnableCache(true),
		registry.ClientOptWriter(os.Stderr),
		registry.ClientOptCredentialsFile(settings.RegistryConfig),
	}
	if plainHTTP {
		opts = append(opts, registry.ClientOptPlainHTTP())
	}

	// Create a new registry client
	registryClient, err := registry.NewClient(opts...)
	if err != nil {
		return nil, err
	}
	return registryClient, nil
}

func newRegistryClientTLS(settings *cli.EnvSettings, logger *log.Logger, certFile, keyFile, caFile string, insecureSkipTLSverify, plainHTTP bool) (*registry.Client, error) {
	if certFile != "" && keyFile != "" || caFile != "" || insecureSkipTLSverify {
		registryClient, err := registry.NewRegistryClientWithTLS(
			logger.Writer(),
			certFile,
			keyFile,
			caFile,
			insecureSkipTLSverify,
			settings.RegistryConfig,
			settings.Debug)

		if err != nil {
			return nil, err
		}
		return registryClient, nil
	}
	registryClient, err := newRegistryClient(settings, plainHTTP)
	if err != nil {
		return nil, err
	}
	return registryClient, nil
}

func main() {

	logger := log.Default()

	// For convenience, initialize SDK setting via CLI mechanism
	settings := cli.New()

	// Release name, chart and values
	releaseName := "helm-sdk-example"
	chartRef := "oci://ghcr.io/stefanprodan/charts/podinfo"
	releaseValues := map[string]interface{}{
		"replicaCount": "2",
	}

	// Pull the chart to the local filesystem
	if err := runPull(logger, settings, chartRef, "6.4.1"); err != nil {
		fmt.Printf("failed to run pull: %+v", err)
		os.Exit(1)
	}

	// Install the chart (from the pulled chart local archive)
	if err := runInstall(context.TODO(), logger, settings, releaseName, "./podinfo-6.4.1.tgz", "", releaseValues); err != nil {
		fmt.Printf("failed to run install: %+v", err)
		os.Exit(1)
	}

	// List installed charts
	if err := runList(logger, settings); err != nil {
		fmt.Printf("failed to run list: %+v", err)
		os.Exit(1)
	}

	//
	fmt.Print("Chart installed. Press 'Return' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')

	// Upgrade to version 6.5.4, updating the replicaCount to three
	releaseValues["replicaCount"] = "3"
	if err := runUpgrade(context.TODO(), logger, settings, releaseName, chartRef, "6.5.4", releaseValues); err != nil {
		fmt.Printf("failed to run upgrade: %+v", err)
		os.Exit(1)
	}

	// List installed charts
	if err := runList(logger, settings); err != nil {
		fmt.Printf("failed to run list: %+v", err)
		os.Exit(1)
	}

	//
	fmt.Print("Chart upgraded. Press 'Return' to continue...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')

	// Uninstall the chart
	if err := runUninstall(logger, settings, releaseName); err != nil {
		fmt.Printf("failed to run uninstall: %+v", err)
		os.Exit(1)
	}
}
