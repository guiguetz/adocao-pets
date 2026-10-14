# Conventions

## Conventional Commits & Semantic Versioning

All changes to this repository MUST follow the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification. Versioning MUST strictly adhere to [Semantic Versioning 2.0.0](https://semver.org/).

### Commit Message Format

`<type>(<scope>): <description>` (Space after colon is MANDATORY)

### Types & Version Bumps

- `feat`: Minor (x.Y.z) - New feature
- `fix`: Patch (x.y.Z) - Bug fix
- `perf`: Patch (x.y.Z) - Performance improvement
- `docs`, `chore`, `style`, `refactor`, `test`: No bump (unless breaking)
- `BREAKING CHANGE:` (or `!` after type): Major (X.y.z)

## GitHub & Git Operations

- No direct work on `main` or `master`. Every task MUST start with a feature branch or worktree via `kickoff-branch`.
- Use `gh repo clone` not `git clone` for GitHub repos
- Use `gh run view` / `gh run watch` for CI status
- Verify auth with `gh auth status` before operations
- **Git Attribution:** NEVER include `Co-authored-by`, `Co-Authored-By`, or any other footer that attributes code to an AI agent.
- Never call GitHub REST API directly (curl, fetch, etc.)
- Never create GitHub issues from automated workflows — produce local .md files in specs/ instead

## Agent Workflow Mandates

**AGENTS MUST NEVER BYPASS THE BIGPOWERS WORKFLOW.**
You are operating within the `bigpowers` spec-driven development methodology.

- **No Direct Coding:** When a user issues a directive like "build feature X" or "go epic 10", you MUST NOT execute the request by writing code directly.
- **Required Skills:** You MUST route all work through the appropriate bigpowers skills.
  - Start with `survey-context` if you lack context.
  - Use `plan-work` to flesh out tasks in `specs/epics/eNN-*.yaml` (with `verify:` per task) before writing any feature code.
  - Use `develop-tdd` or `execute-plan` to implement the plan.
  - Use `investigate-bug` for bug reports before writing a fix.
- **Verification Mandate:** Every story implementation MUST end with a step-by-step manual verification script provided to the user. You must wait for the user to confirm behavioral correctness (UAT) before declaring the story done or moving to the next.
- **Verification:** You MUST verify every change with tests. Code generation without a corresponding plan in `specs/` is strictly forbidden.

## Always Green / Shift Left

Solo developers own the whole codebase. **Always Green** means Preflight and CI are green before any forward work — not "green enough for this task."

**Shift Left (1-10-100):** Defects cost roughly 1× to fix in development, 10× in integration, 100× in production.

**Preflight** — the project's full local verification stack (chained from test, lint, typecheck, and build commands recorded in `CLAUDE.md`). Preflight MUST pass before kickoff, develop, or verify phases advance.

## Discovered Defects

Any **reproducible gate failure** encountered during unrelated work is a discovered defect — not optional background noise.

**fix-or-log ladder (mandatory):**

1. **quick-fix** — trivial, data-only, or single-file fixes within guardrails.
2. **fix-bug** — when quick-fix guardrails abort, or the failure needs investigation (`specs/bugs/BUG-*.md` + TDD).
3. **Log** — only when reproduction is blocked after good-faith attempt; write a BUG spec and stop forward work on the original task until triaged.

Discovered fixes ship in the **same PR** as the original work but in **separate commits** (Conventional Commits). Never narrate a failure and continue.

## Specs Output Convention

All planning output goes in `specs/`. Structure:

- `specs/product/` — SCOPE_LATEST.yaml, VISION_LATEST.yaml, GLOSSARY_LATEST.yaml
- `specs/epics/` — epic capsules (eNN-slug/)
- `specs/tech-architecture/` — tech-stack.md, security, test, design plans
- `specs/bugs/` — BUG-*.md files
- `specs/adr/` — architecture decision records

## Risk Tiers

### P0 — Critical (never violate)

- **[always-green]**: Preflight and CI must be green before forward work.
- **[no-direct-coding]**: Route feature work through bigpowers skills — no ad-hoc implementation without a plan in `specs/`.

### P1 — High (fix before merge)

- **[conventional-commits]**: All commits follow Conventional Commits; semantic-release owns version bumps.
- **[test-on-change]**: New functions and bug fixes include tests; regressions get regression tests.
- **[branch-protection]**: No direct work on `main`/`master`; feature branches via `kickoff-branch`.

### P2 — Medium (address in same epic or next)

- **[file-size-cap]**: Source files under 300 lines unless listed in § File-Size Exceptions.
- **[handoff-signaling]**: Critical-path skills write `handoff.next_skill` to `state.yaml`.

### P3 — Low (best effort)

- **[boy-scout]**: Leave touched files at least as clean as found.
- **[terse-when-heavy]**: Switch to `terse-mode` when context exceeds ~20 turns.
