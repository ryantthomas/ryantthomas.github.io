---
title: pantry-mcp
group: agents
order: 2
summary: An MCP server over a normalized SQLite database of recipes, inventory and cooking decisions. Ranks what you've already saved by how little you'd have to buy.
scope:
  - 18 MCP tools
  - 8-table normalized schema
  - 7 test modules
  - CI on every push
  - MIT
tech: Python · SQLite · MCP · pytest · GitHub Actions
differentiator: The interesting part isn't recipes — it's unit normalization and ingredient identity, which is where this class of tool quietly fails.
repo: https://github.com/ryantthomas/pantry-mcp
description: An MCP server over a normalized SQLite cooking data lake — inventory, recipe ranking, and a decision journal.
diagram: /assets/pantry-mcp-schema.svg
diagramAlt: Entity-relationship diagram of the pantry-mcp SQLite schema, showing recipes, ingredients, recipe_ingredients, inventory, tags, recipe_tags, recipe_links and decisions tables with their foreign keys.
diagramCaption: Eight tables. <code>recipe_ingredients</code> carries quantity and unit; <code>inventory</code> is what's physically in the kitchen; <code>decisions</code> is the journal that makes it a data lake rather than a recipe box.
---

## The problem

Ask a model what to cook and it invents something plausible — ignoring the recipes you already like, and not knowing what's in your kitchen. The fix isn't a better prompt. It's a real data store and a set of operations narrow enough that the model can't wander.

Underneath is a data-modeling problem. "2 tbsp butter", "30g butter" and "1/4 stick" are one ingredient at three quantities in three unit systems, and a naive schema will tell you you're short while you're holding a full stick.

## Scope

| | |
|---|---|
| Interface | 18 MCP tools — search, inventory, ranking, import, scaling, rating, shopping list, decision journal |
| Schema | 8 tables; `base_quantity` + `dimension` hold normalized units, `match_key` resolves ingredient identity |
| Import | Parses a site's own structured data rather than reconstructing recipes from model memory |
| Tests | 7 modules, fixture-based — no network in CI |

## Three decisions

<div class="decision">

**Import from structured data, never from the model.** Letting the model read a page and write out the recipe works, and it silently rounds. Recipe sites publish machine-readable data, so the importer parses that. The model picks *which* recipe; it never transcribes quantities. A language model is the wrong tool for a job with an exact answer.

</div>

<div class="decision">

**Normalize units on write, not on read.** Converting at query time puts conversion in the hot path of every ranking query, where a failure becomes a wrong answer rather than a loud error. On write means one canonical unit per ingredient, ranking is plain SQL, and anything unparseable fails at import with a human present.

</div>

<div class="decision">

**Scaling returns a projection instead of saving.** Doubling a recipe looks like an edit and isn't. If scaling wrote back, saved recipes would drift every time someone cooked for a different number of people. Scaling returns a computed view; changing an actual ingredient creates a linked variant.

</div>

## Verification

Tests concentrate where this kind of tool fails quietly: `test_units.py` and `test_scaling.py` cover conversion and proportional math, `test_identity.py` covers ingredient matching. Parsing and import tests run against fixtures, so CI doesn't depend on someone else's markup staying still.

## Constraints

- Single-user, local SQLite. No sync, accounts or server.
- Not a nutrition tracker.
- Import depends on sites publishing structured data. Ones that don't are out of scope by design rather than scraped.

## Next

- Model ingredient identity as an explicit synonym table rather than a match key — "scallions" and "green onions" are the same thing, and a key can't express that.
- Version the decision journal separately from recipes, so cooking history survives a recipe edit.
