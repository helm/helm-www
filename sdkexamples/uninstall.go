package main

import (
	"fmt"
	"log"

	"helm.sh/helm/v4/pkg/action"
	"helm.sh/helm/v4/pkg/cli"
)

func runUninstall(logger *log.Logger, settings *cli.EnvSettings, releaseName string) error {

	actionConfig, err := initActionConfig(settings, logger)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	uninstallClient := action.NewUninstall(actionConfig)
	uninstallClient.DeletionPropagation = "foreground" // "background" or "orphan"
	uninstallClient.WaitStrategy = "watcher"

	result, err := uninstallClient.Run(releaseName)
	if err != nil {
		return fmt.Errorf("failed to run uninstall action: %w", err)
	}
	if result != nil {
		logger.Printf("result: %+v\n", result.Info)
	}

	logger.Printf("release \"%s\" uninstalled\n", releaseName)

	return nil
}
