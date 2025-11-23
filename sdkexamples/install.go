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

func runInstall(ctx context.Context, logger *log.Logger, settings *cli.EnvSettings, releaseName string, chartRef string, chartVersion string, releaseValues map[string]interface{}) error {

	actionConfig, err := initActionConfig(settings, logger)
	if err != nil {
		return fmt.Errorf("failed to init action config: %w", err)
	}

	installClient := action.NewInstall(actionConfig)

	installClient.DryRunStrategy = "none"
	installClient.WaitStrategy = "watcher"
	installClient.ReleaseName = releaseName
	installClient.Namespace = settings.Namespace()
	installClient.Version = chartVersion

	registryClient, err := newRegistryClient(
		settings,
		installClient.CertFile,
		installClient.KeyFile,
		installClient.CaFile,
		installClient.InsecureSkipTLSverify,
		installClient.PlainHTTP)
	if err != nil {
		return fmt.Errorf("failed to created registry client: %w", err)
	}
	installClient.SetRegistryClient(registryClient)

	chartPath, err := installClient.ChartPathOptions.LocateChart(chartRef, settings)
	if err != nil {
		return err
	}

	providers := getter.All(settings)

	charter, err := loader.Load(chartPath)
	if err != nil {
		return err
	}

	chartAccessor, err := chart.NewDefaultAccessor(charter)
	if err != nil {
		return fmt.Errorf("error creating chart accessor: %w", err)
	}

	// Check chart dependencies to make sure all are present in /charts
	if chartDependencies := chartAccessor.MetaDependencies(); chartDependencies != nil {
		if err := action.CheckDependencies(charter, chartDependencies); err != nil {
			err = fmt.Errorf("failed to check chart dependencies: %w", err)
			if !installClient.DependencyUpdate {
				return err
			}

			manager := &downloader.Manager{
				Out:              logger.Writer(),
				ChartPath:        chartPath,
				Keyring:          installClient.ChartPathOptions.Keyring,
				SkipUpdate:       false,
				Getters:          providers,
				RepositoryConfig: settings.RepositoryConfig,
				RepositoryCache:  settings.RepositoryCache,
				Debug:            settings.Debug,
				RegistryClient:   installClient.GetRegistryClient(),
			}
			if err := manager.Update(); err != nil {
				return err
			}
			// Reload the chart with the updated Chart.lock file.
			if charter, err = loader.Load(chartPath); err != nil {
				return fmt.Errorf("failed to reload chart after repo update: %w", err)
			}
		}
	}

	_, err = installClient.RunWithContext(ctx, charter, releaseValues)
	if err != nil {
		return fmt.Errorf("failed to run install: %w", err)
	}

	logger.Printf("release created")

	return nil
}
