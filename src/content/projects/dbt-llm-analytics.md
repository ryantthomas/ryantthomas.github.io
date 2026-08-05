---
title: dbt-llm-analytics
group: tooling
order: 4
summary: A free hands-on course teaching dbt on real National Park Service biodiversity data, plus a read-only MCP server for querying the finished warehouse in plain English.
scope:
  - 5,824 species
  - 23,000 observations
  - 4 staging + 3 mart models
  - 6-step interactive lab
  - MIT
tech: dbt · DuckDB · Python · MCP · Killercoda
differentiator: Real public data with real messiness, not a toy `jaffle_shop` clone — and the lab runs in a browser with nothing to install.
repo: https://github.com/ryantthomas/dbt-llm-analytics
extraLinks:
  - label: Tutorial landing page
    url: https://ryantthomas.github.io/dbt-llm-analytics/
description: A free hands-on dbt course on real NPS biodiversity data, plus a read-only DuckDB MCP server.
---

## The problem

Most dbt tutorials run on `jaffle_shop` — a handful of tidy rows invented to make the example work. You finish having typed the commands without meeting the thing dbt exists for: real data with inconsistent categories and missing values. The tests pass first try, so you never learn why tests are there.

The second gap is the ending. Tutorials stop at a built model, which is where the interesting question starts: who queries it, and how?

## Scope

| | |
|---|---|
| Data | NPS biodiversity — 5,824 species, ~23,000 observations, four parks |
| dbt project | 4 staging models, 3 marts, schema tests and column docs in YAML |
| Written tutorial | 6 parts, `dbt init` through testing and documentation |
| Interactive lab | 6-step Killercoda scenario with per-step verify scripts, nothing to install |
| MCP server | 3 tools over DuckDB; `run_query` is SELECT-only |

## Three decisions

<div class="decision">

**Real public data instead of a synthetic example.** Synthetic data makes a tutorial easier to write and worse to learn from, because every edge case was removed in advance. The NPS dataset has inconsistent conservation-status values and sparse columns, so the staging layer has real work to do and a schema test can genuinely fail.

</div>

<div class="decision">

**DuckDB rather than a cloud warehouse.** A cloud warehouse is more realistic and adds a signup, credentials and a free-tier clock to step zero — which is where tutorials lose people. DuckDB runs in-process from a file, so `dbt build` works offline in seconds. What's lost is warehouse-specific SQL and permissions, which is right to defer past someone's first dbt project.

</div>

<div class="decision">

**SELECT-only, enforced in the server rather than the prompt.** The MCP server hands a model a SQL execution tool, so the question is what happens when it writes a `DROP`. Telling it not to in the tool description is not a control. The restriction lives in `run_query` before execution — same principle as the prerequisite gate in learning-mcp.

</div>

## Verification

The dbt project's own schema tests are the verification, which is the point of the exercise — `not_null`, `unique` and accepted-values tests across staging and marts, run by `dbt build`. The Killercoda scenario adds a per-step verify script so a reader who mistypes a model doesn't discover it three steps later.

## Constraints

- Teaches dbt Core, not dbt Cloud — no orchestration or job scheduling.
- The MCP server is deliberately minimal: three tools, no semantic layer.
- Not incremental. The dataset is small enough that everything is a full refresh.

## Next

- A part seven on incremental models. It's the first thing that bites in a real project and the tutorial stops just short of it.
- Feed the MCP server the column documentation already written in the YAML — it would make its SQL better for free.
