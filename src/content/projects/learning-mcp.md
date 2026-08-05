---
title: learning-mcp
group: agents
order: 3
summary: A tutor that can't skip ahead. It decomposes a topic into a prerequisite graph and refuses to release the next element until you've demonstrated mastery of the ones it depends on.
scope:
  - 7-table prerequisite graph
  - SM-2 spaced repetition
  - 5 test modules
  - Docker
  - CI
  - MIT
tech: Python · SQLite · MCP · SM-2 · Docker · GitHub Actions
differentiator: Sequencing stops being a polite request in a prompt and becomes a data dependency the server enforces.
repo: https://github.com/ryantthomas/learning-mcp
description: An MCP server that decomposes a topic into a prerequisite graph and enforces mastery before advancing.
---

## The problem

Ask a model to teach you something across several sessions and it collapses the plan. It lays out a sensible curriculum, then — because you sounded confident, or the conversation drifted — delivers step six during step two and agrees you've understood. Everything that makes teaching work lives in the prompt, and the prompt is a suggestion.

If the next step is unavailable until a prerequisite is marked mastered in a database, the model can't skip it however the conversation goes.

## Scope

| | |
|---|---|
| Interface | 7 MCP tools — start, research, decompose, next step, drill, grade, review |
| Schema | 7 tables: topics, concepts, elements, element_edges, mastery, drills, sessions |
| Scheduling | SM-2 — per-element ease factor, repetition count, next-due date |
| Tests | 5 modules covering the scheduler, the mastery gate, decomposition, the server surface, the CLI |

## Three decisions

<div class="decision">

**The gate is enforced server-side, not prompted.** The cheap version is a system prompt saying "don't advance until they understand." It works most of the time, which is the problem — the failure is invisible and arrives exactly when you're tired and want to move on. Here the next-step tool returns nothing for a locked element. The model can be as agreeable as it likes; it has no unlocked content to hand over.

</div>

<div class="decision">

**A prerequisite DAG instead of an ordered list.** A linear syllabus is simpler and encodes a false claim — that one valid order exists. A DAG says what actually depends on what, so several elements can be legitimately available at once. It also makes the failure mode detectable: a cycle is a decomposition bug, where a bad linear ordering just silently teaches things confusingly.

</div>

<div class="decision">

**SM-2 rather than a fixed review interval.** A fixed schedule spends equal effort on what you've known for a month and what you got wrong yesterday. SM-2 is decades old, well understood, and needs three columns. I took a known algorithm because the interesting problem here is the gate, not the spacing curve.

</div>

## Verification

`test_scheduler.py` pins the SM-2 interval math against known sequences. `test_mastery.py` covers the gate itself — a locked element stays locked, satisfying the last inbound edge unlocks it, a failed drill moves state backwards. Those are the two places where a bug produces a plausible-looking session that teaches the wrong thing in the wrong order.

## Constraints

- Single-learner, local SQLite. No classroom model.
- Content quality is the model's. This governs sequencing and pacing; it doesn't verify the material is correct.
- Grading is model-assisted — better at "did you address the concept" than precise factual scoring.

## Next

- Separate researched content from graph structure, so a topic can be re-decomposed without losing its drills.
- Store a confidence signal alongside mastery. A lucky guess and a solid answer currently look identical to the scheduler.
