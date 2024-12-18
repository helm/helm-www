package main

import (
	"fmt"
	"log"

	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/cli"
)

func runList(logger *log.Logger, settings *cli.EnvSettings) error {

	actionConfig, err := initActionConfigList(settings, logger, false)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	listClient := action.NewList(actionConfig)
	// Only list deployed
	//listClient.Deployed = true
	listClient.All = true
	listClient.SetStateMask()

	results, err := listClient.Run()
	if err != nil {
		return fmt.Errorf("failed to run list action: %w", err)
	}

	for _, rel := range results {
		logger.Printf("list result: %+v", rel)
	}

	return nil
}
