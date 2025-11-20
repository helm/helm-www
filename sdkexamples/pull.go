package main

import (
	"fmt"
	"log"

	"helm.sh/helm/v4/pkg/action"
	"helm.sh/helm/v4/pkg/cli"
)

func runPull(logger *log.Logger, settings *cli.EnvSettings, chartRef, chartVersion string) error {

	actionConfig, err := initActionConfig(settings, logger)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	pullClient := action.NewPull(action.WithConfig(actionConfig))
	// client.RepoURL = ""
	pullClient.DestDir = "./"
	pullClient.Settings = settings
	pullClient.Version = chartVersion

	registryClient, err := newRegistryClient(
		settings,
		pullClient.CertFile,
		pullClient.KeyFile,
		pullClient.CaFile,
		pullClient.InsecureSkipTLSverify,
		pullClient.PlainHTTP)
	if err != nil {
		return fmt.Errorf("failed to created registry client: %w", err)
	}
	actionConfig.RegistryClient = registryClient

	result, err := pullClient.Run(chartRef)
	if err != nil {
		return fmt.Errorf("failed to pull chart: %w", err)
	}

	logger.Printf("%+v", result)

	return nil
}
