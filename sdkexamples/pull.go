package main

import (
	"fmt"
	"log"

	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/cli"
)

func runPull(logger *log.Logger, settings *cli.EnvSettings, chartRef, chartVersion string) error {

	actionConfig, err := initActionConfig(settings, logger)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	registryClient, err := newRegistryClient(settings, false)
	if err != nil {
		return fmt.Errorf("failed to created registry client: %w", err)
	}
	actionConfig.RegistryClient = registryClient

	pullClient := action.NewPullWithOpts(
		action.WithConfig(actionConfig))
	// client.RepoURL = ""
	pullClient.DestDir = "./"
	pullClient.Settings = settings
	pullClient.Version = chartVersion

	result, err := pullClient.Run(chartRef)
	if err != nil {
		return fmt.Errorf("failed to pull chart: %w", err)
	}

	logger.Printf("%+v", result)

	return nil
}
