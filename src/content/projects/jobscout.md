---
title: jobscout
group: tooling
order: 5
summary: A crawler that reads companies' own applicant tracking systems rather than aggregators, then filters on what actually disqualifies a role — seniority, geography, and stated years of experience.
scope:
  - 7 ATS platforms
  - 438 live boards
  - 27,140 postings
  - zero dependencies
tech: Python 3.11 standard library only — no requests, no scraper, no framework
differentiator: Most job boards are a thin view over the same handful of ATS APIs. Read those directly and every row is a live posting with a verifiable requirement.
private: true
description: A dependency-free crawler reading seven ATS platforms directly, filtering on seniority, geography and years of experience.
---

## The problem

Aggregator search collapses under a specific query. Ask for remote data roles under an experience ceiling and you get thousands of results dominated by senior and on-site posts, duplicates, and reposts of roles that closed months ago. The filters aggregators expose — title, location, a "remote" toggle — aren't the ones that decide whether it's worth applying. The years-of-experience requirement appears only in the posting body.

## The insight

Almost every company job board is a thin front end over one of about seven applicant tracking systems, each exposing the public JSON endpoint the careers page itself consumes.

| Platform | Endpoint pattern |
|---|---|
| Greenhouse | `boards-api.greenhouse.io/v1/boards/{token}/jobs` |
| Ashby | `api.ashbyhq.com/posting-api/job-board/{token}` |
| Lever | `api.lever.co/v0/postings/{token}?mode=json` |
| Workday | `{tenant}.{wdN}.myworkdayjobs.com/wday/cxs/…` |
| SmartRecruiters | `api.smartrecruiters.com/v1/companies/{token}/postings` |
| Recruitee | `{token}.recruitee.com/api/offers/` |
| Workable | `apply.workable.com/api/v1/widget/accounts/{token}` |

Read those directly and you get live postings, no duplicates, no expired reposts, and the full description text — the only place the real requirement is written down.

**One run:** 438 live boards · 27,140 postings · 87 qualifying remote data roles · 15 entry-level software roles.

## Three decisions

<div class="decision">

**Two-phase filtering.** Fetching every full description across 27,000 postings is slow and mostly wasted, since title and location eliminate the majority. Phase one filters on fields the list endpoints return free; phase two fetches bodies only for survivors. The ordering is the difference between a run that finishes and one that doesn't.

</div>

<div class="decision">

**Zero dependencies, on purpose.** `requests` would have been more comfortable. It doesn't earn its place: this makes plain GETs against seven JSON APIs and `urllib` does that. It runs anywhere Python 3.11 does, with nothing that can break it in six months. A deliberate constraint, not a missing feature.

</div>

<div class="decision">

**Role families in one file.** Matching rules live in a single `ROLE_FAMILIES` structure, so re-aiming the whole search is a one-file edit rather than a change across adapters. The substantive call inside it was an *adjacent analyst* family — product, revenue, operations, marketing — on the theory that they want the same skills under a different department's title. That's where most of the additional volume came from.

</div>

## Verification

Every run writes both sides of the decision, `qualified.json` and `rejected.json`, so a filter change can be diffed rather than trusted. Rejections are the more useful artifact — an over-filtered result set looks identical to a genuinely thin market, so spot-checking what got dropped is the only way to catch a filter that's too aggressive. Postings that don't state a requirement always pass.

## Constraints

- iCIMS and Taleo unsupported, so a meaningful slice of large non-tech employers is invisible.
- Workday coverage is per-tenant and shallow — each tenant is added by hand.
- Company lists are curated, not discovered. It searches a known universe.
- No notifications, scheduling or database. It runs and emits Markdown.

## Next

- Persist runs to SQLite instead of JSON, so "what's new since last week" is a query.
- An iCIMS adapter before extending Workday further — the bigger coverage gap.
