package main

import (
	"context"
	"fmt"
	"log"

	"helm.sh/helm/v4/pkg/action"
	"helm.sh/helm/v4/pkg/chart"
	"helm.sh/helm/v4/pkg/chart/loader"
	"helm.sh/helm/v4/pkg/cli"
	"helm.sh/helm/v4/pkg/downloader"
	"helm.sh/helm/v4/pkg/getter"
)

func runUpgrade(ctx context.Context, logger *log.Logger, settings *cli.EnvSettings, releaseName string, chartRef string, chartVersion string, releaseValues map[string]interface{}) error {
	actionConfig, err := initActionConfig(settings, logger)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	upgradeClient := action.NewUpgrade(actionConfig)

	upgradeClient.Namespace = settings.Namespace()
	upgradeClient.DryRunStrategy = "none"
	upgradeClient.Version = chartVersion
	upgradeClient.WaitStrategy = "watcher"

	registryClient, err := newRegistryClient(
		settings,
		upgradeClient.CertFile,
		upgradeClient.KeyFile,
		upgradeClient.CaFile,
		upgradeClient.InsecureSkipTLSverify,
		upgradeClient.PlainHTTP)
	if err != nil {
		return fmt.Errorf("missing registry client: %w", err)
	}
	upgradeClient.SetRegistryClient(registryClient)

	chartPath, err := upgradeClient.ChartPathOptions.LocateChart(chartRef, settings)
	if err != nil {
		return err
	}

	providers := getter.All(settings)

	// Check chart dependencies to make sure all are present in /charts
	charter, err := loader.Load(chartPath)
	if err != nil {
		return fmt.Errorf("failed to load chart: %w", err)
	}

	chartAccessor, err := chart.NewDefaultAccessor(charter)
	if err != nil {
		return fmt.Errorf("error creating chart accessor: %w", err)
	}

	if chartDependencies := chartAccessor.MetaDependencies(); chartDependencies != nil {
		if err := action.CheckDependencies(charter, chartDependencies); err != nil {
			err = fmt.Errorf("failed to check chart dependencies: %w", err)
			if !upgradeClient.DependencyUpdate {
				return err
			}

			man := &downloader.Manager{
				Out:              logger.Writer(),
				ChartPath:        chartPath,
				Keyring:          upgradeClient.ChartPathOptions.Keyring,
				SkipUpdate:       false,
				Getters:          providers,
				RepositoryConfig: settings.RepositoryConfig,
				RepositoryCache:  settings.RepositoryCache,
				Debug:            settings.Debug,
			}
			if err := man.Update(); err != nil {
				return err
			}
			// Reload the chart with the updated Chart.lock file.
			if charter, err = loader.Load(chartPath); err != nil {
				return fmt.Errorf("failed to reload chart after repo update: %w", err)
			}
		}
	}

	release, err := upgradeClient.RunWithContext(ctx, releaseName, charter, releaseValues)
	if err != nil {
		return fmt.Errorf("failed to run upgrade action: %w", err)
	}

	logger.Printf("release: %+v", release)

	return nil
}
