# The Chart Best Practices Guide

This guide covers the Helm Team's considered best practices for creating charts.
It focuses on how charts should be structured.

We focus primarily on best practices for charts that may be publicly deployed.
We know that many charts are for internal-use only, and authors of such charts
may find that their internal interests override our suggestions here.

## Table of Contents

- [General Conventions](./#conventions): Learn about general chart conventions.
- [Values Files](./#values): See the best practices for structuring `values.yaml`.
- [Templates](./#templates): Learn some of the best techniques for writing templates.
- [Requirements](./#requirements): Follow best practices for `requirements.yaml` files.
- [Labels and Annotations](./#labels): Helm has a _heritage_ of labeling and annotating.
- Kubernetes Resources:
	- [Pods and Pod Specs](./#pods): See the best practices for working with pod specifications.
	- [Role-Based Access Control](./#role-based-access-control): Guidance on creating and using service accounts, roles, and role bindings.
	- [Custom Resource Definitions](./#custom_resource_definitions): Custom Resource Definitions (CRDs) have their own associated best practices.

