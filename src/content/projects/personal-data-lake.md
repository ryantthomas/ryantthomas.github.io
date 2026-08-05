---
title: Personal Data Lake
group: platforms
order: 1
summary: A personal data lake and knowledge graph on Google Cloud, provisioned end-to-end in Terraform and deployed from GitHub Actions on every push.
scope:
  - 3 ingestion pipelines
  - 11 GCP services
  - BigQuery raw → knowledge
  - daily Cloud Scheduler runs
  - 38 commits
tech: Terraform · BigQuery · Cloud Run · dlt · GraphRAG · Workload Identity Federation · GitHub Actions
differentiator: "`terraform apply` takes it from an empty project to a running lake — IAM, secrets and schedulers included. No console clicking."
repo: https://github.com/ryantthomas/personal-data-lake
description: A personal data lake and knowledge graph on GCP, provisioned end-to-end in Terraform.
diagram: /assets/personal-data-lake-architecture.svg
diagramAlt: "Architecture diagram: GitHub Actions deploys via Workload Identity Federation to Artifact Registry; Cloud Run Jobs run dlt pipelines for Discord, Gmail and Calendar into BigQuery raw; a GraphRAG extraction job writes entities and relationships into BigQuery knowledge; a Cloud Run MCP service serves it back to Claude; Cloud Scheduler triggers daily; Secret Manager holds credentials."
diagramCaption: Push to <code>main</code> → Actions authenticates with Workload Identity Federation → images to Artifact Registry → <code>terraform apply</code> → Cloud Run. Scheduler triggers ingestion daily; nothing runs between jobs.
---

## The problem

Three services that don't talk to each other, and none of them answer the question I actually have: what have I committed to, and to whom? I wanted one queryable layer that resolves the same person across a Discord handle, an email address and a calendar invite — and knows a message from an open commitment.

The harder constraint was operational. It had to cost near-zero at idle and rebuild from an empty GCP project, or it wasn't finished.

## Scope

| | |
|---|---|
| Infrastructure | 11 Terraform files: BigQuery, Cloud Run services and jobs, Artifact Registry, IAM, Secret Manager, Cloud Scheduler, GCS state backend |
| Data | 3 sources → BigQuery `raw` → `knowledge` (entities, relationships, processed chunks) |
| Serving | GraphRAG query API and an MCP server with OAuth 2.1, both on Cloud Run |
| Deploy | GitHub Actions via Workload Identity Federation — no long-lived key exists |
| Ops | Cloud Scheduler daily; everything scales to zero between runs |

## Three decisions

<div class="decision">

**dlt instead of Airbyte.** Airbyte is the obvious choice and wants always-on compute. This pipeline is idle 23 hours a day, so dlt runs the same extract-and-load as Cloud Run Jobs that scale to zero. Traded a managed UI for a near-zero idle bill — right at three sources, wrong at thirty.

</div>

<div class="decision">

**Workload Identity Federation instead of a service-account key.** The quick path leaves a permanent credential to my GCP project sitting in GitHub. WIF exchanges GitHub's OIDC token for a short-lived one, scoped to this repo. Cost an afternoon of IAM debugging; there's now no key to leak or rotate.

</div>

<div class="decision">

**Twelve MCP tools down to five.** One tool per access pattern reads as thorough and is worse: every definition is permanent context cost, and a large flat menu makes the model choose badly between near-identical options. Collapsing to five with a routing argument improved tool selection. Tool count is interface design, not a feature count.

</div>

## What broke

Connecting the MCP server to Claude's hosted client took six commits over two days — two faults stacked. The RFC 9728 metadata advertised the wrong resource URL, so OAuth completed and the client walked away. And FastMCP was rejecting the backend's `Accept` header, which surfaced as a generic connection failure that looked identical to the auth problem. I fixed the metadata first, saw no change, and assumed the fix was wrong. Now I read the transport layer before the application layer.

Separately: the audit job kept dying until I found Cloud Run gen2's 512Mi floor and the job sized below it.

## Verification

`terraform plan` reporting no changes against live infrastructure is the check that matters — it's what makes "the repo is the system" true rather than aspirational. A smoke script exercises the deployed MCP server over HTTP, and the extraction job keeps a processed-chunk ledger so re-runs are idempotent.

## Constraints

- Single-user by construction. Identity is one configured person; no tenancy model.
- Extraction costs real money, so jobs ship with conservative chunk caps.
- Entity resolution auto-merges only on strong signals. Everything weaker becomes a candidate a human confirms — precision over recall, deliberately.

## Next

- Move the raw → knowledge transformation into dbt. It grew inside the extraction job; dbt is its right home and would bring tests and lineage.
- A backfill mode separate from the daily incremental path.
